"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "motion/react";

/**
 * A cursor-following radial spotlight that subtly brightens content near
 * the pointer (Kombai "Spotlight Reveal" technique). Renders a fixed overlay
 * whose radial-gradient center tracks the mouse with spring smoothing.
 * No-ops on touch / coarse pointers.
 */
export function CursorSpotlight({ children }: { children?: ReactNode }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 180, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 28, mass: 0.4 });

  const overlay = useMotionTemplate`radial-gradient(380px circle at ${sx}px ${sy}px, rgba(59,130,246,0.10), rgba(59,130,246,0.04) 35%, transparent 70%)`;

  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    x.set(e.clientX);
    y.set(e.clientY);
  }

  return (
    <div ref={ref} onMouseMove={onMove} className="relative">
      {/* Spotlight overlay sits above content but ignores pointer events */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 hidden md:block"
        style={{ background: overlay }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
