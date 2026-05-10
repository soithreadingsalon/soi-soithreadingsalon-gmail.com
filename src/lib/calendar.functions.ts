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

// Format minute-of-day -> "10:30 AM"
function fmtSlot(min: number) {
  const h24 = Math.floor(min / 60);
  const mm = min % 60;
  const ap = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm.toString().padStart(2, "0")} ${ap}`;
}

// Returns busy 30-min slot labels for a given local date (America/New_York).
export const getCalendarBusySlots = createServerFn({ method: "POST" })
  .inputValidator((d: { date: string }) =>
    z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(d)
  )
  .handler(async ({ data }) => {
    const cfg = await getCalendarConfig();
    if (!cfg.enabled) return { busy: [] as string[] };

    // Salon timezone: America/New_York. Build day window in ET.
    // We pass the offset; DST nuances are acceptable for slot blocking.
    const timeMin = new Date(`${data.date}T00:00:00-05:00`).toISOString();
    const timeMax = new Date(`${data.date}T23:59:59-05:00`).toISOString();

    const resp = await fetch(`${GATEWAY}/freeBusy`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        timeMin,
        timeMax,
        timeZone: "America/New_York",
        items: [{ id: cfg.calendarId }],
      }),
    });
    const json = await resp.json();
    if (!resp.ok) {
      console.error("freeBusy error", resp.status, json);
      return { busy: [] as string[] };
    }
    const calendars = json.calendars || {};
    const cal = calendars[cfg.calendarId] || Object.values(calendars)[0] as { busy?: { start: string; end: string }[] } | undefined;
    const intervals: { start: string; end: string }[] = (cal as { busy?: { start: string; end: string }[] } | undefined)?.busy || [];

    // Convert each interval to ET minute-of-day range and mark every overlapping 30-min slot.
    const busySet = new Set<string>();
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const toMin = (iso: string) => {
      const parts = fmt.formatToParts(new Date(iso));
      const get = (t: string) => parts.find((p) => p.type === t)?.value || "0";
      const dateKey = `${get("year")}-${get("month")}-${get("day")}`;
      const m = parseInt(get("hour")) * 60 + parseInt(get("minute"));
      return { dateKey, m };
    };
    for (const iv of intervals) {
      const s = toMin(iv.start);
      const e = toMin(iv.end);
      // Only mark slots on the requested local date.
      const startMin = s.dateKey === data.date ? s.m : 0;
      const endMin = e.dateKey === data.date ? e.m : 24 * 60;
      // Snap start down to nearest 30-min, walk while < endMin.
      let t = Math.floor(startMin / 30) * 30;
      while (t < endMin) {
        busySet.add(fmtSlot(t));
        t += 30;
      }
    }
    return { busy: Array.from(busySet) };
  });