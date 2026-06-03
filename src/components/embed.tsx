"use client";

import { detectEmbed, type EmbedResult } from "@/lib/embeds";

/**
 * Renders the right kind of embed for a given URL.
 * - Image: <img>
 * - Instagram / YouTube / Vimeo: iframe, loaded immediately
 *   (the browser's own `loading="lazy"` waits for viewport)
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

  if (meta.kind === "image") {
    return (
      <figure className={`embed embed--image ${className}`} style={{ aspectRatio: aspect }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={meta.src} alt={caption ?? ""} loading="lazy" />
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
      <iframe
        src={meta.src}
        title={meta.title}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
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
`;
