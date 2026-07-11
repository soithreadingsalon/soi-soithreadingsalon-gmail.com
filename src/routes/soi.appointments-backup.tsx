import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { AdminPage } from "@/components/AdminPage";
import { listDeletedAppointments, restoreAppointment } from "@/lib/appointments.functions";

export const Route = createFileRoute("/soi/appointments-backup")({ component: AppointmentsBackup });

type BackupRow = {
  backup_id: string;
  original_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  service_category: string | null;
  service: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string | null;
  deleted_at: string;
};

function AppointmentsBackup() {
  const [rows, setRows] = useState<BackupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const listFn = useServerFn(listDeletedAppointments);
  const restoreFn = useServerFn(restoreAppointment);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listFn({});
      setRows((res.rows as BackupRow[]) ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load backup");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  async function restore(backup_id: string) {
    if (!confirm("Restore this appointment back into the live list?")) return;
    try {
      await restoreFn({ data: { backup_id } });
      toast.success("Restored");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Restore failed");
    }
  }

  return (
    <AdminPage title="Deleted Appointments (Backup)" subtitle="Soft-deleted records — restore at any time">
      {loading ? (
        <p className="text-center text-muted-foreground py-12">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No deleted appointments.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.backup_id} className="glass-panel rounded-2xl p-4 md:p-5 gold-border">
              <div className="grid md:grid-cols-[1fr_auto] gap-4">
                <div>
                  <h3 className="font-serif text-lg">{r.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{r.phone}{r.email ? ` · ${r.email}` : ""}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {[r.service_category, r.service].filter(Boolean).join(" · ") || "-"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {r.preferred_date && new Date(r.preferred_date + "T12:00:00").toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })} {r.preferred_time && `· ${r.preferred_time}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Deleted {new Date(r.deleted_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-start justify-end">
                  <button
                    onClick={() => restore(r.backup_id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold hover:bg-[var(--gold)]/10"
                  >
                    <RotateCcw className="h-4 w-4" /> Restore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPage>
  );
}