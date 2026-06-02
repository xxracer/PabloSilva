"use client";

import { useState } from "react";
import HeroEditor from "./editors/hero";
import MarqueeEditor from "./editors/marquee";
import PhilosophyEditor from "./editors/philosophy";
import VisitEditor from "./editors/visit";
import ContactEditor from "./editors/contact";
import MetaEditor from "./editors/meta";
import ProgramsEditor from "./editors/programs";
import InstructorsEditor from "./editors/instructors";
import GalleryEditor from "./editors/gallery";
import TestimonialsEditor from "./editors/testimonials";
import FAQEditor from "./editors/faq";
import HoursEditor from "./editors/hours";
import NavEditor from "./editors/nav";

type Section =
  | "hero" | "marquee" | "philosophy" | "visit" | "contact" | "meta"
  | "programs" | "instructors" | "gallery" | "testimonials" | "faq" | "hours" | "nav";

const SECTIONS: { key: Section; label: string; group: "content" | "lists" }[] = [
  { key: "hero", label: "Hero", group: "content" },
  { key: "marquee", label: "Marquee", group: "content" },
  { key: "philosophy", label: "Philosophy", group: "content" },
  { key: "visit", label: "Visit", group: "content" },
  { key: "contact", label: "Contact", group: "content" },
  { key: "meta", label: "Site Meta", group: "content" },
  { key: "nav", label: "Nav Links", group: "lists" },
  { key: "programs", label: "Programs", group: "lists" },
  { key: "instructors", label: "Instructors", group: "lists" },
  { key: "gallery", label: "Gallery", group: "lists" },
  { key: "testimonials", label: "Testimonials", group: "lists" },
  { key: "faq", label: "FAQ", group: "lists" },
  { key: "hours", label: "Hours", group: "lists" },
];

export default function Panel() {
  const [active, setActive] = useState<Section>("hero");

  return (
    <div style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "260px 1fr", background: "#0c0c0b", color: "#eee" }}>
      <aside style={{ background: "#0a0a09", padding: "1.4rem 1rem", borderRight: "1px solid #1c1c1a" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.15rem", marginBottom: ".25rem" }}>Pablo Silva BJJ</div>
        <div style={{ opacity: .55, fontSize: ".8rem", marginBottom: "1.4rem" }}>Admin Panel</div>

        <div style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".12em", opacity: .45, margin: "0 .2rem .5rem" }}>Content</div>
        {SECTIONS.filter(s => s.group === "content").map(s => (
          <NavBtn key={s.key} active={active === s.key} onClick={() => setActive(s.key)}>{s.label}</NavBtn>
        ))}

        <div style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".12em", opacity: .45, margin: "1.2rem .2rem .5rem" }}>Collections</div>
        {SECTIONS.filter(s => s.group === "lists").map(s => (
          <NavBtn key={s.key} active={active === s.key} onClick={() => setActive(s.key)}>{s.label}</NavBtn>
        ))}

        <div style={{ marginTop: "2rem", borderTop: "1px solid #1c1c1a", paddingTop: "1rem" }}>
          <a href="/" target="_blank" rel="noreferrer" style={linkStyle}>View site →</a>
          <a href="/api/admin/auth?logout=1" style={{ ...linkStyle, color: "#a77070", marginTop: ".6rem", display: "block" }}>Sign out</a>
        </div>
      </aside>

      <main style={{ padding: "2rem clamp(1rem, 3vw, 2.4rem)", overflow: "auto" }}>
        {active === "hero" && <HeroEditor />}
        {active === "marquee" && <MarqueeEditor />}
        {active === "philosophy" && <PhilosophyEditor />}
        {active === "visit" && <VisitEditor />}
        {active === "contact" && <ContactEditor />}
        {active === "meta" && <MetaEditor />}
        {active === "nav" && <NavEditor />}
        {active === "programs" && <ProgramsEditor />}
        {active === "instructors" && <InstructorsEditor />}
        {active === "gallery" && <GalleryEditor />}
        {active === "testimonials" && <TestimonialsEditor />}
        {active === "faq" && <FAQEditor />}
        {active === "hours" && <HoursEditor />}
      </main>
    </div>
  );
}

function NavBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: active ? "#1a1916" : "transparent",
        color: active ? "#f4ede0" : "#cdc7b8",
        border: 0,
        padding: ".55rem .7rem",
        borderRadius: 8,
        fontSize: ".92rem",
        cursor: "pointer",
        marginBottom: 2,
      }}
    >
      {children}
    </button>
  );
}

const linkStyle: React.CSSProperties = {
  display: "block",
  fontSize: ".85rem",
  color: "#cdc7b8",
  textDecoration: "none",
  opacity: .8,
};
