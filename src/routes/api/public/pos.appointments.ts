import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { timingSafeEqual } from "crypto";

const QuerySchema = z.object({
  since: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
  status: z.string().min(1).max(40).optional(),
});

function checkAuth(request: Request): boolean {
  const secret = process.env.BOOKING_INTEGRATION_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/pos/appointments")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!checkAuth(request)) {
          return new Response("Unauthorized", { status: 401 });
        }
        const url = new URL(request.url);
        const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
        if (!parsed.success) {
          return Response.json({ error: parsed.error.issues }, { status: 400 });
        }
        const { since, limit, status } = parsed.data;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        let q = supabaseAdmin
          .from("appointments")
          .select("id, full_name, phone, email, service_category, service, preferred_date, preferred_time, notes, status, created_at")
          .order("created_at", { ascending: false })
          .limit(limit);
        if (since) q = q.gte("created_at", since);
        if (status) q = q.eq("status", status);
        const { data, error } = await q;
        if (error) {
          console.error("[pos.appointments] db error", error);
          return new Response("Internal error", { status: 500 });
        }
        return Response.json({ appointments: data ?? [] });
      },
    },
  },
});