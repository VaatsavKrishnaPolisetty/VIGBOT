"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** pause animation on hover */
  pauseOnHover?: boolean;
  speed?: "slow" | "normal" | "fast";
}

const speedMap = { slow: "50s", normal: "30s", fast: "18s" };

/**
 * A continuous marquee strip (Skiper UI-style) that pauses on hover. Used
 * between sections to add a premium, dense rhythm. Renders the children
 * twice for a seamless loop. Disabled (static) on reduced motion.
 */
export function Marquee({
  children,
  className,
  pauseOnHover = true,
  speed = "normal",
}: MarqueeProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={cn("flex gap-8 px-4 py-3", className)}>{children}</div>;
  }

  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <div
        className="flex shrink-0 items-center gap-8 pr-8 [animation:marqueeScroll_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: speedMap[speed] }}
      >
        {children}
      </div>
      <div
        className="flex shrink-0 items-center gap-8 pr-8 [animation:marqueeScroll_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: speedMap[speed] }}
        aria-hidden="true"
      >
        {children}
      </div>
      <style>{`@keyframes marqueeScroll { to { transform: translateX(-100%); } }`}</style>
    </div>
  );
}
