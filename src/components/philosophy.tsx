import type { PhilosophyData } from "@/lib/types";

const DEFAULT_VALUES = [
  { n: "01", label: "Confidence" },
  { n: "02", label: "Self-Defense" },
  { n: "03", label: "Discipline" },
  { n: "04", label: "Respect" },
];

export function Philosophy({ data }: { data?: PhilosophyData }) {
  const p = data ?? {
    eyebrow: "01 Philosophy",
    title: "A quiet art,",
    italic: "practiced seriously.",
    body: [],
    image: "",
  };
  const values = p.body.length >= 4 && (p.body[0] as unknown as { values?: unknown[] })?.values
    ? (p.body as unknown as { values: { n: string; label: string }[] }).values
    : DEFAULT_VALUES;
  return (
    <section className="philosophy" id="philosophy">
      <div className="philosophy__grid">
        <div className="philosophy__label">
          <span className="eyebrow">— {p.eyebrow}</span>
          <h2 className="display">
            {p.title}<br />
            <em>{p.italic}</em>
          </h2>
        </div>

        <div className="philosophy__body">
          {p.body.map((para, i) => (
            <p key={i} className={i === 0 ? "lead" : ""} dangerouslySetInnerHTML={{ __html: para }} />
          ))}

          <ul className="values">
            {values.map((v) => (
              <li key={v.n}>
                <span>{v.n}</span>
                {v.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>{philosophyCss}</style>
    </section>
  );
}

const philosophyCss = `
.philosophy {
  padding: clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem);
  background: #f4ede1;
}
.philosophy__grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: clamp(2rem, 6vw, 6rem);
  align-items: start;
}
.philosophy__label { position: sticky; top: 110px; }
.philosophy__body { max-width: 540px; }
.lead {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.2rem, 1.8vw, 1.45rem);
  line-height: 1.45;
  color: #1a1714;
  letter-spacing: -0.005em;
  font-variation-settings: "opsz" 36;
  margin-bottom: 1.25rem;
}
.philosophy__body p { color: #1a1714; margin-bottom: 1.25rem; font-size: 1.0625rem; line-height: 1.7; }
.philosophy__body strong { font-weight: 500; }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6a6258;
  margin-bottom: 1.4rem;
}
.eyebrow::before {
  content: "";
  display: inline-block;
  width: 24px; height: 1px;
  background: currentColor;
  opacity: 0.6;
}
.display {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.5rem, 6.5vw, 5.5rem);
  line-height: 0.98;
  letter-spacing: -0.02em;
  color: #1a1714;
  font-variation-settings: "opsz" 144, "SOFT" 50;
  margin: 0;
}
.display em {
  font-style: italic;
  font-weight: 300;
  color: #6f542f;
  font-variation-settings: "opsz" 144, "SOFT" 100;
}

.values {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  margin: 2.5rem 0 0;
  background: rgba(26,23,20,0.12);
  border-top: 1px solid rgba(26,23,20,0.12);
  border-bottom: 1px solid rgba(26,23,20,0.12);
  list-style: none;
  padding: 0;
}
.values li {
  background: #f4ede1;
  padding: 22px 4px;
  display: flex; align-items: baseline; gap: 14px;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: -0.01em;
}
.values li span {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  color: #6a6258;
}
@media (max-width: 880px) {
  .philosophy__grid { grid-template-columns: 1fr; }
  .philosophy__label { position: static; }
}
`;
