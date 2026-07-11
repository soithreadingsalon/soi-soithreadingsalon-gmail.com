import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_inquiries",
  title: "List inquiries",
  description: "List contact-form inquiries for the signed-in admin. Newest first, up to 100 rows.",
  inputSchema: {
    unread_only: z.boolean().optional().describe("Only return unread inquiries."),
    limit: z.number().int().min(1).max(100).optional().describe("Row limit. Defaults to 25."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ unread_only, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = supabaseForUser(ctx);
    const { data: isAdmin, error: roleErr } = await sb.rpc("has_role", {
      _user_id: ctx.getUserId(),
      _role: "admin",
    });
    if (roleErr || !isAdmin) {
      return { content: [{ type: "text", text: "Forbidden: admin role required" }], isError: true };
    }
    let q = sb.from("inquiries").select("*").order("created_at", { ascending: false }).limit(limit ?? 25);
    if (unread_only) q = q.eq("read", false);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { inquiries: data ?? [] },
    };
  },
});