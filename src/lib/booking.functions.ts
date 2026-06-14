import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHmac } from "crypto";

const BookingInput = z.object({
  full_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255).nullable().optional(),
  service_category: z.string().max(50).nullable().optional(),
  service: z.string().max(100).nullable().optional(),
  preferred_date: z.string().max(20).nullable().optional(),
  preferred_time: z.string().max(40).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export type BookingInput = z.infer<typeof BookingInput>;

function to24h(t: string | null | undefined): string | null {
  if (!t) return null;
  const s = t.trim();
  // Already HH:MM or HH:MM:SS (24h)
  const m24 = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (m24 && !/[ap]m/i.test(s)) {
    const h = String(parseInt(m24[1], 10)).padStart(2, "0");
    return `${h}:${m24[2]}:${m24[3] ?? "00"}`;
  }
  // 12h like "10:00 AM", "10AM", "2:30 pm"
  const m12 = s.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap])m$/i);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const min = m12[2] ?? "00";
    const isPm = m12[3].toLowerCase() === "p";
    if (h === 12) h = isPm ? 12 : 0;
    else if (isPm) h += 12;
    return `${String(h).padStart(2, "0")}:${min}:00`;
  }
  return null;
}

type InsertedAppt = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  service_category: string | null;
  service: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
};

async function pushToPos(appt: InsertedAppt) {
  const configuredSecret = process.env.BOOKING_INTEGRATION_SECRET;
  const target = process.env.POS_WEBHOOK_URL;
  const secret = configuredSecret?.trim();
  if (!secret || !target) return;

  const apptTime = to24h(appt.preferred_time);
  if (!appt.preferred_date || !apptTime) {
    console.warn("[submitBooking] skipping POS push — missing date/time", {
      date: appt.preferred_date,
      time: appt.preferred_time,
    });
    return;
  }

  const payload = {
    customer_name: appt.full_name,
    customer_phone: appt.phone,
    customer_email: appt.email,
    service_name: appt.service || appt.service_category || "Appointment",
    appointment_date: appt.preferred_date,
    appointment_time: apptTime,
    notes: appt.notes,
    external_booking_id: appt.id,
    external_source: "website",
  };

  try {
    const body = JSON.stringify(payload);
    const signature = createHmac("sha256", secret).update(body).digest("hex");
    const secretFingerprint = createHmac("sha256", "soi-booking-debug").update(secret).digest("hex").slice(0, 12);
    const bodyFingerprint = createHmac("sha256", "soi-booking-body").update(body).digest("hex").slice(0, 12);
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    console.log("[submitBooking] POS push prepared", {
      targetHost: new URL(target).host,
      external_booking_id: appt.id,
      secretFingerprint,
      bodyFingerprint,
    });
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-soi-signature": signature,
        Authorization: `Bearer ${secret}`,
      },
      body,
      signal: controller.signal,
    });
    clearTimeout(t);
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      console.error("[submitBooking] POS responded", res.status, text);
    } else {
      console.log("[submitBooking] POS accepted", res.status, text);
    }
  } catch (err) {
    console.error("[submitBooking] POS push failed", err);
  }
}

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((data: BookingInput) => BookingInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      full_name: data.full_name,
      phone: data.phone,
      email: data.email || null,
      service_category: data.service_category || null,
      service: data.service || null,
      preferred_date: data.preferred_date || null,
      preferred_time: data.preferred_time || null,
      notes: data.notes || null,
    };
    const { data: inserted, error } = await supabaseAdmin
      .from("appointments")
      .insert(payload)
      .select("id, full_name, phone, email, service_category, service, preferred_date, preferred_time, notes, status, created_at")
      .single();
    if (error || !inserted) {
      console.error("[submitBooking] insert failed", error);
      throw new Error("Could not save appointment");
    }
    await pushToPos(inserted);
    return { id: inserted.id };
  });