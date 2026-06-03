import type { Metadata } from "next";
import Image from "next/image";
import { Marquee } from "@/components/marquee";
import { Visit } from "@/components/visit";
import { Philosophy } from "@/components/philosophy";
import { getPrograms } from "@/lib/queries";
import type { Program } from "@/lib/types";

export const metadata: Metadata = {
  title: "Programs — Pablo Silva BJJ",
  description:
    "Brazilian Jiu-Jitsu programs at Pablo Silva BJJ: Little Champions (3–6), Champions And Teens (7–16), Kids Competition, and Adults BJJ. Bellaire, Texas.",
};

// Instagram embeds to demo the embed feature. These are public posts from
// @pablosilvabjjhq (the academy's official Instagram) and can be swapped from
// the admin panel.
const INSTAGRAM_EMBEDS = [
  "https://www.instagram.com/p/DAb4F7GPGxC/",
  "https://www.instagram.com/p/DFAOXcKuaFt/",
  "https://www.instagram.com/p/C-mxJD9uIXr/",
  "https://www.instagram.com/p/C3LDR_yuUE0/",
];

export default function ProgramsPage() {
  const programs = getPrograms();

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__inner">
          <span className="eyebrow">— Programs</span>
          <h1 className="display">
            Explore our programs.<br />
            <em>Tailored training</em> for every age.
          </h1>
          <p className="lead">
            Four programs, one academy. Whether you&apos;re starting a 3-year-old on
            the mat or a brown belt sharpening their A-game, there&apos;s a path for you.
          </p>
        </div>
      </section>

      <Marquee items={["Confidence", "Self-Defense", "Discipline", "Respect"]} />

      <section className="programs" id="programs">
        <header className="section-head">
          <span className="eyebrow">— The four programs</span>
          <h2 className="display">
            Four ways<br /><em>to begin.</em>
          </h2>
          <p className="section-head__sub">
            A curriculum built for serious progression — from a child&apos;s first class
            to a competitor&apos;s tournament prep.
          </p>
        </header>

        <div className="programs__list">
          {programs.map((p, i) => (
            <ProgramRow key={p.id} p={p} flip={i % 2 === 1} priority={i === 0} />
          ))}
        </div>
      </section>

      <section className="embeds">
        <header className="section-head">
          <span className="eyebrow">— From the mat</span>
          <h2 className="display">
            <em>Inside</em> the academy.
          </h2>
          <p className="section-head__sub">
            A live look at training, competition, and the people who make this
            academy what it is. Follow along on Instagram.
          </p>
        </header>

        <div className="embeds__grid">
          {INSTAGRAM_EMBEDS.map((url, i) => (
            <blockquote
              key={i}
              className="instagram-media"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: 14,
                margin: 0,
                maxWidth: 540,
                minWidth: 280,
                width: "calc(100% - 2px)",
                boxShadow: "0 1px 0 rgba(0,0,0,.08)",
              }}
            >
              <a href={url} target="_blank" rel="noopener noreferrer">View on Instagram</a>
            </blockquote>
          ))}
        </div>
        <script async src="https://www.instagram.com/embed.js" />
      </section>

      <Philosophy />

      <Visit />

      <style>{programsPageCss}</style>
    </>
  );
}

