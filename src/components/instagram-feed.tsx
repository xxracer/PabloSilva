/**
 * "Latest from Instagram" — server component.
 * Renders the academy's Instagram posts as native embeds, read from the
 * CMS. Reuses the <Embed> primitive from components/embed.tsx.
 */
import { Embed } from "@/components/embed";
import { getMeta } from "@/lib/queries";
import type { InstagramFeedItem } from "@/lib/types";

export function InstagramFeed({ items }: { items: InstagramFeedItem[] }) {
  if (!items || items.length === 0) return null;

  const meta = getMeta();
  const handle = (() => {
    const m = meta.instagram?.match(/instagram\.com\/([^/?#]+)/i);
    return m ? `@${m[1]}` : "@pablosilvabjjhq";
  })();
  const profileUrl =
    meta.instagram && meta.instagram.length > 0
      ? meta.instagram
      : "https://instagram.com/pablosilvabjjhq";

  return (
    <section className="igfeed">
      <div className="igfeed__inner">
        <header className="igfeed__head">
          <span className="igfeed__eyebrow">— {handle}</span>
          <h2 className="igfeed__title">
            Latest from<br /><em>Instagram.</em>
          </h2>
          <p className="igfeed__sub">
            A peek at what training looks like at Pablo Silva BJJ. Follow along
            for class footage, competition highlights, and the academy community.
          </p>
          <a
            className="igfeed__cta"
            href={profileUrl}
            target="_blank" rel="noopener noreferrer"
          >
            <span>Follow on Instagram</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </header>

        <div className="igfeed__grid">
          {items.map((it, i) => (
            <div key={i} className="igfeed__cell">
              <Embed
                url={it.url}
                caption={it.caption || null}
                aspect="4/5"
              />
            </div>
          ))}
        </div>
      </div>
      <style>{igCss}</style>
    </section>
  );
}

const igCss = `
.igfeed {
  background: #ebe2d1;
  color: #1a1714;
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  position: relative;
  overflow: hidden;
}
.igfeed::before {
  content: "";
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 90% 10%, rgba(138,106,61,0.10), transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 90%, rgba(138,106,61,0.08), transparent 60%);
  pointer-events: none;
}
.igfeed__inner {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.85fr 2.15fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}
.igfeed__head { position: sticky; top: 110px; }
.igfeed__eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #6a6258; margin-bottom: 1.4rem;
}
.igfeed__eyebrow::before {
  content: ""; display: inline-block; width: 24px; height: 1px;
  background: currentColor; opacity: 0.6;
}
.igfeed__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.2rem, 4.8vw, 3.6rem);
  line-height: 0.98; letter-spacing: -0.02em;
  margin: 0; color: #1a1714;
  font-variation-settings: "opsz" 144, "SOFT" 50;
}
.igfeed__title em {
  font-style: italic; font-weight: 300; color: #6f542f;
  font-variation-settings: "opsz" 144, "SOFT" 100;
}
.igfeed__sub {
  font-family: var(--font-display);
  font-weight: 300; font-size: 1.05rem; line-height: 1.55;
  color: #6a6258;
  margin: 1.1rem 0 1.6rem;
  max-width: 380px;
}
.igfeed__cta {
  display: inline-flex; align-items: center; gap: 8px;
  background: #1a1714; color: #faf6ee;
  border-radius: 999px;
  padding: 11px 18px;
  font-size: 13px; font-weight: 500;
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: background .2s var(--ease-out-soft), color .2s var(--ease-out-soft), transform .2s var(--ease-out-soft);
}
.igfeed__cta:hover { background: #8a6a3d; transform: translateY(-1px); }

.igfeed__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(1rem, 2vw, 1.6rem);
}
.igfeed__cell { min-width: 0; }

@media (max-width: 880px) {
  .igfeed__inner { grid-template-columns: 1fr; gap: 1.6rem; }
  .igfeed__head { position: static; }
  .igfeed__grid { grid-template-columns: 1fr; }
}
`;
