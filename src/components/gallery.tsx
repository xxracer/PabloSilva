import Image from "next/image";
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

      <div className="gallery__strip">
        {cells.map((c, idx) => {
          const w = c.width ?? "sm";
          const dims =
            w === "lg" ? { w: 1600, h: 1000 } :
            w === "md" ? { w: 1200, h: 900 } :
                         { w: 900,  h: 1200 };
          // The whole strip is below the fold, but it's small (5 cells) and the
          // user expects gallery images to be there on first scroll on mobile.
          // Eager-load everything so there's no pop-in.
          return (
            <figure
              key={c.id}
              className={`gallery__cell gallery__cell--${w}`}
            >
              <Image
                src={c.url}
                alt={c.caption ?? ""}
                width={dims.w}
                height={dims.h}
                sizes={
                  w === "lg" ? "(min-width: 880px) 58vw, 100vw" :
                  w === "md" ? "(min-width: 880px) 42vw, 100vw" :
                               "(min-width: 880px) 33vw, (min-width: 480px) 50vw, 100vw"
                }
                quality={65}
                loading="eager"
                fetchPriority={idx < 2 ? "high" : "auto"}
                className="gallery__img"
              />
              {c.caption && <figcaption className="gallery__cap">{c.caption}</figcaption>}
            </figure>
          );
        })}
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
  gap: 14px;
  grid-template-columns: repeat(12, 1fr);
}

/* Each cell is a frame with a fixed aspect ratio (the photo fits the frame,
   nothing is cropped). The width tag (lg/md/sm) picks the cell width in the
   12-col grid AND the aspect ratio of the frame:
     - lg  → wide 16:10   (use with landscape photos)
     - md  → 4:3           (almost square, works for any photo)
     - sm  → 3:4 portrait  (use with portrait / vertical photos)
*/
.gallery__cell { margin: 0; position: relative; overflow: hidden; border-radius: 12px; }
.gallery__cell--lg { grid-column: span 7; aspect-ratio: 16 / 10; }
.gallery__cell--md { grid-column: span 5; aspect-ratio: 4 / 3; }
.gallery__cell--sm { grid-column: span 4; aspect-ratio: 3 / 4; }

.gallery__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: grayscale(30%) contrast(1.02);
  transition: filter .6s var(--ease-out-soft), transform .6s var(--ease-out-soft);
}
.gallery__cell:hover .gallery__img {
  filter: grayscale(0%) contrast(1.05);
  transform: scale(1.02);
}
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
  pointer-events: none;
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
  .gallery__strip { grid-template-columns: repeat(2, 1fr) !important; }
  .gallery__cell--lg { grid-column: span 2; aspect-ratio: 16 / 10; }
  .gallery__cell--md { grid-column: span 2; aspect-ratio: 4 / 3; }
  .gallery__cell--sm { grid-column: span 1; aspect-ratio: 3 / 4; }
}
@media (max-width: 480px) {
  .gallery__strip { grid-template-columns: 1fr !important; }
  .gallery__cell--lg { grid-column: span 1; aspect-ratio: 16 / 10; }
  .gallery__cell--md { grid-column: span 1; aspect-ratio: 4 / 3; }
  .gallery__cell--sm { grid-column: span 1; aspect-ratio: 3 / 4; }
}
`;
