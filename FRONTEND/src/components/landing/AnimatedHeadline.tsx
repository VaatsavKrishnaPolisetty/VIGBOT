"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, createScope, stagger, createTimeline } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimatedHeadlineProps {
  /** Render the headline words here. Each direct word child becomes a
   *  staggered reveal target. */
  children: ReactNode;
  className?: string;
  /** ms between each word */
  wordDelay?: number;
  /** ms per word duration */
  wordDuration?: number;
}

/**
 * Split-text headline reveal powered by an anime.js timeline.
 * Each word is wrapped in an overflow-hidden span; the inner text rises from
 * below with a blur-to-focus, staggered left-to-right. Respects reduced
 * motion (words appear instantly).
 */
export function AnimatedHeadline({
  children,
  className,
  wordDelay = 70,
  wordDuration = 700,
}: AnimatedHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;

    const scope = createScope({ root: ref }).add(() => {
      const tl = createTimeline({ defaults: { ease: "outExpo" } });
      tl.add(".ah-eyebrow", {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 500,
      })
        .add(
          ".ah-word-inner",
          {
            translateY: ["110%", "0%"],
            opacity: [0, 1],
            filter: ["blur(8px)", "blur(0px)"],
            duration: wordDuration,
            delay: stagger(wordDelay),
          },
          "-=200"
        )
        .add(
          ".ah-sub",
          {
            opacity: [0, 1],
            translateY: [16, 0],
            duration: 600,
          },
          "-=300"
        );
    });

    return () => scope.revert();
  }, [reduced, wordDelay, wordDuration]);

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}

/** A single word that rises from below a clipping mask. */
export function HeadlineWord({ children }: { children: ReactNode }) {
  return (
    <span className="ah-word inline-block overflow-hidden align-bottom">
      <span
        className="ah-word-inner inline-block will-change-transform"
        style={{ opacity: 0 }}
      >
        {children}
      </span>
    </span>
  );
}

/** Convenience wrapper for the eyebrow + sub elements so they pick up
 *  the timeline classes without the caller managing class names. */
export function HeadlineEyebrow({ children }: { children: ReactNode }) {
  return <span className="ah-eyebrow inline-block" style={{ opacity: 0 }}>{children}</span>;
}

export function HeadlineSub({ children }: { children: ReactNode }) {
  return <span className="ah-sub inline-block" style={{ opacity: 0 }}>{children}</span>;
}
