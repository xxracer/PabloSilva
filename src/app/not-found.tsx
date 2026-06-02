import Link from "next/link";

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="notfound__inner">
        <span className="eyebrow">— 404</span>
        <h1 className="display">Page <em>not</em> found.</h1>
        <p className="lead">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s
          get you back to the mat.
        </p>
        <Link href="/" className="btn btn--primary">
          <span>Back to home</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
      <style>{`
        .notfound {
          min-height: 100dvh;
          padding: 180px clamp(1.25rem, 4vw, 3rem) 80px;
          background: #1a1714;
          color: #faf6ee;
          display: flex; align-items: center;
        }
        .notfound__inner { max-width: 1280px; margin: 0 auto; }
        .notfound .display { color: #faf6ee; }
        .notfound .display em { color: #8a6a3d; }
        .notfound .lead { color: #f4ede1; opacity: 0.85; max-width: 460px; margin: 1.5rem 0 2.5rem; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #948b7e; margin-bottom: 1.4rem;
        }
        .eyebrow::before { content: ""; display: inline-block; width: 24px; height: 1px; background: currentColor; opacity: 0.6; }
        .display {
          font-family: var(--font-display); font-weight: 400;
          font-size: clamp(2.5rem, 6.5vw, 5.5rem);
          line-height: 0.98; letter-spacing: -0.02em;
          color: #1a1714; font-variation-settings: "opsz" 144, "SOFT" 50;
          margin: 0;
        }
        .display em { font-style: italic; font-weight: 300; color: #6f542f; font-variation-settings: "opsz" 144, "SOFT" 100; }
        .lead {
          font-family: var(--font-display); font-weight: 300;
          font-size: clamp(1.2rem, 1.8vw, 1.45rem);
          line-height: 1.45; letter-spacing: -0.005em;
          font-variation-settings: "opsz" 36;
        }
        .btn--primary {
          background: #faf6ee; color: #1a1714;
          padding: 14px 22px; border-radius: 999px;
          font-size: 14px; font-weight: 500; display: inline-flex;
          align-items: center; gap: 10px; text-decoration: none;
          transition: background .25s var(--ease-out-soft), color .25s var(--ease-out-soft);
        }
        .btn--primary:hover { background: #8a6a3d; color: #faf6ee; }
      `}</style>
    </section>
  );
}
