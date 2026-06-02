/**
 * Printable schedule — desktop and mobile friendly.
 * Optimized for "Save as PDF" via the browser's print dialog (Cmd/Ctrl+P).
 */
import type { Metadata } from "next";
import { PrintButton } from "./print-button";
import { Visit } from "@/components/visit";

export const metadata: Metadata = {
  title: "Schedule (Printable) — Pablo Silva BJJ",
  description: "Print or save as PDF the weekly class schedule for Pablo Silva BJJ.",
  robots: { index: false, follow: false },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Slot = { time: string; program: string; ages: string };

const SCHEDULE: Record<(typeof DAYS)[number], Slot[]> = {
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

const HOURS = [
  { day: "Mon – Fri", hours: "7:00 AM – 7:30 PM" },
  { day: "Saturday", hours: "8:00 AM – 10:00 AM" },
  { day: "Sunday", hours: "Closed" },
];

export default function PrintSchedulePage() {
  return (
    <>
      <div className="print-toolbar">
        <a className="print-toolbar__back" href="/schedule">← Back to schedule</a>
        <PrintButton />
      </div>

      <article className="printable">
        <header className="printable__head">
          <div className="printable__brand">
            <span className="printable__mark">PS</span>
            <div>
              <h1>Pablo Silva BJJ</h1>
              <p>5233 Bellaire Blvd · Bellaire, TX 77401 · 346-303-9572</p>
            </div>
          </div>
          <h2 className="printable__title">Weekly class schedule</h2>
          <p className="printable__sub">All times Central. Book a free trial at pablosilvabjj.com/contact</p>
        </header>

        <table className="printable__grid">
          <thead>
            <tr>
              {DAYS.map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {DAYS.map((d) => (
                <td key={d} className="printable__cell">
                  {SCHEDULE[d].length === 0 ? (
                    <span className="printable__closed">Closed</span>
                  ) : (
                    <ul>
                      {SCHEDULE[d].map((s, i) => (
                        <li key={i}>
                          <span className="printable__time">{s.time}</span>
                          <span className="printable__program">{s.program}</span>
                          <span className="printable__ages">{s.ages}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <section className="printable__hours">
          <div>
            <h3>Academy hours</h3>
            <ul>
              {HOURS.map((h) => (
                <li key={h.day}><span>{h.day}</span><span>{h.hours}</span></li>
              ))}
            </ul>
          </div>
          <p className="printable__foot">
            Your first class is on us. Pablo Silva BJJ — 2010 IBJJF Black Belt
            World Champion.
          </p>
        </section>
      </article>

      <Visit />

      <style>{printableCss}</style>
    </>
  );
}

const printableCss = `
.print-toolbar {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
  padding: 14px clamp(1.25rem, 4vw, 3rem);
  background: #1a1714;
  color: #faf6ee;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.print-toolbar__back {
  font-size: 13px; color: #c4baa3; text-decoration: none;
  padding: 8px 0;
}
.print-toolbar__back:hover { color: #8a6a3d; }

.printable {
  max-width: 1100px;
  margin: clamp(2rem, 5vw, 4rem) auto;
  padding: 0 clamp(1.25rem, 4vw, 3rem);
  background: #faf6ee;
  color: #1a1714;
  border-radius: 18px;
  border: 1px solid rgba(26,23,20,0.10);
  overflow: hidden;
}
.printable__head {
  padding: 32px 32px 24px;
  border-bottom: 1px solid rgba(26,23,20,0.10);
}
.printable__brand {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 18px;
}
.printable__mark {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: #1a1714;
  color: #faf6ee;
  display: grid; place-items: center;
  font-family: var(--font-display);
  font-size: 14px; font-weight: 500;
  letter-spacing: 0.04em;
}
.printable__brand h1 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0;
}
.printable__brand p {
  margin: 2px 0 0;
  font-size: 12px; color: #6a6258;
  letter-spacing: 0.02em;
}
.printable__title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.4vw, 2.4rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  margin: 0;
}
.printable__sub {
  font-size: 13px; color: #6a6258;
  margin: 6px 0 0;
}

.printable__grid {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  table-layout: fixed;
}
.printable__grid thead th {
  text-align: left;
  font-family: var(--font-display);
  font-size: 0.95rem; font-weight: 500;
  color: #1a1714;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(26,23,20,0.10);
  background: #f4ede1;
  letter-spacing: -0.01em;
}
.printable__cell {
  vertical-align: top;
  padding: 16px;
  border-right: 1px solid rgba(26,23,20,0.08);
  border-bottom: 1px solid rgba(26,23,20,0.08);
  background: #faf6ee;
}
.printable__cell:last-child { border-right: 0; }
.printable__cell ul {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 12px;
}
.printable__cell li {
  display: flex; flex-direction: column; gap: 2px;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(26,23,20,0.10);
}
.printable__cell li:last-child { border-bottom: 0; padding-bottom: 0; }
.printable__time {
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.08em;
  color: #6f542f;
}
.printable__program {
  font-family: var(--font-display);
  font-size: 0.95rem; font-weight: 500;
  letter-spacing: -0.01em;
  color: #1a1714;
  line-height: 1.25;
}
.printable__ages {
  font-size: 10px; color: #6a6258;
  letter-spacing: 0.04em;
}
.printable__closed {
  font-style: italic;
  color: #6a6258;
  font-family: var(--font-display);
  font-size: 0.9rem;
}

.printable__hours {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 24px;
  padding: 24px 32px 32px;
  border-top: 1px solid rgba(26,23,20,0.10);
}
.printable__hours h3 {
  font-family: var(--font-display);
  font-size: 1rem; font-weight: 500;
  margin: 0 0 10px;
  color: #1a1714;
}
.printable__hours ul {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 8px;
}
.printable__hours li {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 12px; color: #6a6258;
  border-bottom: 1px dashed rgba(26,23,20,0.08);
  padding-bottom: 6px;
}
.printable__hours li:last-child { border-bottom: 0; }
.printable__hours li span:first-child { color: #1a1714; font-weight: 500; }
.printable__foot {
  font-size: 12px; color: #6a6258; line-height: 1.6;
  margin: 0;
  align-self: end;
}

@media (max-width: 880px) {
  .printable { padding: 0; border-radius: 12px; }
  .printable__head { padding: 24px 20px 18px; }
  .printable__grid { display: block; }
  .printable__grid thead { display: none; }
  .printable__grid tbody, .printable__grid tr, .printable__grid td { display: block; width: 100%; }
  .printable__cell {
    border-right: 0;
    border-bottom: 1px solid rgba(26,23,20,0.10);
  }
  .printable__cell::before {
    content: attr(data-day);
  }
  .printable__cell:first-child::before { content: "Monday"; }
  .printable__hours { grid-template-columns: 1fr; padding: 20px; }
}

@media print {
  @page { size: A4 landscape; margin: 12mm; }
  body { background: #faf6ee !important; }
  .print-toolbar, .nav, .footer, .visit { display: none !important; }
  .printable {
    margin: 0; border: 0; border-radius: 0;
    box-shadow: none;
  }
}
`;
