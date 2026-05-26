import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GMAIL_GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function gmailHeaders() {
  const lk = process.env.LOVABLE_API_KEY;
  const gk = process.env.GOOGLE_MAIL_API_KEY;
  if (!lk) throw new Error("LOVABLE_API_KEY missing");
  if (!gk) throw new Error("GOOGLE_MAIL_API_KEY missing - reconnect Gmail");
  return {
    Authorization: `Bearer ${lk}`,
    "X-Connection-Api-Key": gk,
    "Content-Type": "application/json",
  };
}

function b64url(s: string) {
  return Buffer.from(s, "utf8").toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const notifyInquiryByEmail = createServerFn({ method: "POST" })
  .inputValidator((d: { inquiryId: string }) =>
    z.object({ inquiryId: z.string().uuid() }).parse(d)
  )
  .handler(async ({ data }) => {
    // Idempotency: atomically claim the notification so repeated calls cannot
    // spam the salon inbox. Only the first caller for a given inquiry sends.
    const { data: claimed, error: claimErr } = await supabaseAdmin
      .from("inquiries")
      .update({ notified_at: new Date().toISOString() })
      .eq("id", data.inquiryId)
      .is("notified_at", null)
      .select("id")
      .maybeSingle();
    if (claimErr) throw new Error(claimErr.message);
    if (!claimed) return { success: true, skipped: true };

    const [{ data: inq, error }, { data: settings }] = await Promise.all([
      supabaseAdmin.from("inquiries").select("*").eq("id", data.inquiryId).single(),
      supabaseAdmin.from("site_settings").select("email,salon_name").eq("id", 1).maybeSingle(),
    ]);
    if (error || !inq) throw new Error("Inquiry not found");

    const to = settings?.email || "soithreadingsalon@gmail.com";
    const salon = settings?.salon_name || "SOI Threading Salon";
    // Sanitize any field used in RFC 2822 headers to prevent header injection
    // (e.g. names containing \r or \n could inject Bcc/Cc headers).
    const stripCRLF = (s: string | null | undefined, max = 200) =>
      (s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
    const safeName = stripCRLF(inq.name) || "Website visitor";
    const safeEmail = stripCRLF(inq.email);
    // Basic email shape check before using in Reply-To header
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail);
    const subject = `New inquiry from ${safeName}`;

    const lines = [
      `New inquiry submitted on the ${salon} website`,
      ``,
      `Name: ${inq.name}`,
      inq.phone ? `Phone: ${inq.phone}` : null,
      inq.email ? `Email: ${inq.email}` : null,
      inq.service_interest ? `Service Interested In: ${inq.service_interest}` : null,
      inq.preferred_date ? `Preferred Date: ${inq.preferred_date}` : null,
      inq.preferred_time ? `Preferred Time: ${inq.preferred_time}` : null,
      ``,
      `Message:`,
      inq.message || "(no message)",
      ``,
      `— Sent automatically from your website contact form`,
    ].filter(Boolean).join("\r\n");

    const replyTo = isEmail ? `\r\nReply-To: ${safeEmail}` : "";
    const rfc2822 = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset="UTF-8"${replyTo}`,
      ``,
      lines,
    ].join("\r\n");

    const resp = await fetch(`${GMAIL_GATEWAY}/users/me/messages/send`, {
      method: "POST",
      headers: gmailHeaders(),
      body: JSON.stringify({ raw: b64url(rfc2822) }),
    });
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("Gmail send failed", resp.status, json);
      throw new Error(`Gmail send ${resp.status}`);
    }
    return { success: true, id: json.id };
  });