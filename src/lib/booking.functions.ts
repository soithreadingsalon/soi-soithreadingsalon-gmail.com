import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHmac } from "crypto";

const GMAIL_GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function b64url(s: string) {
  return Buffer.from(s, "utf8").toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function stripCRLF(s: string | null | undefined, max = 200) {
  return (s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateHuman(iso: string | null | undefined) {
  if (!iso) return "To be confirmed";
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function buildConfirmationEmail(opts: {
  salonName: string;
  name: string;
  service: string;
  category: string;
  dateHuman: string;
  time: string;
  notes: string;
  salonPhone: string;
  whatsappPhone: string;
  salonEmail: string;
  salonAddress: string;
  siteUrl: string;
}) {
  const {
    salonName, name, service, category, dateHuman, time,
    notes, salonPhone, whatsappPhone, salonEmail, salonAddress, siteUrl,
  } = opts;
  const waDigits = whatsappPhone.replace(/[^\d]/g, "");
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ece4d1;color:#8a7f6a;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:38%;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ece4d1;color:#3a342e;font-size:15px;">${escapeHtml(value)}</td>
    </tr>`;
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Appointment Request Received</title></head>
<body style="margin:0;padding:0;background:#fdfbf5;font-family:Georgia,'Times New Roman',serif;color:#3a342e;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdfbf5;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #c9a961;border-radius:20px;overflow:hidden;">
        <tr><td style="padding:36px 40px 24px;text-align:center;border-bottom:1px solid #ece4d1;background:#faf5e8;">
          <div style="font-family:Georgia,serif;font-size:28px;letter-spacing:2px;color:#b08d2f;font-weight:normal;">${escapeHtml(salonName)}</div>
          <div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#8a7f6a;margin-top:6px;">Wayne, New Jersey</div>
        </td></tr>
        <tr><td style="padding:32px 40px 8px;">
          <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:24px;color:#3a342e;font-weight:normal;">Thank you, ${escapeHtml(name)}.</h1>
          <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#5a5348;">
            We've received your appointment request and this is confirmation of your appointment. We look forward to seeing you at the store. Here are the details you shared:
          </p>
        </td></tr>
        <tr><td style="padding:0 40px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;">
            ${row("Service", service || category)}
            ${row("Category", category)}
            ${row("Date", dateHuman)}
            ${row("Time", time || "To be confirmed")}
            ${notes ? row("Notes", notes) : ""}
          </table>
        </td></tr>
        <tr><td style="padding:8px 40px 32px;">
          <div style="background:#faf5e8;border:1px solid #ece4d1;border-radius:14px;padding:20px;font-family:Arial,sans-serif;">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b08d2f;margin-bottom:10px;">Need to change something?</div>
            <div style="font-size:14px;line-height:1.7;color:#5a5348;">
              Call <a href="tel:${escapeHtml(salonPhone.replace(/[^\d+]/g,''))}" style="color:#b08d2f;text-decoration:none;">${escapeHtml(salonPhone)}</a><br/>
              WhatsApp <a href="https://wa.me/1${escapeHtml(waDigits)}" style="color:#b08d2f;text-decoration:none;">${escapeHtml(whatsappPhone)}</a><br/>
              Email <a href="mailto:${escapeHtml(salonEmail)}" style="color:#b08d2f;text-decoration:none;">${escapeHtml(salonEmail)}</a><br/>
              Visit <a href="${escapeHtml(siteUrl)}" style="color:#b08d2f;text-decoration:none;">${escapeHtml(siteUrl.replace(/^https?:\/\//,''))}</a>
            </div>
          </div>
        </td></tr>
        <tr><td style="padding:20px 40px 32px;text-align:center;border-top:1px solid #ece4d1;background:#faf5e8;">
          <div style="font-family:Georgia,serif;font-size:14px;color:#b08d2f;letter-spacing:1px;">${escapeHtml(salonName)}</div>
          <div style="font-family:Arial,sans-serif;font-size:12px;color:#8a7f6a;margin-top:6px;">${escapeHtml(salonAddress)}</div>
          <div style="font-family:Arial,sans-serif;font-size:11px;color:#8a7f6a;margin-top:14px;line-height:1.6;">
            You're receiving this because you requested an appointment on our website.<br/>
            Appointments are confirmed based on staff availability and salon schedule.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

async function sendCustomerConfirmationEmail(appt: InsertedAppt) {
  const email = stripCRLF(appt.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  const lk = process.env.LOVABLE_API_KEY;
  const gk = process.env.GOOGLE_MAIL_API_KEY;
  if (!lk || !gk) {
    console.warn("[submitBooking] skipping customer email — Gmail connector not configured");
    return;
  }
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: settings } = await supabaseAdmin
      .from("site_settings")
      .select("salon_name,email,phone,address")
      .eq("id", 1)
      .maybeSingle();
    const salonName = settings?.salon_name || "SOI Threading Salon";
    const salonEmail = settings?.email || "soithreadingsalon@gmail.com";
    const salonPhone = "(973) 321-8374";
    const whatsappPhone = "(551) 301-3894";
    const salonAddress = settings?.address || "Wayne, NJ";
    const siteUrl = "https://soithreadingandsalon.com";

    const name = stripCRLF(appt.full_name) || "there";
    const html = buildConfirmationEmail({
      salonName,
      name,
      service: stripCRLF(appt.service, 100),
      category: stripCRLF(appt.service_category, 60),
      dateHuman: formatDateHuman(appt.preferred_date),
      time: stripCRLF(appt.preferred_time, 40),
      notes: stripCRLF(appt.notes, 500),
      salonPhone,
      whatsappPhone,
      salonEmail,
      salonAddress,
      siteUrl,
    });
    const subject = `Your appointment request at ${salonName}`;
    const boundary = `soi_${Date.now().toString(36)}`;
    const textFallback = [
      `Hi ${name},`,
      ``,
      `We've received your appointment request at ${salonName}.`,
      ``,
      `Service: ${appt.service || appt.service_category || "Appointment"}`,
      `Date: ${formatDateHuman(appt.preferred_date)}`,
      `Time: ${appt.preferred_time || "To be confirmed"}`,
      appt.notes ? `Notes: ${appt.notes}` : null,
      ``,
      `Questions? Call ${salonPhone} or WhatsApp ${whatsappPhone}.`,
      ``,
      `— ${salonName}`,
    ].filter(Boolean).join("\r\n");

    const rfc2822 = [
      `To: ${email}`,
      `From: ${salonName} <${salonEmail}>`,
      `Reply-To: ${salonEmail}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      textFallback,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      html,
      ``,
      `--${boundary}--`,
      ``,
    ].join("\r\n");

    const resp = await fetch(`${GMAIL_GATEWAY}/users/me/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lk}`,
        "X-Connection-Api-Key": gk,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: b64url(rfc2822) }),
    });
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      console.error("[submitBooking] customer email failed", resp.status, body);
    } else {
      console.log("[submitBooking] customer confirmation email sent", { to: email });
    }
  } catch (err) {
    console.error("[submitBooking] customer email error", err);
  }
}

const BookingInput = z.object({
  full_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255).nullable().optional().or(z.literal("")),
  service_category: z.string().trim().min(1).max(50),
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

async function pushToPos(appt: InsertedAppt, host: string) {
  const configuredSecret = process.env.BOOKING_INTEGRATION_SECRET;
  const prodTarget = process.env.POS_WEBHOOK_URL;
  const testTarget = process.env.POS_WEBHOOK_URL_TEST;
  const isProd = host.toLowerCase().includes("soithreadingandsalon.com");
  const target = isProd ? prodTarget : (testTarget || prodTarget);
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
      requestHost: host,
      env: isProd ? "production" : "test",
      external_booking_id: appt.id,
      secretFingerprint,
      bodyFingerprint,
    });
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-booking-secret": secret,
        "x-soi-signature": signature,
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
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    let host = "";
    try { host = getRequestHeader("host") || ""; } catch { host = ""; }
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
    await pushToPos(inserted, host);
    await sendCustomerConfirmationEmail(inserted);
    return { id: inserted.id };
  });