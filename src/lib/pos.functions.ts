import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHmac } from "crypto";

const Input = z.object({ appointmentId: z.string().uuid() });

export const notifyPosOfBooking = createServerFn({ method: "POST" })
  .inputValidator((data: { appointmentId: string }) => Input.parse(data))
  .handler(async ({ data }) => {
    const secret = process.env.BOOKING_INTEGRATION_SECRET;
    const target = process.env.POS_WEBHOOK_URL;
    if (!secret || !target) {
      console.warn("[notifyPosOfBooking] missing BOOKING_INTEGRATION_SECRET or POS_WEBHOOK_URL");
      return { ok: false, reason: "not_configured" };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: appt, error } = await supabaseAdmin
      .from("appointments")
      .select("id, full_name, phone, email, service_category, service, preferred_date, preferred_time, notes, status, created_at")
      .eq("id", data.appointmentId)
      .single();
    if (error || !appt) {
      console.error("[notifyPosOfBooking] fetch failed", error);
      return { ok: false, reason: "not_found" };
    }
    const body = JSON.stringify({ event: "appointment.created", appointment: appt });
    const signature = "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
    try {
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
        console.error("[notifyPosOfBooking] POS responded", res.status, await res.text().catch(() => ""));
        return { ok: false, reason: `pos_${res.status}` };
      }
      return { ok: true };
    } catch (err) {
      console.error("[notifyPosOfBooking] push failed", err);
      return { ok: false, reason: "network_error" };
    }
  });