function ProgramRow({ p, flip, priority }: { p: Program; flip: boolean; priority?: boolean }) {
  return (
    <article className={`prow${flip ? " prow--flip" : ""}`}>
      <div className="prow__media">
        {p.image && (
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(min-width: 880px) 50vw, 100vw"
            quality={70}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            className="prow__media-img"
          />
        )}
        <span className="prow__age">{p.ageRange}</span>
      </div>

      <div className="prow__body">
        <h3 className="prow__title">{p.title}</h3>
        {p.tagline && <p className="prow__tagline">{p.tagline}</p>}
        <p className="prow__copy">{p.description}</p>

        {p.details && p.details.length > 0 && (
          <ul className="prow__details">
            {p.details.map((d, idx) => {
              if (typeof d === "string") return <li key={idx}>{d}</li>;
              return null;
            })}
          </ul>
        )}

        <div className="prow__ctas">
          {p.ctaLabel && p.ctaHref && (
            <a className="prow__cta" href={p.ctaHref}>
              <span>{p.ctaLabel}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          )}
          {p.ctaLabel2 && p.ctaHref2 && (
            <a className="prow__cta prow__cta--secondary" href={p.ctaHref2}>
              <span>{p.ctaLabel2}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

const programsPageCss = `
.page-hero {
  padding: 180px clamp(1.25rem, 4vw, 3rem) 80px;
  background: #1a1714;
  color: #faf6ee;
  position: relative;
  overflow: hidden;
}
.page-hero::before {
  content: ""; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 80% 20%, rgba(138,106,61,0.18), transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 80%, rgba(138,106,61,0.10), transparent 60%);
  pointer-events: none;
}
.page-hero__inner { max-width: 1280px; margin: 0 auto; position: relative; }
.page-hero .display { color: #faf6ee; max-width: 18ch; }
.page-hero .display em { color: #8a6a3d; }
.page-hero .lead { color: #f4ede1; opacity: 0.85; max-width: 580px; margin-top: 1.5rem; }

.eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #6a6258; margin-bottom: 1.4rem;
}
.eyebrow::before { content: ""; display: inline-block; width: 24px; height: 1px; background: currentColor; opacity: 0.6; }
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
.section-head { max-width: 1280px; margin: 0 auto clamp(2.5rem, 5vw, 4.5rem); }
.section-head .display { max-width: 14ch; }
.section-head__sub {
  max-width: 480px;
  margin-top: 1.5rem;
  color: #6a6258;
  font-size: 1.05rem;
  line-height: 1.65;
}

.programs {
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  background: #ebe2d1;
}
.programs__list {
  max-width: 1280px;
  margin: 0 auto;
  display: flex; flex-direction: column;
  gap: clamp(2.5rem, 5vw, 4rem);
}

.prow {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: center;
}
.prow--flip { grid-template-columns: 1fr 1.05fr; }
.prow--flip .prow__media { order: 2; }
.prow--flip .prow__body { order: 1; }

.prow__media {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  background: #1a1714;
  aspect-ratio: 4 / 5;
  box-shadow: 0 24px 60px -20px rgba(26,23,20,0.25);
}
.prow__media-img {
  object-fit: cover;
  object-position: center;
  filter: grayscale(15%) contrast(1.02);
  transition: transform 1s var(--ease-out-soft), filter 1s var(--ease-out-soft);
}
.prow__media:hover .prow__media-img {
  transform: scale(1.03);
  filter: grayscale(0%) contrast(1.05);
}
.prow__media::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(26,23,20,0.35));
  pointer-events: none;
}
.prow__age {
  position: absolute;
  top: 18px; left: 18px;
  z-index: 2;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: #faf6ee;
  background: rgba(26,23,20,0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 6px 12px;
  border-radius: 999px;
}

.prow__body { max-width: 560px; }
.prow__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(2rem, 3.2vw, 2.8rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #1a1714;
  margin: 0 0 0.5rem;
  font-variation-settings: "opsz" 144, "SOFT" 50;
}
.prow__tagline {
  font-family: var(--font-display);
  font-style: italic; font-weight: 300;
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
  line-height: 1.4;
  color: #6f542f;
  margin: 0 0 1.4rem;
  font-variation-settings: "opsz" 36, "SOFT" 100;
}
.prow__copy {
  color: #1a1714;
  font-size: 1.05rem;
  line-height: 1.75;
  margin: 0 0 1.5rem;
}
.prow__details {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}
.prow__details li {
  font-size: 0.95rem;
  color: #4f4738;
  padding: 12px 0;
  border-top: 1px solid rgba(26,23,20,0.08);
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.prow__details li:last-child { border-bottom: 1px solid rgba(26,23,20,0.08); }
.prow__details li::before {
  content: "";
  width: 6px; height: 6px;
  background: #8a6a3d;
  border-radius: 50%;
  flex-shrink: 0;
  transform: translateY(-2px);
}

.prow__ctas {
  display: flex; flex-wrap: wrap; gap: 12px;
}
.prow__cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 22px;
  border-radius: 999px;
  background: #1a1714;
  color: #faf6ee;
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: background .25s var(--ease-out-soft), color .25s var(--ease-out-soft),
              transform .25s var(--ease-out-soft);
}
.prow__cta:hover { background: #8a6a3d; transform: translateY(-1px); }
.prow__cta:hover svg { transform: translateX(2px); }
.prow__cta svg { transition: transform .25s var(--ease-out-soft); }

.prow__cta--secondary {
  background: transparent;
  color: #1a1714;
  border: 1px solid rgba(26,23,20,0.18);
}
.prow__cta--secondary:hover {
  background: #1a1714;
  color: #faf6ee;
  border-color: #1a1714;
}

.embeds {
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  background: #f4ede1;
}
.embeds__grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}
.embeds__grid .instagram-media { margin: 0 !important; width: 100% !important; min-width: 0 !important; }

@media (max-width: 880px) {
  .prow, .prow--flip { grid-template-columns: 1fr; }
  .prow--flip .prow__media { order: 1; }
  .prow--flip .prow__body { order: 2; }
  .prow__media { aspect-ratio: 4 / 3; }
  .embeds__grid { grid-template-columns: 1fr; }
}
`;
