import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const IdInput = z.object({ id: z.string().uuid() });

/**
 * Soft-delete an appointment: copy the row into `appointments_deleted`
 * (backup) and then remove it from `appointments`. The original record
 * can be recovered at any time from the backup table.
 */
export const softDeleteAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => IdInput.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: appt, error: readErr } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("id", data.id)
      .single();
    if (readErr || !appt) throw new Error("Appointment not found");

    const backupRow = {
      original_id: appt.id,
      full_name: appt.full_name,
      phone: appt.phone,
      email: appt.email,
      service_category: appt.service_category,
      service: appt.service,
      preferred_date: appt.preferred_date,
      preferred_time: appt.preferred_time,
      notes: appt.notes,
      status: appt.status,
      internal_notes: appt.internal_notes,
      google_event_id: appt.google_event_id,
      calendar_synced_at: appt.calendar_synced_at,
      original_created_at: appt.created_at,
      deleted_by: context.userId,
    };

    const { error: backupErr } = await supabaseAdmin
      .from("appointments_deleted")
      .insert(backupRow);
    if (backupErr) {
      console.error("[softDeleteAppointment] backup failed", backupErr);
      throw new Error("Could not back up record");
    }

    const { error: delErr } = await supabaseAdmin
      .from("appointments")
      .delete()
      .eq("id", data.id);
    if (delErr) {
      console.error("[softDeleteAppointment] delete failed", delErr);
      throw new Error("Could not delete appointment");
    }

    return { ok: true };
  });

export const listDeletedAppointments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("appointments_deleted")
      .select("*")
      .order("deleted_at", { ascending: false })
      .limit(500);
    if (error) throw new Error("Could not load backup");
    return { rows: data ?? [] };
  });

export const restoreAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { backup_id: string }) =>
    z.object({ backup_id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: bk, error: readErr } = await supabaseAdmin
      .from("appointments_deleted")
      .select("*")
      .eq("backup_id", data.backup_id)
      .single();
    if (readErr || !bk) throw new Error("Backup not found");

    const restored = {
      id: bk.original_id,
      full_name: bk.full_name,
      phone: bk.phone,
      email: bk.email,
      service_category: bk.service_category,
      service: bk.service,
      preferred_date: bk.preferred_date,
      preferred_time: bk.preferred_time,
      notes: bk.notes,
      status: bk.status ?? "new",
      internal_notes: bk.internal_notes,
      google_event_id: bk.google_event_id,
      calendar_synced_at: bk.calendar_synced_at,
    };

    const { error: insErr } = await supabaseAdmin
      .from("appointments")
      .upsert(restored, { onConflict: "id" });
    if (insErr) {
      console.error("[restoreAppointment] restore failed", insErr);
      throw new Error("Could not restore appointment");
    }

    await supabaseAdmin
      .from("appointments_deleted")
      .delete()
      .eq("backup_id", data.backup_id);

    return { ok: true, id: bk.original_id };
  });