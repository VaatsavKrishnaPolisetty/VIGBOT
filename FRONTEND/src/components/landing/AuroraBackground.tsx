"use client";

import { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Animated aurora mesh gradient for the hero.
 * Two soft radial blobs drift in slow orbits over a light canvas, plus a
 * subtle dot-grid and a film-grain noise overlay. Purely ambient — never
 * demands attention but makes the hero feel alive.
 */
export function AuroraBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !rootRef.current) return;

    const scope = createScope({ root: rootRef }).add(() => {
      // Blob A — slow diagonal drift, looped
      animate(".aurora-blob-a", {
        translateX: [0, 60, -20, 0],
        translateY: [0, -40, 30, 0],
        scale: [1, 1.15, 0.95, 1],
        duration: 22000,
        loop: true,
        ease: "inOutQuad",
      });

      // Blob B — counter-orbit, different cadence so they never sync
      animate(".aurora-blob-b", {
        translateX: [0, -50, 30, 0],
        translateY: [0, 35, -25, 0],
        scale: [1, 0.9, 1.1, 1],
        duration: 28000,
        loop: true,
        ease: "inOutQuad",
      });
    });

    return () => scope.revert();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Soft aurora blobs */}
      <div
        className="aurora-blob-a absolute -top-32 left-1/4 h-[42rem] w-[42rem] rounded-full opacity-[0.5] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.28), rgba(59,130,246,0) 65%)",
        }}
      />
      <div
        className="aurora-blob-b absolute top-1/3 -right-32 h-[38rem] w-[38rem] rounded-full opacity-[0.45] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.26), rgba(168,85,247,0) 65%)",
        }}
      />
      {/* A third warm accent for depth */}
      <div
        className="absolute bottom-0 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-[0.3] blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.18), rgba(14,165,233,0) 65%)",
        }}
      />

      {/* Dot grid — refined, parallaxable */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 90%)",
        }}
      />

      {/* Film-grain noise overlay for premium texture */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
