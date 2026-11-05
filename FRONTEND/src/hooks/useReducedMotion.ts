"use client";

import { useEffect, useState } from "react";

/**
 * Central reduced-motion guard.
 * Returns true when the user has requested reduced motion at the OS level.
 * Every animated component must check this and fall back to instant/simple
 * appearances so the page stays usable and accessible.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
