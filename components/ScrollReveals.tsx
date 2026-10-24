"use client";

import { useEffect } from "react";

export function ScrollReveals() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || typeof IntersectionObserver === "undefined") return;

    const sections = document.querySelectorAll<HTMLElement>("[data-scroll-reveal]");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          entry.target.dataset.scrollReveal = "visible";
        }
      }
    }, { rootMargin: "0px 0px -80px 0px", threshold: 0 });

    // Reset beyond the viewport so the moving content cannot retrigger itself.
    const resetObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting && entry.target instanceof HTMLElement) {
          entry.target.dataset.scrollReveal = "pending";
        }
      }
    }, { rootMargin: "80px 0px", threshold: 0 });

    for (const section of sections) {
      section.dataset.scrollReveal = "pending";
      observer.observe(section);
      resetObserver.observe(section);
    }

    const stopMotion = () => {
      if (!motion.matches) return;
      observer.disconnect();
      resetObserver.disconnect();
      sections.forEach((section) => { section.dataset.scrollReveal = ""; });
    };
    motion.addEventListener("change", stopMotion);

    return () => {
      observer.disconnect();
      resetObserver.disconnect();
      motion.removeEventListener("change", stopMotion);
      sections.forEach((section) => { section.dataset.scrollReveal = ""; });
    };
  }, []);

  return null;
}
