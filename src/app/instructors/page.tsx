import type { Metadata } from "next";
import Image from "next/image";
import { Visit } from "@/components/visit";
import { getInstructors } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Instructors — Pablo Silva BJJ",
  description: "Meet the coaches at Pablo Silva BJJ — led by 2010 IBJJF Black Belt World Champion Pablo Silva.",
};

export default function InstructorsPage() {
  const instructors = getInstructors();

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__inner">
          <span className="eyebrow">— Instructors</span>
          <h1 className="display">
            The people<br />
            who <em>teach</em> here.
          </h1>
          <p className="lead">
            A small team of experienced coaches who care about craft, character,
            and the long arc of every student who walks in the door.
          </p>
        </div>
      </section>

      <section className="instructors">
        <div className="instructors__grid">
          {instructors.map((i) => (
            <article key={i.id} className="instructor-card">
              {i.image && (
                <div className="instructor-card__media-wrap">
                  <Image
                    src={i.image}
                    alt={i.name}
                    fill
                    sizes="(min-width: 880px) 40vw, 100vw"
                    quality={70}
                    loading="lazy"
                    className="instructor-card__media"
                  />
                </div>
              )}
              <div className="instructor-card__body">
                <h2 className="instructor-card__name">{i.name}</h2>
                {i.role && <p className="instructor-card__role">{i.role}</p>}
                {i.bio && <p className="instructor-card__bio">{i.bio}</p>}
                {i.tags && i.tags.length > 0 && (
                  <ul className="instructor-card__tags">
                    {i.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <Visit />

      <style>{instructorsCss}</style>
    </>
  );
}

const instructorsCss = `
.page-hero {
  padding: 180px clamp(1.25rem, 4vw, 3rem) 80px;
  background: #1a1714; color: #faf6ee;
  position: relative; overflow: hidden;
}
.page-hero::before {
  content: ""; position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.96 0 0 0 0 0.92 0 0 0 0 0.84 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
  opacity: 0.10; mix-blend-mode: overlay; pointer-events: none;
}
.page-hero__inner { max-width: 1280px; margin: 0 auto; position: relative; }
.page-hero .display { color: #faf6ee; max-width: 14ch; }
.page-hero .display em { color: #8a6a3d; }
.page-hero .lead { color: #f4ede1; opacity: 0.85; max-width: 560px; margin-top: 1.5rem; }

.eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #948b7e; margin-bottom: 1.4rem;
}
.eyebrow::before { content: ""; display: inline-block; width: 24px; height: 1px; background: currentColor; opacity: 0.6; }
.lead {
  font-family: var(--font-display); font-weight: 300;
  font-size: clamp(1.2rem, 1.8vw, 1.45rem);
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
.display em { font-style: italic; font-weight: 300; color: #6f542f; font-variation-settings: "opsz" 144, "SOFT" 100; }

.instructors {
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  background: #ebe2d1;
}
.instructors__grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: rgba(26,23,20,0.10);
  border-top: 1px solid rgba(26,23,20,0.10);
  border-bottom: 1px solid rgba(26,23,20,0.10);
}
.instructor-card {
  background: #f4ede1;
  display: grid;
  grid-template-columns: 1fr 1.3fr;
}
.instructor-card__media-wrap {
  position: relative;
  min-height: 380px;
}
.instructor-card__media {
  object-fit: cover;
  object-position: center;
  filter: grayscale(20%) contrast(1.02);
}
.instructor-card__body {
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: flex; flex-direction: column; justify-content: center;
  gap: 10px;
}
.instructor-card__name {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: #1a1714;
  margin: 0;
}
.instructor-card__role {
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: #6f542f; margin: 0;
}
.instructor-card__bio {
  color: #6a6258;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 8px 0 0;
}
.instructor-card__tags {
  list-style: none;
  display: flex; flex-wrap: wrap; gap: 6px;
  margin: 14px 0 0; padding: 0;
}
.instructor-card__tags li {
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.06em;
  color: #1a1714;
  padding: 6px 10px;
  border: 1px solid rgba(26,23,20,0.12);
  border-radius: 999px;
  background: rgba(255,255,255,0.4);
}
@media (max-width: 880px) {
  .instructors__grid { grid-template-columns: 1fr; }
  .instructor-card { grid-template-columns: 1fr; min-height: 0; }
  .instructor-card__media-wrap { min-height: 280px; }
}
`;
