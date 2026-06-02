"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NavItem = { href: string; label: string };

export function Nav({ links }: { links: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`} id="nav">
        <div className="nav__inner">
          <Link href="/" className="nav__brand" aria-label="Pablo Silva BJJ — home">
            <span className="nav__mark" aria-hidden="true">PS</span>
            <span className="nav__name">
              <span className="nav__name-line">Pablo Silva</span>
              <span className="nav__name-sub">Brazilian Jiu-Jitsu</span>
            </span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>

          <Link href="/contact" className="nav__cta">
            <span>Book a trial</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>

          <button
            className={`nav__menu ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
      </header>

      {open ? (
        <div className="nav__drawer is-open" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="nav__drawer-inner">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/contact" className="nav__drawer-cta" onClick={() => setOpen(false)}>
              <span>Book a trial</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      ) : null}

      <style>{navCss}</style>
    </>
  );
}

const navCss = `
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 18px clamp(1.25rem, 4vw, 3rem);
  background: rgba(26, 23, 20, 0.55);
  backdrop-filter: saturate(140%) blur(14px);
  -webkit-backdrop-filter: saturate(140%) blur(14px);
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  transition: background .3s var(--ease-out-soft), padding .3s var(--ease-out-soft);
}
.nav.is-scrolled {
  background: rgba(26, 23, 20, 0.82);
  padding-top: 12px;
  padding-bottom: 12px;
}
.nav * {
  border-top: 0 !important;
  border-bottom: 0 !important;
  box-shadow: none !important;
}

.nav__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: 0 !important;
  outline: 0 !important;
}
.nav__brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }
.nav__mark {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #faf6ee;
  color: #1a1714;
  display: grid; place-items: center;
  font-family: var(--font-display);
  font-weight: 500; font-size: 14px;
  letter-spacing: 0.04em;
  border: 0 !important;
  outline: 0 !important;
}
.nav__name { display: flex; flex-direction: column; line-height: 1.1; }
.nav__name-line {
  font-family: var(--font-display);
  font-weight: 500; font-size: 15px;
  letter-spacing: -0.005em;
  color: #faf6ee;
}
.nav__name-sub {
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: rgba(244,237,225,0.6);
  margin-top: 2px;
}

.nav__links { display: flex; align-items: center; gap: 30px; }
.nav__links a {
  position: relative;
  font-size: 14px; font-weight: 500;
  color: #faf6ee;
  padding: 6px 0;
  text-decoration: none;
  transition: color .2s var(--ease-out-soft);
}
.nav__links a::after {
  content: ""; position: absolute;
  left: 0; right: 100%; bottom: 0;
  height: 1px; background: #8a6a3d;
  transition: right .3s var(--ease-out-soft);
}
.nav__links a:hover { color: #8a6a3d; }
.nav__links a:hover::after { right: 0; }

.nav__cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  background: #faf6ee;
  color: #1a1714;
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  border: 0 !important;
  transition: background .25s var(--ease-out-soft), color .25s var(--ease-out-soft),
              transform .25s var(--ease-out-soft);
}
.nav__cta:hover { background: #8a6a3d; color: #1a1714; transform: translateY(-1px); }
.nav__cta svg { transition: transform .25s var(--ease-out-soft); }
.nav__cta:hover svg { transform: translateX(2px); }

.nav__menu {
  display: none;
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.18) !important;
  position: relative;
  background: transparent;
  cursor: pointer;
}
.nav__menu span {
  position: absolute;
  left: 12px; right: 12px; height: 1.5px;
  background: #faf6ee;
  transition: transform .3s var(--ease-out-soft), top .3s var(--ease-out-soft);
}
.nav__menu span:nth-child(1) { top: 16px; }
.nav__menu span:nth-child(2) { top: 22px; }
.nav__menu.is-open span:nth-child(1) { top: 19px; transform: rotate(45deg); }
.nav__menu.is-open span:nth-child(2) { top: 19px; transform: rotate(-45deg); }

@media (max-width: 880px) {
  .nav__links, .nav__cta { display: none; }
  .nav__menu { display: block; }
}

.nav__drawer {
  position: fixed;
  inset: 0;
  z-index: 99;
  background: #1a1714;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  overflow-y: auto;
  animation: drawerIn .35s var(--ease-out-soft);
}
.nav__drawer-inner {
  padding: 100px clamp(1.5rem, 5vw, 3rem) 60px;
  display: flex; flex-direction: column; gap: 4px;
  max-width: 1280px; margin: 0 auto;
}
.nav__drawer a {
  padding: 18px 4px;
  font-family: var(--font-display);
  font-size: 36px; font-weight: 400;
  color: #faf6ee;
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: space-between;
}
.nav__drawer a:hover { color: #8a6a3d; }
.nav__drawer-cta {
  margin-top: 32px;
  border-radius: 999px;
  background: #faf6ee;
  color: #1a1714 !important;
  border: 0 !important;
  padding: 16px 24px;
  font-family: var(--font-sans) !important;
  font-size: 14px; font-weight: 500;
  width: fit-content;
  gap: 10px;
}
.nav__drawer-cta:hover { background: #8a6a3d; color: #faf6ee !important; }

@keyframes drawerIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.skip-link {
  position: fixed; top: -100px; left: 16px;
  background: #1a1714; color: #faf6ee;
  padding: 10px 14px; border-radius: 6px;
  z-index: 1000; transition: top .2s var(--ease-out-soft);
  text-decoration: none;
}
.skip-link:focus { top: 16px; }
`;
