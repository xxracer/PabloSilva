import Image from "next/image";
import type { Instructor } from "@/lib/types";

export function Instructor({ instructors }: { instructors: Instructor[] }) {
  // Show first instructor as the spotlight; rest are stacked in a smaller block.
  const head = instructors[0];
  const others = instructors.slice(1);
  if (!head) return null;
  const tags = head.tags ?? [];

  return (
    <section className="instructor" id="instructor">
      <div className="instructor__inner">
        <div className="instructor__media">
          {head.image && (
            <Image
              src={head.image}
              alt={head.name}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 880px) 50vw, 100vw"
              quality={70}
              className="instructor__portrait"
            />
          )}
          <div className="instructor__badge">
            <span className="instructor__badge-num">2010</span>
            <span className="instructor__badge-txt">
              IBJJF Black<br />Belt World<br />Champion
            </span>
          </div>
        </div>

        <div className="instructor__body">
          <span className="eyebrow eyebrow--light">— 03 The Professor</span>
          <h2 className="display display--light">
            {head.name.split(" ")[0]} <em>{head.name.split(" ").slice(1).join(" ") || "Silva"}</em>
          </h2>
          {head.bio && <p className="instructor__lede">&ldquo;{head.bio.split(".")[0]}.&rdquo;</p>}
          <p className="instructor__copy">
            {head.role}. {head.bio}
          </p>

          {tags.length > 0 && (
            <dl className="instructor__stats">
              {tags.slice(0, 3).map((t, i) => (
                <div key={i}><dt>{t}</dt><dd>—</dd></div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {others.length > 0 && (
        <div className="instructor__grid">
          {others.map((i) => (
            <article key={i.id} className="coach">
              {i.image && (
                <Image
                  src={i.image}
                  alt={i.name}
                  width={480}
                  height={600}
                  sizes="(min-width: 880px) 33vw, 100vw"
                  quality={65}
                  loading="lazy"
                  className="coach__photo"
                />
              )}
              <div className="coach__body">
                <h3>{i.name}</h3>
                {i.role && <p className="coach__role">{i.role}</p>}
                {i.bio && <p className="coach__bio">{i.bio}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
      <style>{instructorCss}</style>
    </section>
  );
}

const instructorCss = `
.instructor {
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  background: #1a1714;
  color: #faf6ee;
  position: relative;
  overflow: hidden;
}
.instructor::before {
  content: "";
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.96 0 0 0 0 0.92 0 0 0 0 0.84 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
  opacity: 0.08;
  mix-blend-mode: overlay;
  pointer-events: none;
}
.instructor__inner {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}
.instructor__media {
  position: relative;
  aspect-ratio: 4/5;
  border-radius: 22px;
  overflow: hidden;
  background: #2a2521;
}
.instructor__portrait {
  object-fit: cover;
  object-position: center 20%;
  filter: grayscale(20%) contrast(1.05) brightness(0.9);
  transition: filter 1s var(--ease-out-soft), transform 1s var(--ease-out-soft);
}
.instructor__media:hover .instructor__portrait {
  filter: grayscale(0%) contrast(1.05) brightness(0.95);
  transform: scale(1.02);
}
.instructor__badge {
  position: absolute;
  bottom: 24px; left: 24px;
  background: #1a1714;
  color: #faf6ee;
  padding: 18px 22px;
  border-radius: 12px;
  display: flex; align-items: center; gap: 14px;
  border: 1px solid rgba(255,255,255,0.12);
  z-index: 1;
}
.instructor__badge-num {
  font-family: var(--font-display);
  font-size: 2.2rem; font-weight: 500;
  color: #8a6a3d; letter-spacing: -0.01em; line-height: 1;
}
.instructor__badge-txt {
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  line-height: 1.4; color: #f4ede1;
}
.instructor__body { max-width: 520px; }
.eyebrow--light { color: #948b7e; }
.display--light { color: #faf6ee; }
.display--light em { color: #8a6a3d; }
.instructor__lede {
  font-family: var(--font-display);
  font-style: italic; font-weight: 300;
  font-size: clamp(1.3rem, 2vw, 1.65rem);
  line-height: 1.4; color: #f4ede1;
  margin: 1.5rem 0 1.25rem;
  font-variation-settings: "opsz" 36, "SOFT" 100;
}
.instructor__copy {
  color: #e3d8c4;
  font-size: 1.025rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
}
.instructor__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.08);
  border-top: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin: 0;
}
.instructor__stats > div { background: #1a1714; padding: 18px 14px 18px 0; }
.instructor__stats dt {
  font-family: var(--font-display);
  font-size: 1.2rem; font-weight: 500;
  color: #faf6ee; letter-spacing: -0.01em;
  margin-bottom: 4px;
}
.instructor__stats dd {
  font-size: 11px; color: #948b7e;
  letter-spacing: 0.1em; text-transform: uppercase;
  margin: 0;
}
.instructor__grid {
  position: relative;
  max-width: 1280px;
  margin: clamp(2.5rem, 5vw, 4rem) auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
.coach {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
  display: flex; flex-direction: column;
}
.coach__photo {
  width: 100%;
  height: auto;
  aspect-ratio: 4/5;
  object-fit: cover;
  object-position: center;
  filter: grayscale(30%) contrast(1.02);
  display: block;
}
.coach__body { padding: 1.1rem 1.2rem 1.3rem; }
.coach__body h3 {
  font-family: var(--font-display);
  font-size: 1.2rem; font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0 0 4px;
  color: #faf6ee;
}
.coach__role { color: #8a6a3d; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 8px; }
.coach__bio { color: #c4baa3; font-size: 0.9rem; line-height: 1.55; margin: 0; }
@media (max-width: 880px) {
  .instructor__inner { grid-template-columns: 1fr; }
  .instructor__media { aspect-ratio: 3/4; max-width: 480px; }
  .instructor__grid { grid-template-columns: 1fr; }
}
`;
