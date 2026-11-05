"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * A custom cursor: a soft ring that follows the pointer with spring
 * lag and scales up when hovering interactive elements (links, buttons,
 * [data-cursor="hover"]). No-ops on touch and reduced motion. The native
 * cursor is hidden on desktop fine pointers only.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let hovered = false;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      hovered = !!target.closest("a, button, [data-cursor='hover'], input, [role='button']");
    }

    function loop() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ring) {
        const scale = hovered ? 1.8 : 1;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${scale})`;
        ring.style.borderColor = hovered ? "rgba(59,130,246,0.7)" : "rgba(100,116,139,0.35)";
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);

    // Hide native cursor on fine pointers
    document.body.style.cursor = "none";
    const interactive = document.querySelectorAll("a, button, input, [role='button']");
    interactive.forEach((el) => ((el as HTMLElement).style.cursor = "none"));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.style.cursor = "";
      interactive.forEach((el) => ((el as HTMLElement).style.cursor = ""));
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-blue-600"
        style={{ transition: "opacity 0.2s" }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border-2 transition-[border-color,transform] duration-200"
        style={{ transition: "border-color 0.2s" }}
        aria-hidden="true"
      />
    </>
  );
}
