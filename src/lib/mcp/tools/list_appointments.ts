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
  name: "list_appointments",
  title: "List appointments",
  description:
    "List salon appointments for the signed-in admin. Optionally filter by status or by a preferred_date range (YYYY-MM-DD). Newest first, up to 100 rows.",
  inputSchema: {
    status: z
      .enum(["new", "confirmed", "in_progress", "completed", "cancelled", "no_show"])
      .optional()
      .describe("Filter by appointment status."),
    from_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("Include appointments with preferred_date on or after this date (YYYY-MM-DD)."),
    to_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("Include appointments with preferred_date on or before this date (YYYY-MM-DD)."),
    limit: z.number().int().min(1).max(100).optional().describe("Row limit. Defaults to 25."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
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
    let q = sb
      .from("appointments")
      .select(
        "id, full_name, phone, email, service_category, service, preferred_date, preferred_time, notes, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(input.limit ?? 25);
    if (input.status) q = q.eq("status", input.status);
    if (input.from_date) q = q.gte("preferred_date", input.from_date);
    if (input.to_date) q = q.lte("preferred_date", input.to_date);
    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { appointments: data ?? [] },
    };
  },
});