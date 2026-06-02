"use client";

import { useEffect } from "react";

/**
 * Adds the .reveal class to common targets on mount, then observes them
 * with IntersectionObserver to add .is-in when they enter the viewport.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const targets = [
      ".reveal-target", // opt-in via class
      ".hero__eyebrow", ".hero__title", ".hero__lede", ".hero__actions", ".hero__stats",
      ".marquee",
      ".philosophy__label", ".philosophy__body",
      ".section-head", ".card", ".values li",
      ".instructor__media", ".instructor__body",
      ".quotes__head", ".quote",
      ".gallery .section-head", ".gallery__cell",
      ".visit__copy", ".visit__info",
      ".footer__inner", ".footer__bar",
    ];

    document.querySelectorAll<HTMLElement>(targets.join(",")).forEach((el, i) => {
      if (!el.classList.contains("reveal")) el.classList.add("reveal");
      if (i < 4 && el.closest(".hero")) {
        const k = i; // staggered in hero
        el.classList.add(`reveal--d-${k}`);
      }
    });

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-40px 0px -80px 0px", threshold: 0.05 }
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
