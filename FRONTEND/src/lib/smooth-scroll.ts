"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll controller.
 * Disabled by default to prevent Lenis scroll-limit clamping
 * that blocks users from reaching the bottom of dynamic pages.
 * When enabled, uses ResizeObserver to ensure the scroll limit
 * updates continuously with page height.
 */
export function useSmoothScroll(enabled: boolean = false) {
  useEffect(() => {
    if (!enabled) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      autoResize: true,
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    // Keep Lenis limit updated with dynamic height changes
    const ro = new ResizeObserver(() => {
      lenis.resize();
    });
    ro.observe(document.body);
    ro.observe(document.documentElement);

    window.addEventListener("resize", () => lenis.resize());

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      lenis.destroy();
    };
  }, [enabled]);
}
