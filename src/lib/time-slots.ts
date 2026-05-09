// Time-slot generation. 30-minute slots based on weekday hours.
// Output: ["10:00 AM","10:30 AM",...,"6:30 PM"]

function parseHourRange(text: string): { startMin: number; endMin: number } | null {
  // accepts "10:00 AM – 7:00 PM" or "10:00 AM - 7:00 PM"
  const m = text.replace(/–/g, "-").match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!m) return null;
  const to24 = (h: number, ap: string) => {
    const u = ap.toUpperCase();
    if (u === "AM") return h === 12 ? 0 : h;
    return h === 12 ? 12 : h + 12;
  };
  const sh = to24(parseInt(m[1]), m[3]);
  const sm = m[2] ? parseInt(m[2]) : 0;
  const eh = to24(parseInt(m[4]), m[6]);
  const em = m[5] ? parseInt(m[5]) : 0;
  return { startMin: sh * 60 + sm, endMin: eh * 60 + em };
}

function format(min: number) {
  const h24 = Math.floor(min / 60);
  const mm = min % 60;
  const ap = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm.toString().padStart(2, "0")} ${ap}`;
}

export function generateSlots(hoursText: string, stepMinutes = 30): string[] {
  const r = parseHourRange(hoursText);
  if (!r) return [];
  const out: string[] = [];
  for (let t = r.startMin; t + stepMinutes <= r.endMin; t += stepMinutes) {
    out.push(format(t));
  }
  return out;
}

export function pickHoursForDate(
  isoDate: string,
  weekday: string,
  saturday: string,
  sunday: string,
): string {
  if (!isoDate) return weekday;
  const d = new Date(isoDate + "T12:00:00");
  const day = d.getDay();
  if (day === 0) return sunday;
  if (day === 6) return saturday;
  return weekday;
}

// Convert "2:30 PM" -> "14:30"
export function to24h(label: string): string | null {
  const m = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  const min = m[2];
  const ap = m[3].toUpperCase();
  if (ap === "AM" && h === 12) h = 0;
  if (ap === "PM" && h !== 12) h += 12;
  return `${h.toString().padStart(2, "0")}:${min}`;
}