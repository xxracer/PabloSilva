export function Marquee({ items }: { items: string[] }) {
  const values = items.length ? items : ["Confidence", "Self-Defense", "Discipline", "Respect"];
  const slots = Array.from({ length: 12 });
  return (
    <section className="marquee" aria-label="Academy values">
      <div className="marquee__track">
        {slots.map((_, i) => (
          <span key={i}>
            {values[i % values.length]}
            <span className="marquee__sep"> · </span>
          </span>
        ))}
        {slots.map((_, i) => (
          <span key={`b-${i}`} aria-hidden="true">
            {values[i % values.length]}
            <span className="marquee__sep"> · </span>
          </span>
        ))}
      </div>
      <style>{marqueeCss}</style>
    </section>
  );
}

const marqueeCss = `
.marquee {
  background: #ebe2d1;
  padding: 22px 0;
  overflow: hidden;
}
.marquee__track {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(1.5rem, 2.4vw, 2.2rem);
  letter-spacing: -0.01em;
  color: #1a1714;
  animation: marquee 40s linear infinite;
  font-variation-settings: "opsz" 144, "SOFT" 100;
  gap: 36px;
  padding-left: 36px;
}
.marquee__sep { color: #8a6a3d; font-style: normal; }
`;
