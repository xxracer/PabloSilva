import type { Metadata } from "next";
import { VisitForm } from "@/components/visit-form";
import { MapPin } from "@/components/map-pin";
import { getFAQ, getHours, getMeta, getVisit } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Visit — Pablo Silva BJJ",
  description: "Schedule a visit to Pablo Silva BJJ in Bellaire, Texas.",
};

export default function ContactPage() {
  const faq = getFAQ();
  const hours = getHours();
  const meta = getMeta();
  const visit = getVisit();

  const tel = "+1 (346) 303-9572";
  const telHref = "tel:+13463039572";
  const email = "pablosilvabjj@gmail.com";
  return (
    <>
      <section className="page-hero page-hero--short">
        <div className="page-hero__inner">
          <span className="eyebrow">— Visit</span>
          <h1 className="display">
            Come <em>train</em><br />
            with us.
          </h1>
          <p className="lead">
            Your first class is on us. Fill in the form, or just walk in ten
            minutes before any of our open mat sessions.
          </p>
        </div>
      </section>

      <section className="contact">
        <div className="contact__grid">
          <div className="contact__form">
            <h2 className="contact__form-title">Request a trial</h2>
            <p className="contact__form-sub">
              We&apos;ll reach out within a day to confirm a time that works.
            </p>
            <VisitForm />
          </div>

          <aside className="contact__info">
            <div className="info-card">
              <h3>Academy</h3>
              <p>{visit.address}</p>
              <a
                className="link-arrow"
                href={visit.mapUrl}
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
                <a href={telHref}>{tel}</a><br />
                <a href={`mailto:${email}`}>{email}</a>
              </p>
              {meta.instagram && (
                <div className="info-card__socials">
                  <a href={meta.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                    </svg>
                  </a>
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
      </section>

      {faq.length > 0 && (
        <section className="faq">
          <div className="faq__inner">
            <header className="faq__head">
              <span className="eyebrow">— FAQ</span>
              <h2 className="display">Common questions.</h2>
            </header>
            <ul className="faq__list">
              {faq.map((f) => (
                <li key={f.id}>
                  <h3>{f.question}</h3>
                  <p>{f.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <style>{contactCss}</style>
    </>
  );
}

const contactCss = `
.page-hero {
  padding: 180px clamp(1.25rem, 4vw, 3rem) 80px;
  background: #1a1714; color: #faf6ee;
  position: relative; overflow: hidden;
}
.page-hero--short { padding-bottom: 60px; }
.page-hero::before {
  content: ""; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 80% 20%, rgba(138,106,61,0.18), transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 80%, rgba(138,106,61,0.10), transparent 60%);
  pointer-events: none;
}
.page-hero__inner { max-width: 1280px; margin: 0 auto; position: relative; }
.page-hero .display { color: #faf6ee; max-width: 14ch; }
.page-hero .display em { color: #8a6a3d; }
.page-hero .lead { color: #f4ede1; opacity: 0.85; max-width: 560px; margin-top: 1.5rem; }

.eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #6a6258; margin-bottom: 1.4rem;
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

.contact {
  padding: clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 3rem) clamp(5rem, 11vw, 9rem);
  background: #1a1714;
  color: #faf6ee;
}
.contact__grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}
.contact__form-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  line-height: 1.1; letter-spacing: -0.015em;
  color: #faf6ee;
  margin: 0 0 0.5rem;
}
.contact__form-sub {
  color: #e3d8c4;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem;
}
.contact__info {
  display: flex; flex-direction: column; gap: 1px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  overflow: hidden;
}
.info-card {
  background: #1a1714;
  padding: 28px;
  display: flex; flex-direction: column; gap: 14px;
}
.info-card h3 {
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: #948b7e; margin: 0;
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
.link-arrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.02em; color: #f4ede1;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  padding-bottom: 4px;
  transition: gap .25s var(--ease-out-soft), color .25s var(--ease-out-soft),
              border-color .25s var(--ease-out-soft);
  text-decoration: none;
}
.link-arrow:hover { gap: 14px; color: #8a6a3d; border-color: #8a6a3d; }

.faq { padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem); background: #f4ede1; }
.faq__inner { max-width: 1280px; margin: 0 auto; }
.faq__head { margin-bottom: clamp(2rem, 4vw, 3rem); }
.faq__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; }
.faq__list li {
  padding: 28px 0;
  border-top: 1px solid rgba(26,23,20,0.10);
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 24px;
  align-items: baseline;
}
.faq__list li:last-child { border-bottom: 1px solid rgba(26,23,20,0.10); }
.faq__list h3 {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.25rem, 2vw, 1.65rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #1a1714;
  margin: 0;
}
.faq__list p {
  color: #6a6258;
  font-size: 1rem;
  line-height: 1.65;
  margin: 0;
}
@media (max-width: 880px) {
  .contact__grid { grid-template-columns: 1fr; }
  .faq__list li { grid-template-columns: 1fr; gap: 8px; }
}
`;
