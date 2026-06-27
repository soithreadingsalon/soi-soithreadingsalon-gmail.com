import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { generateSlots, pickHoursForDate, to24h } from "@/lib/time-slots";
import { getCalendarBusySlots } from "@/lib/calendar.functions";

type Settings = {
  hours_weekday: string;
  hours_saturday: string;
  hours_sunday: string;
};

const DEFAULT_SETTINGS: Settings = {
  hours_weekday: "10:00 AM – 7:00 PM",
  hours_saturday: "10:00 AM – 6:00 PM",
  hours_sunday: "Closed",
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
    const all = generateSlots(hrs, 30);
    const todayISO = new Date().toISOString().slice(0, 10);
    if (date < todayISO) return [];
    if (date !== todayISO) return all;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return all.filter((label) => {
      const t = to24h(label);
      if (!t) return true;
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m > nowMin;
    });
  }, [settings, date]);

  if (!date) {
    return (
      <div className={`text-xs text-muted-foreground italic px-3 py-2.5 rounded-xl bg-muted/30 ${className || ""}`}>
        Select a date first to see available times
      </div>
    );
  }

  if (slots.length === 0) {
    const d = new Date(date + "T12:00:00");
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    const todayISO = new Date().toISOString().slice(0, 10);
    const isPast = date < todayISO;
    const isToday = date === todayISO;
    const hrs = pickHoursForDate(date, settings.hours_weekday, settings.hours_saturday, settings.hours_sunday);
    const closed = /closed/i.test(hrs);
    const msg = isPast
      ? "Please pick a future date."
      : closed
      ? `We're closed on ${dayName}s. Please pick another day.`
      : isToday
      ? "No more time slots available today. Please pick another date."
      : `No available times on this ${dayName}. Please pick another date.`;
    return (
      <div className={`text-xs text-muted-foreground italic px-3 py-2.5 rounded-xl bg-muted/30 ${className || ""}`}>
        {msg}
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
            {s}{isTaken ? ", booked" : ""}
          </option>
        );
      })}
    </select>
  );
}