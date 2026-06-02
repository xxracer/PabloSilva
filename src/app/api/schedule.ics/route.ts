/**
 * ICS calendar feed for the weekly class schedule.
 *   GET /api/schedule.ics  -> text/calendar
 *
 * The file uses RRULE=FREQ=WEEKLY;BYDAY=… for each recurring class so it
 * shows up correctly in iOS Calendar, Google Calendar, and Outlook.
 */
import { NextResponse } from "next/server";

const DAYS: Array<{ abbr: string; byday: string; idx: number }> = [
  { abbr: "Mon", byday: "MO", idx: 0 },
  { abbr: "Tue", byday: "TU", idx: 1 },
  { abbr: "Wed", byday: "WE", idx: 2 },
  { abbr: "Thu", byday: "TH", idx: 3 },
  { abbr: "Fri", byday: "FR", idx: 4 },
  { abbr: "Sat", byday: "SA", idx: 5 },
  { abbr: "Sun", byday: "SU", idx: 6 },
];

type Slot = { time: string; program: string; ages: string };
type Schedule = Record<string, Slot[]>;

const SCHEDULE: Schedule = {
  Mon: [
    { time: "6:00 – 7:15 AM", program: "Adults Fundamentals (Gi)", ages: "Adults" },
    { time: "4:00 – 4:45 PM", program: "Little Champions", ages: "Ages 3–6" },
    { time: "5:00 – 6:00 PM", program: "Champions", ages: "Ages 7–10" },
    { time: "6:00 – 7:00 PM", program: "Teens", ages: "Ages 11–16" },
    { time: "6:30 – 7:30 PM", program: "Adults Fundamentals (Gi)", ages: "Adults" },
  ],
  Tue: [
    { time: "4:00 – 4:45 PM", program: "Little Champions", ages: "Ages 3–6" },
    { time: "5:00 – 6:00 PM", program: "Champions Competition", ages: "Ages 7–10" },
    { time: "6:00 – 7:00 PM", program: "Teens Competition", ages: "Ages 11–16" },
    { time: "6:30 – 7:30 PM", program: "Adults Advanced (Gi)", ages: "Adults" },
  ],
  Wed: [
    { time: "6:00 – 7:15 AM", program: "Adults Fundamentals (Gi)", ages: "Adults" },
    { time: "4:00 – 4:45 PM", program: "Little Champions", ages: "Ages 3–6" },
    { time: "5:00 – 6:00 PM", program: "Champions", ages: "Ages 7–10" },
    { time: "6:00 – 7:00 PM", program: "Teens", ages: "Ages 11–16" },
    { time: "6:30 – 7:30 PM", program: "Adults Fundamentals (Gi)", ages: "Adults" },
  ],
  Thu: [
    { time: "4:00 – 4:45 PM", program: "Little Champions", ages: "Ages 3–6" },
    { time: "5:00 – 6:00 PM", program: "Champions Competition", ages: "Ages 7–10" },
    { time: "6:00 – 7:00 PM", program: "Teens Competition", ages: "Ages 11–16" },
    { time: "6:30 – 7:30 PM", program: "Adults Advanced (Gi)", ages: "Adults" },
  ],
  Fri: [
    { time: "6:00 – 7:15 AM", program: "Adults Fundamentals (Gi)", ages: "Adults" },
    { time: "4:00 – 4:45 PM", program: "Little Champions", ages: "Ages 3–6" },
    { time: "5:00 – 6:00 PM", program: "Champions", ages: "Ages 7–10" },
    { time: "6:00 – 7:00 PM", program: "Teens", ages: "Ages 11–16" },
    { time: "6:30 – 7:30 PM", program: "Adults Open Mat", ages: "Adults" },
  ],
  Sat: [
    { time: "8:00 – 9:00 AM", program: "Champions Competition", ages: "Ages 7–10" },
    { time: "9:00 – 10:00 AM", program: "Adults Open Mat", ages: "Adults" },
  ],
  Sun: [],
};

// Anchor for the recurrence: pick the next Monday from a stable date so the
// RRULE produces predictable instances across years.
const ANCHOR_MONDAY = new Date("2025-01-06T00:00:00Z");

function parseRange(range: string, refDate: Date): { start: Date; end: Date } {
  // "6:00 – 7:15 AM" or "9:00 – 10:00 AM"
  const m = range.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?\s*[–\-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return { start: refDate, end: refDate };
  let sH = +m[1], sM = +m[2];
  const sAP = (m[3] ?? "").toUpperCase();
  let eH = +m[4], eM = +m[5];
  const eAP = (m[6] ?? sAP).toUpperCase();
  if (sAP === "PM" && sH !== 12) sH += 12;
  if (sAP === "AM" && sH === 12) sH = 0;
  if (eAP === "PM" && eH !== 12) eH += 12;
  if (eAP === "AM" && eH === 12) eH = 0;
  // Use a real local-time UTC date. ICS stores floating local time with TZID.
  const start = new Date(refDate);
  start.setUTCHours(sH, sM, 0, 0);
  const end = new Date(refDate);
  end.setUTCHours(eH, eM, 0, 0);
  return { start, end };
}

function fmt(date: Date): string {
  // YYYYMMDDTHHmmssZ
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

function escapeICS(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function GET() {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pablo Silva BJJ//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Pablo Silva BJJ — Weekly Classes",
    "X-WR-TIMEZONE:America/Chicago",
  ];

  for (const d of DAYS) {
    const slots = SCHEDULE[d.abbr] ?? [];
    for (const s of slots) {
      const refDate = new Date(ANCHOR_MONDAY);
      refDate.setUTCDate(refDate.getUTCDate() + d.idx);
      const { start, end } = parseRange(s.time, refDate);
      const uid = `${d.abbr}-${s.time}-${s.program}@pablosilvabjj.com`
        .replace(/[^a-z0-9@.\-]/gi, "");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${fmt(new Date())}`,
        `DTSTART;TZID=America/Chicago:${fmt(start).replace("Z", "")}`,
        `DTEND;TZID=America/Chicago:${fmt(end).replace("Z", "")}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${d.byday}`,
        `SUMMARY:${escapeICS(s.program)}`,
        `DESCRIPTION:${escapeICS(`${s.program} — ${s.ages}`)}`,
        `LOCATION:${escapeICS("Pablo Silva BJJ · 5233 Bellaire Blvd, Bellaire, TX 77401")}`,
        "END:VEVENT",
      );
    }
  }

  lines.push("END:VCALENDAR");
  const body = lines.join("\r\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="pablo-silva-bjj-schedule.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
