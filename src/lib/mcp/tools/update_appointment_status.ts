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
  name: "update_appointment_status",
  title: "Update appointment status",
  description:
    "Update an existing appointment's status (new, confirmed, in_progress, completed, cancelled, no_show). Admin only.",
  inputSchema: {
    id: z.string().uuid().describe("Appointment id."),
    status: z
      .enum(["new", "confirmed", "in_progress", "completed", "cancelled", "no_show"])
      .describe("New status."),
    internal_notes: z.string().max(1000).optional().describe("Optional internal notes to attach."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, status, internal_notes }, ctx) => {
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
    const patch: Record<string, unknown> = { status };
    if (typeof internal_notes === "string") patch.internal_notes = internal_notes;
    const { data, error } = await sb.from("appointments").update(patch).eq("id", id).select().maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: `Appointment ${id} not found` }], isError: true };
    return {
      content: [{ type: "text", text: `Updated ${id} → ${status}` }],
      structuredContent: { appointment: data },
    };
  },
});