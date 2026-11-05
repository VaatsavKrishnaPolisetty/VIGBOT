"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface StatCounterProps {
  to: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
  className?: string;
}

/**
 * Count-up number that animates from 0 → target when it scrolls into view.
 * Powered by anime.js animating a plain object, rendering to the DOM on each
 * frame. Falls back to the final value instantly on reduced motion.
 */
export function StatCounter({
  to,
  suffix = "",
  prefix = "",
  label,
  decimals = 0,
  className,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || !numRef.current) return;
    if (reduced) {
      numRef.current.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`;
      return;
    }

    const obj = { val: 0 };
    animate(obj, {
      val: to,
      duration: 1800,
      ease: "outExpo",
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
        }
      },
    });
  }, [inView, to, prefix, suffix, decimals, reduced]);

  return (
    <div ref={ref} className={className}>
      <span
        ref={numRef}
        className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl"
      >
        {`${prefix}0${suffix}`}
      </span>
      <span className="mt-1 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
