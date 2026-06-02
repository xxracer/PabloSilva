import type { Testimonial } from "@/lib/types";

export function Quotes({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="quotes">
      <div className="quotes__head">
        <span className="eyebrow">— 04 The community</span>
        <h2 className="display">
          <em>Words</em> from<br />the mat.
        </h2>
      </div>

      <div className="quotes__grid">
        {items.map((q, i) => (
          <figure key={q.id} className={`quote${i % 2 ? " quote--alt" : ""}`}>
            <blockquote>{q.quote}</blockquote>
            <figcaption>
              <span className="quote__name">{q.name}</span>
              {q.role && <span className="quote__role">{q.role}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      <style>{quotesCss}</style>
    </section>
  );
}

const quotesCss = `
.quotes {
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  background: #f4ede1;
}
.quotes__head { max-width: 1280px; margin: 0 auto clamp(2.5rem, 5vw, 4.5rem); }
.quotes__head .display { max-width: 10ch; }
.quotes__grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(26,23,20,0.12);
  border-top: 1px solid rgba(26,23,20,0.12);
  border-bottom: 1px solid rgba(26,23,20,0.12);
}
.quote {
  background: #f4ede1;
  padding: clamp(2rem, 4vw, 3.25rem);
  display: flex; flex-direction: column;
  justify-content: space-between;
  gap: 2.5rem;
  min-height: 320px;
  margin: 0;
}
.quote--alt { background: #ebe2d1; }
.quote blockquote {
  font-family: var(--font-display);
  font-weight: 300;
  font-style: italic;
  font-size: clamp(1.25rem, 1.8vw, 1.55rem);
  line-height: 1.4;
  color: #1a1714;
  letter-spacing: -0.005em;
  font-variation-settings: "opsz" 36, "SOFT" 100;
  position: relative;
  padding-top: 1.5rem;
  margin: 0;
}
.quote blockquote::before {
  content: "\\201C";
  position: absolute;
  top: -0.4em; left: -0.15em;
  font-size: 3em; line-height: 1;
  color: #8a6a3d;
  font-family: var(--font-display);
  font-style: italic;
}
.quote figcaption {
  display: flex; flex-direction: column; gap: 2px;
  font-size: 13px;
}
.quote__name { font-weight: 500; color: #1a1714; }
.quote__role { color: #6a6258; font-size: 12px; letter-spacing: 0.04em; }
@media (max-width: 760px) {
  .quotes__grid { grid-template-columns: 1fr; }
}
`;
