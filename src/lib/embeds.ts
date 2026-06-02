/**
 * Detect the kind of URL and return the right embed.
 * Supports:
 *   - Instagram post / reel  -> embed via instagram.com embed endpoint
 *   - YouTube (watch, youtu.be, shorts) -> nocookie iframe
 *   - Vimeo                 -> player.vimeo.com iframe
 *   - Direct image          -> pass through
 *   - Anything else         -> pass through as image
 */

export type EmbedKind = "image" | "instagram" | "youtube" | "vimeo" | "unknown";

export type EmbedResult = {
  kind: EmbedKind;
  /** Iframe-safe src, or the original URL for image kind */
  src: string;
  /** Human-readable title for accessibility */
  title: string;
};

const RE_INSTA = /instagram\.com\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i;
const RE_YT_WATCH = /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/i;
const RE_YT_SHORT = /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i;
const RE_YT_SHORTLINK = /youtu\.be\/([A-Za-z0-9_-]{6,})/i;
const RE_VIMEO = /vimeo\.com\/(\d{6,})/i;

const IMG_EXT = /\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$/i;

export function detectEmbed(url: string): EmbedResult {
  const u = url.trim();

  let m = u.match(RE_INSTA);
  if (m) {
    return {
      kind: "instagram",
      src: `https://www.instagram.com/p/${m[2]}/embed`,
      title: "Instagram post",
    };
  }
  m = u.match(RE_YT_WATCH) ?? u.match(RE_YT_SHORT) ?? u.match(RE_YT_SHORTLINK);
  if (m) {
    return {
      kind: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${m[1]}?modestbranding=1&rel=0`,
      title: "YouTube video",
    };
  }
  m = u.match(RE_VIMEO);
  if (m) {
    return {
      kind: "vimeo",
      src: `https://player.vimeo.com/video/${m[1]}?dnt=1&title=0&byline=0&portrait=0`,
      title: "Vimeo video",
    };
  }
  if (IMG_EXT.test(u) || u.startsWith("/")) {
    return { kind: "image", src: u, title: "" };
  }
  return { kind: "unknown", src: u, title: "" };
}

/** Heuristic: is this URL an embeddable external post (IG/YT/Vimeo)? */
export function isExternalEmbed(url: string): boolean {
  const k = detectEmbed(url).kind;
  return k === "instagram" || k === "youtube" || k === "vimeo";
}
