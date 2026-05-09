import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const path = typeof body.path === "string" ? body.path.slice(0, 500) : null;
          if (!path) return new Response("ok");
          const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;
          const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 100) : null;
          const ua = (request.headers.get("user-agent") || "").slice(0, 500);
          await supabaseAdmin.from("page_views").insert({
            path, referrer, session_id: sessionId, user_agent: ua,
          });
          return new Response("ok");
        } catch {
          return new Response("ok");
        }
      },
    },
  },
});