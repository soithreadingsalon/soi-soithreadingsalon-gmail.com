import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GATEWAY = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

function authHeaders() {
  const lk = process.env.LOVABLE_API_KEY;
  const gk = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!lk) throw new Error("LOVABLE_API_KEY missing");
  if (!gk) throw new Error("GOOGLE_CALENDAR_API_KEY missing - reconnect Google Calendar");
  return {
    Authorization: `Bearer ${lk}`,
    "X-Connection-Api-Key": gk,
    "Content-Type": "application/json",
  };
}

// Convert "2:30 PM" → "14:30"
function to24h(label: string | null | undefined): string | null {
  if (!label) return null;
  const m = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  const ap = m[3].toUpperCase();
  if (ap === "AM" && h === 12) h = 0;
  if (ap === "PM" && h !== 12) h += 12;
  return `${h.toString().padStart(2, "0")}:${m[2]}`;
}

async function getCalendarConfig() {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("calendar_sync_enabled, google_calendar_id")
    .eq("id", 1)
    .maybeSingle();
  return {
    enabled: data?.calendar_sync_enabled ?? true,
    calendarId: data?.google_calendar_id || "primary",
  };
}

export const syncAppointmentToCalendar = createServerFn({ method: "POST" })
  .inputValidator((d: { appointmentId: string }) => z.object({ appointmentId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const cfg = await getCalendarConfig();
    if (!cfg.enabled) return { skipped: true, reason: "Calendar sync is disabled" };

    const { data: appt, error: fetchErr } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("id", data.appointmentId)
      .single();
    if (fetchErr || !appt) throw new Error("Appointment not found");
    if (!appt.preferred_date) throw new Error("Appointment has no date");

    const time24 = to24h(appt.preferred_time) || "10:00";
    const startISO = `${appt.preferred_date}T${time24}:00`;
    const start = new Date(startISO + "-05:00"); // ET fallback; calendar uses timeZone field
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const eventBody = {
      summary: `${appt.service || appt.service_category || "Appointment"} — ${appt.full_name}`,
      description: [
        `Customer: ${appt.full_name}`,
        `Phone: ${appt.phone}`,
        appt.email ? `Email: ${appt.email}` : null,
        appt.service_category ? `Category: ${appt.service_category}` : null,
        appt.notes ? `\nCustomer notes:\n${appt.notes}` : null,
        appt.internal_notes ? `\nInternal notes:\n${appt.internal_notes}` : null,
      ].filter(Boolean).join("\n"),
      start: { dateTime: start.toISOString(), timeZone: "America/New_York" },
      end: { dateTime: end.toISOString(), timeZone: "America/New_York" },
    };

    const calId = encodeURIComponent(cfg.calendarId);
    let resp: Response;
    if (appt.google_event_id) {
      resp = await fetch(`${GATEWAY}/calendars/${calId}/events/${appt.google_event_id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(eventBody),
      });
    } else {
      resp = await fetch(`${GATEWAY}/calendars/${calId}/events`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(eventBody),
      });
    }
    const json = await resp.json();
    if (!resp.ok) throw new Error(`Calendar API ${resp.status}: ${JSON.stringify(json)}`);

    await supabaseAdmin
      .from("appointments")
      .update({ google_event_id: json.id, calendar_synced_at: new Date().toISOString() })
      .eq("id", appt.id);

    return { success: true, eventId: json.id, htmlLink: json.htmlLink };
  });

export const deleteCalendarEvent = createServerFn({ method: "POST" })
  .inputValidator((d: { appointmentId: string }) => z.object({ appointmentId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const cfg = await getCalendarConfig();
    const { data: appt } = await supabaseAdmin
      .from("appointments")
      .select("google_event_id")
      .eq("id", data.appointmentId)
      .single();
    if (!appt?.google_event_id) return { skipped: true };

    const calId = encodeURIComponent(cfg.calendarId);
    const resp = await fetch(`${GATEWAY}/calendars/${calId}/events/${appt.google_event_id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!resp.ok && resp.status !== 410 && resp.status !== 404) {
      const txt = await resp.text();
      throw new Error(`Calendar delete ${resp.status}: ${txt}`);
    }
    await supabaseAdmin
      .from("appointments")
      .update({ google_event_id: null, calendar_synced_at: null })
      .eq("id", data.appointmentId);
    return { success: true };
  });

export const listCalendars = createServerFn({ method: "GET" }).handler(async () => {
  const resp = await fetch(`${GATEWAY}/users/me/calendarList`, { headers: authHeaders() });
  const json = await resp.json();
  if (!resp.ok) throw new Error(`Calendar list ${resp.status}: ${JSON.stringify(json)}`);
  return (json.items || []).map((c: { id: string; summary: string; primary?: boolean }) => ({
    id: c.id, summary: c.summary, primary: !!c.primary,
  }));
});