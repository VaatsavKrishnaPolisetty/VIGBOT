"use client";

import { useEffect, useRef } from "react";
import { animate, utils } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** delay before the scramble starts (ms) */
  delay?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

/**
 * A heading that scrambles/decodes character-by-character when it enters the
 * viewport (anime.js v4 scrambleText-style). Reads as high-tech and
 * cinematic. Falls back to plain text on reduced motion.
 */
export function ScrambleText({ text, className, delay = 0 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) {
      if (ref.current) ref.current.textContent = text;
      return;
    }

    const el = ref.current;
    let frame = 0;
    let raf = 0;
    const totalFrames = 32;
    const startedAt = performance.now() + delay;

    function scramble(now: number) {
      if (now < startedAt) {
        raf = requestAnimationFrame(scramble);
        return;
      }
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / (totalFrames * 16), 1);
      const revealCount = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealCount) {
          out += text[i];
        } else if (text[i] === " ") {
          out += " ";
        } else {
          out += CHARS[Math.floor(utils.random(0, CHARS.length))];
        }
      }
      el.textContent = out;
      if (progress < 1) {
        raf = requestAnimationFrame(scramble);
      } else {
        el.textContent = text;
      }
    }

    // Trigger on intersection
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          raf = requestAnimationFrame(scramble);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (el.parentElement) io.observe(el.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [text, reduced, delay]);

  return (
    <span ref={ref} className={className}>
      {reduced ? text : ""}
    </span>
  );
}
