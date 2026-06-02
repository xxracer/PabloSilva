/**
 * Embedded Google Map with a small PS pin badge overlay.
 * The map loads immediately; the PS pin is just a circular brand mark
 * anchored to the map's center, so visitors see the address and the
 * brand at the same time.
 */
"use client";

const EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4110.774841681183!2d-95.47461522395402!3d29.705127034566964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c1d436062ce7%3A0x83139cd884d39239!2sPablo%20Silva%20Brazilian%20Jiu%20Jitsu%20HQ!5e1!3m2!1ses!2sve!4v1780437294581!5m2!1ses!2sve";

export function MapPin() {
  return (
    <div className="psmap">
      <iframe
        title="Pablo Silva BJJ — Bellaire, TX"
        src={EMBED_SRC}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <span className="psmap__pin" aria-hidden="true">
        <img src="/images/logo.png" alt="" />
      </span>
      <style>{psMapCss}</style>
    </div>
  );
}

const psMapCss = `
.psmap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 11;
  border-radius: 14px;
  overflow: hidden;
  background: #1a1714;
  border: 1px solid rgba(255,255,255,0.08);
}
.psmap iframe {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  filter: grayscale(0.4) contrast(0.95) brightness(0.95);
}
.psmap__pin {
  position: absolute;
  top: 50%; left: 50%;
  display: grid; place-items: center;
  width: 56px; height: 56px;
  background: #faf6ee;
  border-radius: 50% 50% 50% 0;
  transform-origin: center bottom;
  transform: translate(-50%, -100%) rotate(-45deg);
  box-shadow: 0 14px 30px rgba(0,0,0,0.45);
  pointer-events: none;
  z-index: 2;
}
.psmap__pin img {
  width: 30px; height: 30px;
  object-fit: contain;
  transform: rotate(45deg);
  filter: invert(1) brightness(0.95) sepia(1) saturate(0.4) hue-rotate(-10deg);
}
`;
