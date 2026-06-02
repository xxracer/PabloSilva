import type { Metadata } from "next";
import { Visit } from "@/components/visit";

export const metadata: Metadata = {
  title: "Schedule — Pablo Silva BJJ",
  description:
    "Weekly class schedule at Pablo Silva BJJ. Little Champions, Champions & Teens, Kids Competition, and Adults BJJ. Bellaire, Texas.",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Slot = { time: string; program: string; ages: string };

// Per-day class plan. Times derived from the official site hours
// (Mon–Fri 7AM – 7:30 PM, Sat 8AM – 10AM) and the per-program times already
// in the programs table.
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

export default function SchedulePage() {
  return (
    <>
      <section className="bjj-hero" aria-label="Schedule">
        <div className="bjj-hero__inner">
          <div className="bjj-hero__art" aria-hidden>
            <svg viewBox="0 0 600 720" preserveAspectRatio="xMidYMax meet">
              <defs>
                <linearGradient id="giFabric" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f4ede1" />
                  <stop offset="55%" stopColor="#e8dcc4" />
                  <stop offset="100%" stopColor="#cdbfa3" />
                </linearGradient>
                <linearGradient id="giShadow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
                </linearGradient>
                <linearGradient id="belt" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3a2716" />
                  <stop offset="50%" stopColor="#6f542f" />
                  <stop offset="100%" stopColor="#3a2716" />
                </linearGradient>
                <linearGradient id="beltKnot" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4a331e" />
                  <stop offset="50%" stopColor="#8a6a3d" />
                  <stop offset="100%" stopColor="#3a2716" />
                </linearGradient>
                <pattern id="weave" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(26,23,20,0.05)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* hanger */}
              <path d="M260 0 Q300 18 340 0" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
              <circle cx="300" cy="20" r="6" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

              {/* collar (V) */}
              <path d="M180 80 L300 200 L420 80 L380 60 L300 140 L220 60 Z"
                    fill="url(#giFabric)" stroke="rgba(26,23,20,0.18)" strokeWidth="1.2" />
              <path d="M300 200 L300 320" stroke="rgba(26,23,20,0.12)" strokeWidth="1" />
              {/* lapel shadows */}
              <path d="M180 80 L300 200 L300 320 L180 220 Z" fill="rgba(26,23,20,0.06)" />
              <path d="M420 80 L300 200 L300 320 L420 220 Z" fill="rgba(255,255,255,0.10)" />

              {/* body of the gi */}
              <path d="M120 100 L180 80 L220 60 L300 140 L380 60 L420 80 L480 100
                       L520 240 L500 260 L500 540 L420 580 L420 720 L180 720 L180 580
                       L100 540 L100 260 L80 240 Z"
                    fill="url(#giFabric)" stroke="rgba(26,23,20,0.20)" strokeWidth="1.2" />
              <path d="M120 100 L180 80 L220 60 L300 140 L380 60 L420 80 L480 100
                       L520 240 L500 260 L500 540 L420 580 L420 720 L180 720 L180 580
                       L100 540 L100 260 L80 240 Z"
                    fill="url(#weave)" />
              <path d="M120 100 L180 80 L220 60 L300 140 L380 60 L420 80 L480 100
                       L520 240 L500 260 L500 540 L420 580 L420 720 L180 720 L180 580
                       L100 540 L100 260 L80 240 Z"
                    fill="url(#giShadow)" />

              {/* sleeves */}
              <path d="M120 100 L80 240 L40 380 L70 460 L120 440 L160 320 L180 220 Z"
                    fill="url(#giFabric)" stroke="rgba(26,23,20,0.20)" strokeWidth="1.2" />
              <path d="M120 100 L80 240 L40 380 L70 460 L120 440 L160 320 L180 220 Z"
                    fill="url(#weave)" />
              <path d="M480 100 L520 240 L560 380 L530 460 L480 440 L440 320 L420 220 Z"
                    fill="url(#giFabric)" stroke="rgba(26,23,20,0.20)" strokeWidth="1.2" />
              <path d="M480 100 L520 240 L560 380 L530 460 L480 440 L440 320 L420 220 Z"
                    fill="url(#weave)" />
              {/* sleeve cuffs */}
              <rect x="60" y="430" width="60" height="22" fill="#faf6ee" stroke="rgba(26,23,20,0.18)" strokeWidth="1" />
              <rect x="480" y="430" width="60" height="22" fill="#faf6ee" stroke="rgba(26,23,20,0.18)" strokeWidth="1" />

              {/* belt — wraps around the gi */}
              <path d="M100 540 Q300 520 500 540 L500 600 Q300 580 100 600 Z"
                    fill="url(#belt)" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
              {/* belt highlight */}
              <path d="M100 540 Q300 520 500 540" stroke="rgba(255,236,210,0.20)" strokeWidth="2" fill="none" />
              {/* belt knot */}
              <path d="M260 540 L300 580 L340 540 L300 600 Z" fill="url(#beltKnot)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
              <ellipse cx="300" cy="570" rx="42" ry="22" fill="url(#beltKnot)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
              {/* belt ends */}
              <path d="M260 580 L240 720 L210 720 L235 580 Z" fill="url(#belt)" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
              <path d="M340 580 L360 720 L390 720 L365 580 Z" fill="url(#belt)" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />

              {/* subtle stitch lines */}
              <path d="M180 80 L300 200 L420 80" stroke="rgba(26,23,20,0.20)" strokeWidth="0.8" fill="none" />
              <path d="M180 580 L100 540" stroke="rgba(26,23,20,0.18)" strokeWidth="0.8" fill="none" />
              <path d="M420 580 L500 540" stroke="rgba(26,23,20,0.18)" strokeWidth="0.8" fill="none" />
            </svg>
          </div>

          <div className="bjj-hero__text">
            <span className="eyebrow eyebrow--light">— Schedule</span>
            <h1 className="display">
              A week on<br />
              the <em>mat.</em>
            </h1>
            <p className="lead">
              Class times for every program. Kids and adults have dedicated hours —
              competition team members can train up to seven days a week.
            </p>
          </div>
        </div>
      </section>

      <section className="schedule">
        <header className="section-head section-head--row">
          <div>
            <span className="eyebrow">— Weekly classes</span>
            <h2 className="display">
              Class<br /><em>times.</em>
            </h2>
          </div>
          <div className="schedule__actions" aria-label="Download the schedule">
            <a className="schedule__action" href="/schedule/print" data-action="pdf">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <path d="M6 14h12v7H6z" />
              </svg>
              <span>Save as PDF</span>
            </a>
            <a className="schedule__action" href="/api/schedule.ics" data-action="ics">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 9h18M8 3v4M16 3v4" />
                <path d="M12 13v5M9.5 15.5L12 13l2.5 2.5" />
              </svg>
              <span>Add to calendar</span>
            </a>
          </div>
        </header>

        <div className="schedule__grid">
          {DAYS.map((d) => (
            <div key={d} className="schedule__col">
              <div className="schedule__day">
                <span>{d}</span>
                <span className="schedule__day-rule" />
              </div>
              {SCHEDULE[d].length === 0 ? (
                <p className="schedule__closed">Closed</p>
              ) : (
                <ul className="schedule__list">
                  {SCHEDULE[d].map((s, i) => (
                    <li key={i}>
                      <span className="schedule__time">{s.time}</span>
                      <span className="schedule__program">{s.program}</span>
                      <span className="schedule__ages">{s.ages}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="schedule__hours">
          <div>
            <h3>Academy hours</h3>
            <ul>
              {HOURS.map((h) => (
                <li key={h.day}>
                  <span>{h.day}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Booking</h3>
            <p>
              Your first class is on us. <a href="/contact">Book a trial</a> and
              we&apos;ll set up a time that works for you.
            </p>
          </div>
        </div>
      </section>

      <Visit />

      <style>{scheduleCss}</style>
    </>
  );
}

const scheduleCss = `
.bjj-hero {
  position: relative;
  background:
    radial-gradient(ellipse 70% 60% at 75% 30%, rgba(138,106,61,0.20), transparent 65%),
    radial-gradient(ellipse 60% 50% at 10% 90%, rgba(138,106,61,0.12), transparent 60%),
    #1a1714;
  color: #faf6ee;
  padding: 140px clamp(1.25rem, 4vw, 3rem) 100px;
  overflow: hidden;
  min-height: 80vh;
  display: flex; align-items: center;
}
.bjj-hero::after {
  content: "";
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.35) 100%);
  pointer-events: none;
}
.bjj-hero__inner {
  position: relative;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
}
.bjj-hero__text { z-index: 2; }
.bjj-hero .display { color: #faf6ee; max-width: 14ch; }
.bjj-hero .display em { color: #8a6a3d; }
.bjj-hero .lead { color: #f4ede1; opacity: 0.85; max-width: 540px; margin-top: 1.5rem; }

.bjj-hero__art {
  position: relative;
  z-index: 1;
  display: flex; justify-content: center; align-items: flex-end;
  filter: drop-shadow(0 30px 60px rgba(0,0,0,0.5));
}
.bjj-hero__art svg {
  width: 100%;
  max-width: 520px;
  height: auto;
  max-height: 640px;
}

@media (max-width: 880px) {
  .bjj-hero { padding: 110px 1.25rem 70px; min-height: 0; }
  .bjj-hero__inner {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .bjj-hero__art { order: -1; max-width: 280px; margin: 0 auto; }
}

.eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #6a6258; margin-bottom: 1.4rem;
}
.eyebrow::before { content: ""; display: inline-block; width: 24px; height: 1px; background: currentColor; opacity: 0.6; }
.eyebrow--light { color: #c4baa3; }
.eyebrow--light::before { background: #8a6a3d; opacity: 0.8; }
.lead {
  font-family: var(--font-display);
  font-weight: 300; font-size: clamp(1.2rem, 1.8vw, 1.45rem);
  line-height: 1.45; letter-spacing: -0.005em;
  font-variation-settings: "opsz" 36;
}
.display {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(2.5rem, 6.5vw, 5.5rem);
  line-height: 0.98; letter-spacing: -0.02em;
  color: #1a1714; font-variation-settings: "opsz" 144, "SOFT" 50;
  margin: 0;
}
.display em {
  font-style: italic; font-weight: 300; color: #6f542f;
  font-variation-settings: "opsz" 144, "SOFT" 100;
}
.section-head { max-width: 1280px; margin: 0 auto clamp(2.5rem, 5vw, 4rem); }
.section-head .display { max-width: 12ch; }
.section-head--row {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: clamp(1rem, 3vw, 2rem); flex-wrap: wrap;
}
.section-head--row > div:first-child { flex: 1 1 320px; }

.schedule__actions {
  display: flex; flex-wrap: wrap; gap: 10px;
  align-self: flex-end;
}
.schedule__action {
  display: inline-flex; align-items: center; gap: 8px;
  background: #1a1714; color: #faf6ee;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 999px;
  padding: 11px 18px;
  font-family: var(--font-sans);
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: background .2s var(--ease-out-soft), color .2s var(--ease-out-soft), transform .2s var(--ease-out-soft);
}
.schedule__action:hover {
  background: #8a6a3d; color: #faf6ee;
  transform: translateY(-1px);
}
.schedule__action svg { opacity: 0.9; }

.schedule {
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  background: #ebe2d1;
}
.schedule__grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: rgba(26,23,20,0.10);
  border-top: 1px solid rgba(26,23,20,0.10);
  border-bottom: 1px solid rgba(26,23,20,0.10);
}
.schedule__col {
  background: #f4ede1;
  padding: 24px 18px 28px;
  display: flex; flex-direction: column;
  min-height: 360px;
}
.schedule__day {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 18px;
  font-family: var(--font-display);
  font-size: 1.25rem; font-weight: 500;
  letter-spacing: -0.01em;
  color: #1a1714;
}
.schedule__day-rule {
  flex: 1; height: 1px;
  background: rgba(26,23,20,0.10);
}
.schedule__list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 14px;
}
.schedule__list li {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  padding-bottom: 14px;
  border-bottom: 1px dashed rgba(26,23,20,0.10);
}
.schedule__list li:last-child { border-bottom: 0; padding-bottom: 0; }
.schedule__time {
  font-family: var(--font-sans);
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.08em;
  color: #6f542f;
}
.schedule__program {
  font-family: var(--font-display);
  font-size: 0.98rem; font-weight: 500;
  letter-spacing: -0.01em;
  color: #1a1714;
  line-height: 1.3;
}
.schedule__ages {
  font-size: 11px; color: #6a6258;
  letter-spacing: 0.04em;
}
.schedule__closed {
  font-style: italic;
  color: #6a6258;
  font-family: var(--font-display);
  font-size: 1rem;
  margin: 0;
}

.schedule__hours {
  max-width: 1280px;
  margin: clamp(2.5rem, 5vw, 4rem) auto 0;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: clamp(1.5rem, 4vw, 4rem);
}
.schedule__hours h3 {
  font-family: var(--font-display);
  font-size: 1.5rem; font-weight: 500;
  letter-spacing: -0.01em;
  color: #1a1714;
  margin: 0 0 14px;
}
.schedule__hours ul {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 10px;
}
.schedule__hours li {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 13px; color: #6a6258;
  border-bottom: 1px dashed rgba(26,23,20,0.10);
  padding-bottom: 8px;
}
.schedule__hours li:last-child { border-bottom: 0; }
.schedule__hours li span:first-child { color: #1a1714; font-weight: 500; }
.schedule__hours p { color: #6a6258; line-height: 1.7; margin: 0; }
.schedule__hours a { color: #6f542f; border-bottom: 1px solid rgba(111,84,47,0.25); padding-bottom: 1px; text-decoration: none; }
.schedule__hours a:hover { color: #1a1714; border-bottom-color: #1a1714; }

@media (max-width: 980px) {
  .schedule__grid { grid-template-columns: repeat(2, 1fr); }
  .schedule__col { min-height: 0; }
  .schedule__hours { grid-template-columns: 1fr; }
}
`;
