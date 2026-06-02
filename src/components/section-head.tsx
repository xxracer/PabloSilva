import type { ReactNode } from "react";

export function SectionHead({
  number,
  title,
  italic,
  sub,
  children,
}: {
  number: string;
  title: ReactNode;
  italic: ReactNode;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <header className="section-head">
      <span className="eyebrow">— {number}</span>
      <h2 className="display">
        {title}
        {italic ? <><br /><em>{italic}</em></> : null}
      </h2>
      {sub ? <p className="section-head__sub">{sub}</p> : null}
      {children}
      <style>{sectionHeadCss}</style>
    </header>
  );
}

const sectionHeadCss = `
.section-head {
  max-width: 1280px;
  margin: 0 auto clamp(2.5rem, 5vw, 4.5rem);
}
.section-head .display { max-width: 12ch; }
.section-head__sub {
  max-width: 460px;
  margin-top: 1.5rem;
  color: #6a6258;
  font-size: 1.05rem;
  line-height: 1.65;
}
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
`;
