"use client";

import { useEffect, useRef, useState } from "react";
import { detectEmbed, type EmbedResult } from "@/lib/embeds";

/**
 * Renders the right kind of embed for a given URL.
 * - Image: <img>
 * - Instagram / YouTube / Vimeo: iframe, lazy-loaded on click
 *   (avoids third-party cookies/trackers before interaction)
 */
export function Embed({
  url,
  caption,
  className = "",
  aspect = "16/9",
}: {
  url: string;
  caption?: string | null;
  className?: string;
  aspect?: "16/9" | "4/5" | "1/1" | "9/16" | "4/3";
}) {
  const meta: EmbedResult = detectEmbed(url);
  const [active, setActive] = useState(meta.kind === "image");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (meta.kind !== "image" || !ref.current) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const img = e.target.querySelector("img[data-lazy]");
          if (img && img instanceof HTMLImageElement) {
            (img as HTMLImageElement).src = img.dataset.lazy!;
            img.removeAttribute("data-lazy");
            io.unobserve(e.target);
          }
        }
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [meta.kind]);

  if (meta.kind === "image") {
    return (
      <figure ref={ref} className={`embed embed--image ${className}`} style={{ aspectRatio: aspect }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-lazy={meta.src} alt={caption ?? ""} loading="lazy" />
        {caption ? <figcaption>{caption}</figcaption> : null}
        <style>{imageCss}</style>
      </figure>
    );
  }

  if (meta.kind === "unknown") {
    return (
      <div className={`embed embed--unknown ${className}`} style={{ aspectRatio: aspect }}>
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      </div>
    );
  }

  return (
    <figure className={`embed embed--${meta.kind} ${className}`} style={{ aspectRatio: aspect }}>
      {active ? (
        <iframe
          src={meta.src}
          title={meta.title}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button type="button" onClick={() => setActive(true)} className="embed__placeholder" aria-label={`Load ${meta.title}`}>
          <span className="embed__play" aria-hidden="true">▶</span>
          <span className="embed__cta">Load {meta.kind === "instagram" ? "Instagram post" : meta.kind === "youtube" ? "YouTube video" : "Vimeo video"}</span>
        </button>
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
      <style>{embedCss}</style>
    </figure>
  );
}

const imageCss = `
.embed--image { margin: 0; position: relative; overflow: hidden; border-radius: 12px; background: #2a2521; }
.embed--image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.embed--image figcaption {
  position: absolute; bottom: 12px; left: 12px; right: 12px;
  font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
  color: #faf6ee; background: rgba(26,23,20,0.55);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  padding: 6px 10px; border-radius: 999px; text-align: center; margin: 0;
}
`;

const embedCss = `
.embed { margin: 0; position: relative; overflow: hidden; border-radius: 12px; background: #1a1714; }
.embed iframe { width: 100%; height: 100%; border: 0; display: block; }
.embed figcaption {
  position: absolute; bottom: 12px; left: 12px; right: 12px;
  font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
  color: #faf6ee; background: rgba(26,23,20,0.55);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  padding: 6px 10px; border-radius: 999px; text-align: center; margin: 0;
  z-index: 1;
}
.embed__placeholder {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px;
  background:
    radial-gradient(ellipse 60% 50% at 50% 50%, rgba(138,106,61,0.18), transparent 70%),
    #1a1714;
  color: #faf6ee;
  border: 0; cursor: pointer;
  font-family: inherit;
  transition: background .25s var(--ease-out-soft, ease);
}
.embed__placeholder:hover { background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(138,106,61,0.28), transparent 70%), #1a1714; }
.embed__play {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: #faf6ee;
  color: #1a1714;
  display: grid; place-items: center;
  font-size: 18px; padding-left: 4px;
  transition: transform .25s ease, background .25s ease;
}
.embed__placeholder:hover .embed__play { transform: scale(1.05); background: #8a6a3d; color: #faf6ee; }
.embed__cta {
  font-size: 12px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  color: #e3d8c4;
}
`;
