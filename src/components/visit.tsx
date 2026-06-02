import { VisitForm } from "./visit-form";
import { MapPin } from "./map-pin";
import type { VisitData } from "@/lib/types";
import { getHours, getMeta } from "@/lib/queries";

export function Visit({ data }: { data?: VisitData }) {
  const v = data ?? {
    eyebrow: "06 Visit",
    title: "Schedule a",
    italic: "visit.",
    body: "",
    address: "5233 Bellaire Blvd, Bellaire, TX 77401",
    mapUrl: "https://maps.google.com/?q=5233+Bellaire+Blvd+Bellaire+TX",
    image: "",
  };
  const hours = getHours();
  const meta = getMeta();

  return (
    <section className="visit" id="visit">
      <div className="visit__inner">
        <div className="visit__copy">
          <span className="eyebrow eyebrow--light">— {v.eyebrow}</span>
          <h2 className="display display--light">
            {v.title}<br />
            <em>{v.italic}</em>
          </h2>
          {v.body && <p>{v.body}</p>}

          <VisitForm />
        </div>

        <aside className="visit__info">
          <div className="info-card">
            <h3>Academy</h3>
            <p>{v.address}</p>
            <a
              className="link-arrow"
              href={v.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <MapPin />
          </div>

          <div className="info-card">
            <h3>Contact</h3>
            <p>
              <a href="tel:+13463039572">+1 (346) 303-9572</a><br />
              <a href="mailto:pablosilvabjj@gmail.com">pablosilvabjj@gmail.com</a>
            </p>
            {meta.instagram && (
              <div className="info-card__socials">
                {meta.instagram && (
                  <a href={meta.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {hours.length > 0 && (
            <div className="info-card">
              <h3>Hours</h3>
              <ul className="hours">
                {hours.map((h) => (
                  <li key={h.id}><span>{h.day}</span><span>{h.hours}</span></li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
      <style>{visitCss}</style>
    </section>
  );
}

const visitCss = `
.visit {
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  background: #1a1714;
  color: #faf6ee;
  position: relative;
  overflow: hidden;
}
.visit::before {
  content: "";
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 80% 20%, rgba(138,106,61,0.18), transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 80%, rgba(138,106,61,0.10), transparent 60%);
  pointer-events: none;
}
.visit__inner {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}
.visit__copy p {
  color: #e3d8c4;
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 480px;
  margin: 1.25rem 0 2.5rem;
}
.visit__info {
  display: flex; flex-direction: column; gap: 1px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  overflow: hidden;
}
.info-card {
  background: #1a1714;
  padding: 28px 28px 30px;
  display: flex; flex-direction: column; gap: 14px;
}
.info-card h3 {
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: #948b7e;
}
.info-card p { color: #f4ede1; font-size: 0.95rem; line-height: 1.6; margin: 0; }
.info-card a { color: #f4ede1; transition: color .2s var(--ease-out-soft); }
.info-card a:hover { color: #8a6a3d; }
.info-card__socials { display: flex; gap: 8px; }
.info-card__socials a {
  width: 38px; height: 38px;
  display: grid; place-items: center;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50%;
  color: #f4ede1;
  transition: background .25s var(--ease-out-soft), color .25s var(--ease-out-soft),
              border-color .25s var(--ease-out-soft);
  text-decoration: none;
}
.info-card__socials a:hover { background: #8a6a3d; color: #1a1714; border-color: #8a6a3d; }
.hours { display: flex; flex-direction: column; gap: 10px; list-style: none; padding: 0; margin: 0; }
.hours li {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 13px; color: #e3d8c4;
  border-bottom: 1px dashed rgba(255,255,255,0.10);
  padding-bottom: 10px;
}
.hours li:last-child { border-bottom: 0; padding-bottom: 0; }
.hours li span:first-child { color: #f4ede1; font-weight: 500; }
@media (max-width: 880px) {
  .visit__inner { grid-template-columns: 1fr; }
}
`;
