import { useEffect } from "react";

const REVEALED_CLASS = "is-revealed";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Minimal IntersectionObserver island: finds `[data-reveal]` nodes and toggles
 * `.is-revealed` when they enter the viewport. No-ops (instant reveal) when the
 * user prefers reduced motion.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (nodes.length === 0) return;

    const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (prefersReduced) {
      for (const el of nodes) {
        el.classList.add(REVEALED_CLASS);
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add(REVEALED_CLASS);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    for (const el of nodes) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
