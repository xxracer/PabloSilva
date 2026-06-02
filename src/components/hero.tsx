import { getHero } from "@/lib/queries";
import type { HeroData } from "@/lib/types";

export function Hero({ data }: { data?: HeroData }) {
  const h = data ?? getHero();
  const lines = h.titleLines.length
    ? h.titleLines
    : ["Where", "champions", "are made."];
  const portrait = h.portrait || "/images/hero-competition.jpg";
  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <div
          className="hero__bg-img"
          style={{ backgroundImage: `url(${portrait})` }}
        />
        <div className="hero__bg-veil" />
        <div className="hero__bg-grain" />
      </div>

      <div className="hero__inner">
        {h.eyebrow && (
          <div className="hero__eyebrow">
            <span className="dot" />
            {h.eyebrow}
          </div>
        )}

        <h1 className="hero__title">
          {lines.map((line, i) => (
            <span key={i} className={`hero__line${i === 1 ? " hero__line--italic" : ""}`}>
              {line}
            </span>
          ))}
        </h1>

        {h.subtitle && <p className="hero__lede">{h.subtitle}</p>}

        {(h.ctaPrimary?.label || h.ctaSecondary?.label) && (
          <div className="hero__actions">
            {h.ctaPrimary?.label && (
              <a className="btn btn--primary" href={h.ctaPrimary.href || "#"}>
                <span>{h.ctaPrimary.label}</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            )}
            {h.ctaSecondary?.label && (
              <a className="btn btn--ghost btn--hero-ghost" href={h.ctaSecondary.href || "#"}>{h.ctaSecondary.label}</a>
            )}
          </div>
        )}

        {h.values.length > 0 && (
          <dl className="hero__stats">
            {h.values.slice(0, 3).map((v, i) => (
              <div key={i}>
                <dt>{String(i + 1).padStart(2, "0")}</dt>
                <dd>{v.title}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero__scroll-line" />
      </div>

      <style>{heroCss}</style>
    </section>
  );
}

const heroCss = `
.hero {
  position: relative;
  min-height: 100dvh;
  padding: 140px clamp(1.25rem, 4vw, 3rem) 80px;
  display: flex; align-items: center;
  overflow: hidden;
  background: #1a1714;
  color: #faf6ee;
}
.hero__bg { position: absolute; inset: 0; z-index: 0; }
.hero__bg-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center 30%;
  filter: grayscale(35%) contrast(1.05) brightness(0.55);
  transform: scale(1.05);
  animation: heroDrift 24s ease-in-out infinite alternate;
}
.hero__bg-veil {
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, rgba(26,23,20,0.55) 0%, rgba(26,23,20,0.35) 40%, rgba(26,23,20,0.85) 100%),
    radial-gradient(ellipse at 20% 50%, transparent 0%, rgba(26,23,20,0.4) 60%);
}
.hero__bg-grain {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.96 0 0 0 0 0.92 0 0 0 0 0.84 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
  opacity: 0.18;
  mix-blend-mode: overlay;
  pointer-events: none;
}
.hero__inner {
  position: relative; z-index: 2;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
}
.hero__eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 12px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #948b7e; margin-bottom: 32px;
}
.hero__eyebrow .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #8a6a3d;
  box-shadow: 0 0 0 4px rgba(138,106,61,0.10);
}
.hero__title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(3rem, 10vw, 9rem);
  line-height: 0.92;
  letter-spacing: -0.035em;
  color: #faf6ee;
  margin: 0 0 36px;
  font-variation-settings: "opsz" 144, "SOFT" 30;
}
.hero__line { display: block; }
.hero__line--italic {
  font-style: italic;
  font-weight: 300;
  color: #8a6a3d;
  padding-left: clamp(2rem, 10vw, 9rem);
  font-variation-settings: "opsz" 144, "SOFT" 100;
}
.hero__lede {
  max-width: 520px;
  font-size: clamp(1rem, 1.3vw, 1.125rem);
  line-height: 1.6;
  color: #f4ede1;
  margin-bottom: 44px;
  opacity: 0.85;
}
.hero__actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 80px; }
.hero__actions .btn--primary { background: #faf6ee; color: #1a1714; }
.hero__actions .btn--primary:hover { background: #8a6a3d; color: #faf6ee; }
.btn--hero-ghost { color: #faf6ee; border-color: rgba(244,237,225,0.25); }
.btn--hero-ghost:hover { background: #faf6ee; color: #1a1714; border-color: #faf6ee; }
.hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  max-width: 720px;
  border-top: 1px solid rgba(255,255,255,0.12);
  padding-top: 28px;
}
.hero__stats > div { display: flex; flex-direction: column; gap: 6px; padding-right: 20px; }
.hero__stats dt {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.2vw, 1.85rem);
  font-weight: 500; color: #faf6ee;
  letter-spacing: -0.01em;
}
.hero__stats dd {
  font-size: 12px; color: #948b7e;
  letter-spacing: 0.04em; margin: 0;
}
.hero__scroll {
  position: absolute; bottom: 36px; left: 50%;
  transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase;
  color: #948b7e; z-index: 2;
}
.hero__scroll-line {
  width: 1px; height: 40px;
  background: linear-gradient(180deg, #948b7e, transparent);
  animation: scrollPulse 2.4s var(--ease-out-soft) infinite;
  transform-origin: top;
}
@media (max-width: 720px) {
  .hero { padding-top: 120px; }
  .hero__line--italic { padding-left: 2rem; }
  .hero__stats { grid-template-columns: 1fr; gap: 18px; }
  .hero__stats > div { padding-right: 0; padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.12); }
  .hero__stats > div:last-child { border-bottom: 0; }
  .hero__scroll { display: none; }
}
`;
