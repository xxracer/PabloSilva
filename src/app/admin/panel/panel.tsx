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
import InstagramFeedEditor from "./editors/instagram-feed";

type Section =
  | "hero" | "marquee" | "philosophy" | "visit" | "contact" | "meta"
  | "programs" | "instructors" | "gallery" | "testimonials" | "faq" | "hours" | "nav"
  | "instagram";

const SECTIONS: { key: Section; label: string; group: "home" | "settings" | "content" }[] = [
  // Home page sections
  { key: "hero",          label: "Hero",             group: "home" },
  { key: "marquee",       label: "Scrolling band",   group: "home" },
  { key: "philosophy",    label: "Philosophy",       group: "home" },
  { key: "instagram",     label: "Instagram feed",   group: "home" },
  { key: "visit",         label: "Visit section",    group: "home" },
  { key: "contact",       label: "Contact form",     group: "home" },
  // Site-wide settings
  { key: "meta",          label: "Site meta & SEO",  group: "settings" },
  { key: "nav",           label: "Navigation menu",  group: "settings" },
  { key: "hours",         label: "Academy hours",    group: "settings" },
  // Lists / content
  { key: "programs",      label: "Programs",         group: "content" },
  { key: "instructors",   label: "Instructors",      group: "content" },
  { key: "gallery",       label: "Gallery",          group: "content" },
  { key: "testimonials",  label: "Testimonials",     group: "content" },
  { key: "faq",           label: "FAQ",              group: "content" },
];

const GROUP_LABELS: Record<string, { title: string; help: string }> = {
  home:     { title: "Home page",     help: "Edit the sections of the home page." },
  settings: { title: "Site settings", help: "Apply across the whole site." },
  content:  { title: "Collections",   help: "Add, remove, and reorder individual entries." },
};

export default function Panel() {
  const [active, setActive] = useState<Section>("hero");
  const current = SECTIONS.find(s => s.key === active)!;

  return (
    <div style={{
      minHeight: "100dvh",
      display: "grid",
      gridTemplateColumns: "280px 1fr",
      background: "#0c0c0b",
      color: "#eee",
    }}>
      <aside style={{
        background: "#0a0a09",
        padding: "1.4rem 1rem",
        borderRight: "1px solid #1c1c1a",
        height: "100dvh",
        position: "sticky", top: 0,
        overflowY: "auto",
      }}>
        <div style={{ marginBottom: "1.6rem" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.15rem", marginBottom: ".15rem" }}>
            Pablo Silva BJJ
          </div>
          <div style={{ opacity: .55, fontSize: ".8rem" }}>Admin panel</div>
        </div>

        {(["home", "settings", "content"] as const).map(group => (
          <div key={group} style={{ marginBottom: "1rem" }}>
            <div style={{
              fontSize: ".68rem",
              textTransform: "uppercase",
              letterSpacing: ".12em",
              opacity: .45,
              margin: "0 .2rem .35rem",
              fontWeight: 600,
            }}>{GROUP_LABELS[group].title}</div>
            {SECTIONS.filter(s => s.group === group).map(s => (
              <NavBtn
                key={s.key}
                active={active === s.key}
                onClick={() => setActive(s.key)}
              >{s.label}</NavBtn>
            ))}
          </div>
        ))}

        <div style={{ marginTop: "1.6rem", borderTop: "1px solid #1c1c1a", paddingTop: "1rem" }}>
          <a href="/" target="_blank" rel="noreferrer" style={linkStyle}>View site →</a>
          <a href="/api/admin/auth?logout=1" style={{ ...linkStyle, color: "#a77070", marginTop: ".6rem" }}>
            Sign out
          </a>
        </div>
      </aside>

      <main style={{ padding: "2.2rem clamp(1rem, 3vw, 2.6rem) 1rem", overflow: "auto", maxHeight: "100dvh" }}>
        {active === "hero"         && <HeroEditor />}
        {active === "marquee"      && <MarqueeEditor />}
        {active === "philosophy"   && <PhilosophyEditor />}
        {active === "instagram"    && <InstagramFeedEditor />}
        {active === "visit"        && <VisitEditor />}
        {active === "contact"      && <ContactEditor />}
        {active === "meta"         && <MetaEditor />}
        {active === "nav"          && <NavEditor />}
        {active === "hours"        && <HoursEditor />}
        {active === "programs"     && <ProgramsEditor />}
        {active === "instructors"  && <InstructorsEditor />}
        {active === "gallery"      && <GalleryEditor />}
        {active === "testimonials" && <TestimonialsEditor />}
        {active === "faq"          && <FAQEditor />}
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
        padding: ".5rem .7rem",
        borderRadius: 8,
        fontSize: ".9rem",
        cursor: "pointer",
        marginBottom: 2,
        fontFamily: "inherit",
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
