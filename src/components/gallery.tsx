import type { GalleryItem } from "@/lib/types";

export function Gallery({ items }: { items: GalleryItem[] }) {
  const cells = items.length ? items : [];
  return (
    <section className="gallery" id="gallery">
      <header className="section-head section-head--row">
        <div>
          <span className="eyebrow">— 05 Gallery</span>
          <h2 className="display">
            <em>Inside</em> the academy.
          </h2>
        </div>
        <a
          className="link-arrow"
          href="https://instagram.com/pablosilvabjjhq"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow on Instagram
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </header>

      <div className="gallery__strip" style={{
        gridTemplateColumns: `repeat(${Math.max(cells.length, 1)}, 1fr)`,
      }}>
        {cells.map((c, i) => (
          <div
            key={c.id ?? i}
            className="gallery__cell"
            style={{ backgroundImage: `url(${c.url})` }}
            role="img"
            aria-label={c.caption ?? ""}
          >
            {c.caption && <span className="gallery__cap">{c.caption}</span>}
          </div>
        ))}
      </div>
      <style>{galleryCss}</style>
    </section>
  );
}

const galleryCss = `
.gallery {
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  background: #ebe2d1;
}
.section-head--row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
}
.gallery .section-head { max-width: 1280px; margin: 0 auto clamp(2.5rem, 5vw, 4rem); }
.gallery__strip {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  gap: 12px;
  height: clamp(320px, 38vw, 460px);
}
.gallery__cell {
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  overflow: hidden;
  filter: grayscale(30%) contrast(1.02);
  transition: filter .6s var(--ease-out-soft), transform .6s var(--ease-out-soft);
}
.gallery__cell:hover { filter: grayscale(0%) contrast(1.05); transform: translateY(-4px); }
.gallery__cap {
  position: absolute;
  bottom: 12px; left: 12px; right: 12px;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: #faf6ee;
  background: rgba(26,23,20,0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 6px 10px;
  border-radius: 999px;
  text-align: center;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .3s var(--ease-out-soft), transform .3s var(--ease-out-soft);
}
.gallery__cell:hover .gallery__cap { opacity: 1; transform: translateY(0); }
.link-arrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.02em; color: #1a1714;
  border-bottom: 1px solid rgba(26,23,20,0.12);
  padding-bottom: 4px;
  transition: gap .25s var(--ease-out-soft), color .25s var(--ease-out-soft),
              border-color .25s var(--ease-out-soft);
  text-decoration: none;
}
.link-arrow:hover { gap: 14px; color: #6f542f; border-color: #6f542f; }
@media (max-width: 880px) {
  .gallery__strip {
    grid-template-columns: repeat(2, 1fr) !important;
    grid-auto-rows: 200px;
    height: auto;
  }
}
`;
