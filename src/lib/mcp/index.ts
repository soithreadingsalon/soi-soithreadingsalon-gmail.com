import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listAppointmentsTool from "./tools/list_appointments";
import updateAppointmentStatusTool from "./tools/update_appointment_status";
import listInquiriesTool from "./tools/list_inquiries";

// Direct Supabase issuer — required by mcp-js OAuth verification (RFC 8414).
// Read the project ref through Vite's env inlining; process.env.VITE_* is
// undefined on the published Workers runtime, and SUPABASE_URL is the proxy
// form on publish.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "soi-threading-salon-mcp",
  title: "SOI Threading Salon",
  version: "0.1.0",
  instructions:
    "Admin tools for SOI Threading Salon. Use list_appointments to review bookings, update_appointment_status to advance a booking's status, and list_inquiries to review contact-form messages. All tools require admin role.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listAppointmentsTool, updateAppointmentStatusTool, listInquiriesTool],
});