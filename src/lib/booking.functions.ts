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

async function pushToPos(appt: Record<string, unknown>) {
  const secret = process.env.BOOKING_INTEGRATION_SECRET;
  const target = process.env.POS_WEBHOOK_URL;
  if (!secret || !target) return;
  try {
    const body = JSON.stringify({ event: "appointment.created", appointment: appt });
    const signature = "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
        "X-Signature": signature,
      },
      body,
      signal: controller.signal,
    });
    clearTimeout(t);
    if (!res.ok) {
      console.error("[submitBooking] POS responded", res.status, await res.text().catch(() => ""));
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