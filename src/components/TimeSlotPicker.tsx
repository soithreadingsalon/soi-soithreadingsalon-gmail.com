import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { generateSlots, pickHoursForDate } from "@/lib/time-slots";
import { getCalendarBusySlots } from "@/lib/calendar.functions";

type Settings = {
  hours_weekday: string;
  hours_saturday: string;
  hours_sunday: string;
};

const DEFAULT_SETTINGS: Settings = {
  hours_weekday: "10:00 AM – 7:00 PM",
  hours_saturday: "10:00 AM – 6:00 PM",
  hours_sunday: "11:00 AM – 4:00 PM",
};

export function TimeSlotPicker({
  date,
  value,
  onChange,
  className,
}: {
  date: string; // YYYY-MM-DD
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  // Seed with defaults so the picker never gets stuck on "Loading…".
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [calendarBusy, setCalendarBusy] = useState<Set<string>>(new Set());
  const fetchBusy = useServerFn(getCalendarBusySlots);

  useEffect(() => {
    supabase
      .rpc("get_public_hours")
      .then(({ data, error }) => {
        if (error) {
          console.error("[TimeSlotPicker] site_settings load failed", error);
          return;
        }
        const row = Array.isArray(data) ? data[0] : data;
        if (row) {
          setSettings({
            hours_weekday: row.hours_weekday || DEFAULT_SETTINGS.hours_weekday,
            hours_saturday: row.hours_saturday || DEFAULT_SETTINGS.hours_saturday,
            hours_sunday: row.hours_sunday || DEFAULT_SETTINGS.hours_sunday,
          });
        }
      });
  }, []);

  useEffect(() => {
    if (!date) { setTaken(new Set()); return; }
    supabase
      .from("appointments")
      .select("preferred_time,status")
      .eq("preferred_date", date)
      .then(({ data }) => {
        const s = new Set<string>();
        (data || []).forEach((r: { preferred_time: string | null; status: string }) => {
          if (r.preferred_time && r.status !== "cancelled" && r.status !== "no_show") s.add(r.preferred_time);
        });
        setTaken(s);
      });
  }, [date]);

  useEffect(() => {
    if (!date) { setCalendarBusy(new Set()); return; }
    let cancelled = false;
    fetchBusy({ data: { date } })
      .then((res) => { if (!cancelled) setCalendarBusy(new Set(res.busy || [])); })
      .catch((e) => {
        console.error("[TimeSlotPicker] calendar busy load failed", e);
        if (!cancelled) setCalendarBusy(new Set());
      });
    return () => { cancelled = true; };
  }, [date, fetchBusy]);

  const slots = useMemo(() => {
    if (!date) return [];
    const hrs = pickHoursForDate(date, settings.hours_weekday, settings.hours_saturday, settings.hours_sunday);
    return generateSlots(hrs, 30);
  }, [settings, date]);

  if (!date) {
    return (
      <div className={`text-xs text-muted-foreground italic px-3 py-2.5 rounded-xl bg-muted/30 ${className || ""}`}>
        Select a date first to see available times
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className={`text-xs text-muted-foreground italic px-3 py-2.5 rounded-xl bg-muted/30 ${className || ""}`}>
        Closed on this day — please pick another date
      </div>
    );
  }

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={className}>
      <option value="">Select a time…</option>
      {slots.map((s) => {
        const isTaken = taken.has(s) || calendarBusy.has(s);
        return (
          <option key={s} value={s} disabled={isTaken}>
            {s}{isTaken ? " — booked" : ""}
          </option>
        );
      })}
    </select>
  );
}