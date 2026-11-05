"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { animate, createScope } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Richer replacement for AuroraBackground: a hue-shifting animated mesh
 * gradient with multiple drifting blobs, a cursor-reactive dot grid, film
 * grain, and a vignette. The hue subtly shifts with scroll progress so the
 * page feels like it moves through different "times of day."
 */
export function MeshGradient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll();
  // Shift hue 0 → 40deg across the full page scroll
  const hue = useTransform(scrollYProgress, [0, 1], [0, 40]);

  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const scope = createScope({ root: rootRef }).add(() => {
      animate(".mesh-blob-a", {
        translateX: [0, 80, -30, 0],
        translateY: [0, -50, 40, 0],
        scale: [1, 1.2, 0.9, 1],
        duration: 24000,
        loop: true,
        ease: "inOutQuad",
      });
      animate(".mesh-blob-b", {
        translateX: [0, -60, 40, 0],
        translateY: [0, 45, -30, 0],
        scale: [1, 0.85, 1.15, 1],
        duration: 30000,
        loop: true,
        ease: "inOutQuad",
      });
      animate(".mesh-blob-c", {
        translateX: [0, 40, -50, 0],
        translateY: [0, -30, 35, 0],
        duration: 20000,
        loop: true,
        ease: "inOutSine",
      });
    });
    return () => scope.revert();
  }, [reduced]);

  return (
    <motion.div
      ref={rootRef}
      style={{ filter: reduced ? undefined : useTransform(hue, (h) => `hue-rotate(${h}deg)`) }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Layered mesh blobs */}
      <div
        className="mesh-blob-a absolute -top-40 left-1/4 h-[44rem] w-[44rem] rounded-full opacity-50 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.30), transparent 65%)" }}
      />
      <div
        className="mesh-blob-b absolute top-1/3 -right-40 h-[40rem] w-[40rem] rounded-full opacity-45 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.28), transparent 65%)" }}
      />
      <div
        className="mesh-blob-c absolute bottom-0 left-1/3 h-[34rem] w-[34rem] rounded-full opacity-35 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.20), transparent 65%)" }}
      />

      {/* Refined dot grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 35%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 35%, transparent 90%)",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(15,23,42,0.05) 100%)" }}
      />
    </motion.div>
  );
}
