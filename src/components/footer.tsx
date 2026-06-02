import Link from "next/link";
import Image from "next/image";
import type { MetaData } from "@/lib/types";
import { getNavLinks } from "@/lib/queries";

export function Footer({ meta }: { meta?: MetaData }) {
  const m = meta ?? {
    title: "Pablo Silva BJJ", description: "", ogImage: "",
    instagram: "https://instagram.com/pablosilvabjjhq", youtube: "", footerCredit: "© Pablo Silva BJJ · Bellaire, Texas",
  };
  const links = getNavLinks();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Image src="/images/logo.png" alt="Pablo Silva BJJ" width={48} height={48} />
          <p>
            {m.description || "A modern Brazilian Jiu-Jitsu academy in the heart of Bellaire, Texas."}
          </p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h4>Visit</h4>
          {links.map((l) => (
            <Link key={l.id} href={l.href}>{l.label}</Link>
          ))}
          <Link href="/contact">Book a trial</Link>
        </nav>

        <nav className="footer__col" aria-label="Legal">
          <h4>Academy</h4>
          {m.instagram && (
            <a href={m.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          )}
          {m.youtube && (
            <a href={m.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
          )}
          <Link href="mailto:pablosilvabjj@gmail.com">Email us</Link>
        </nav>
      </div>

      <div className="footer__bar">
        <span>{m.footerCredit}</span>
        <span>Made on the mat.</span>
      </div>

      <style>{footerCss}</style>
    </footer>
  );
}

const footerCss = `
.footer {
  background: #1a1714;
  color: #e3d8c4;
}
.footer__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px clamp(1.25rem, 4vw, 3rem) 48px;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 48px;
}
.footer__brand img {
  width: 48px; height: 48px;
  object-fit: contain;
  filter: invert(1) brightness(0.95) sepia(1) saturate(0.4) hue-rotate(-10deg);
  margin-bottom: 16px;
  opacity: 0.85;
}
.footer__brand p { max-width: 320px; font-size: 0.95rem; line-height: 1.6; color: #948b7e; }
.footer__col { display: flex; flex-direction: column; gap: 12px; }
.footer__col h4 {
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: #948b7e; margin-bottom: 8px;
}
.footer__col a {
  font-size: 14px; color: #f4ede1;
  transition: color .2s var(--ease-out-soft);
  text-decoration: none;
}
.footer__col a:hover { color: #8a6a3d; }
.footer__bar {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px clamp(1.25rem, 4vw, 3rem);
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex; justify-content: space-between; gap: 16px;
  font-size: 12px; color: #948b7e; letter-spacing: 0.02em;
}
@media (max-width: 720px) {
  .footer__inner { grid-template-columns: 1fr; gap: 32px; }
  .footer__bar { flex-direction: column; gap: 6px; }
}
`;
