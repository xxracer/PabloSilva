import Link from "next/link";
import { SectionHead } from "./section-head";
import type { Program } from "@/lib/types";

export function Programs({ programs }: { programs: Program[] }) {
  if (!programs.length) return null;
  return (
    <section className="programs" id="programs">
      <SectionHead
        number="02 Programs"
        title="Four ways"
        italic="to begin."
        sub="A curriculum built for serious progression — from a child's first class to a competitor's tournament prep."
      />

      <div className="programs__grid">
        {programs.map((p, i) => {
          const isFeature = i === programs.length - 1;
          return (
            <article key={p.id} className={`card${isFeature ? " card--feature" : ""}`}>
              {p.image && (
                <div
                  className="card__media"
                  style={{ backgroundImage: `url(${p.image})` }}
                  role="img"
                  aria-label={p.title}
                />
              )}
              <div className="card__body">
                <span className="card__tag">{p.ageRange}</span>
                <h3 className="card__title">{p.title}</h3>
                {p.tagline && <p className="card__tagline">{p.tagline}</p>}
                <p className="card__copy">{p.description}</p>
                {p.ctaLabel && p.ctaHref && (
                  <Link href={p.ctaHref} className="card__link">
                    <span>{p.ctaLabel}</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <style>{programsCss}</style>
    </section>
  );
}

const programsCss = `
.programs {
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  background: #ebe2d1;
}
.programs__grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
}
.card {
  position: relative;
  background: #f4ede1;
  display: flex; flex-direction: column;
  border-radius: 22px;
  overflow: hidden;
  min-height: 460px;
  transition: background .35s var(--ease-out-soft);
}
.card--feature {
  grid-column: span 2;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  min-height: 380px;
  background: #1a1714;
  color: #faf6ee;
}
.card__media {
  position: relative;
  background-size: cover;
  background-position: center;
  min-height: 240px;
  filter: grayscale(20%) contrast(1.02);
  transition: transform .8s var(--ease-out-soft), filter .8s var(--ease-out-soft);
}
.card__media::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(26,23,20,0.25));
}
.card:hover .card__media { transform: scale(1.04); filter: grayscale(0%) contrast(1.05); }
.card__body {
  padding: clamp(1.5rem, 2.4vw, 2rem);
  display: flex; flex-direction: column;
  flex: 1;
}
.card--feature .card__media { min-height: 100%; }
.card--feature .card__body {
  padding: clamp(1.75rem, 3.5vw, 3rem);
  justify-content: center;
  background: #1a1714;
}
.card__tag {
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: #6f542f; margin-bottom: 1rem;
}
.card--feature .card__tag { color: #8a6a3d; }
.card__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 0 0 0.5rem;
  color: #1a1714;
}
.card--feature .card__title { color: #faf6ee; }
.card__tagline {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(1rem, 1.3vw, 1.15rem);
  line-height: 1.4;
  color: #6f542f;
  margin: 0 0 1rem;
  font-variation-settings: "opsz" 36, "SOFT" 100;
}
.card--feature .card__tagline { color: #d4b87a; }
.card__copy {
  color: #6a6258;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
}
.card--feature .card__copy { color: #e3d8c4; }
.card__link {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500;
  color: #1a1714;
  align-self: flex-start;
  border-bottom: 1px solid rgba(26,23,20,0.12);
  padding-bottom: 4px;
  transition: gap .25s var(--ease-out-soft), color .25s var(--ease-out-soft),
              border-color .25s var(--ease-out-soft);
  text-decoration: none;
}
.card--feature .card__link { color: #faf6ee; border-bottom-color: rgba(244,237,225,0.18); }
.card__link:hover { gap: 14px; color: #6f542f; border-color: #6f542f; }
.card--feature .card__link:hover { color: #8a6a3d; border-color: #8a6a3d; }
@media (max-width: 760px) {
  .programs__grid { grid-template-columns: 1fr; }
  .card--feature { grid-column: span 1; grid-template-columns: 1fr; }
  .card--feature .card__media { min-height: 260px; }
}
`;
