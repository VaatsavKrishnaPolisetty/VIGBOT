"use client";

import { useEffect, useRef } from "react";

/**
 * A subtle dotted cursor trail that follows the pointer across the landing
 * page (inspired by Skiper UI's image cursor trail). Renders a small canvas
 * that draws fading dots behind the cursor. Disabled on touch / reduced
 * motion. Very lightweight — only paints while the mouse moves.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c: CanvasRenderingContext2D = ctx;
    const cv: HTMLCanvasElement = canvas;

    let w = (cv.width = window.innerWidth);
    let h = (cv.height = window.innerHeight);

    const dots: Array<{ x: number; y: number; life: number }> = [];
    let mouseX = -100;
    let mouseY = -100;
    let lastX = -100;
    let lastY = -100;
    let raf = 0;
    let active = false;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      active = true;
    }
    function onLeave() {
      active = false;
    }
    function onResize() {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
    }

    function render() {
      c.clearRect(0, 0, w, h);

      // Spawn a dot when moving
      if (active && (mouseX !== lastX || mouseY !== lastY)) {
        dots.push({ x: mouseX, y: mouseY, life: 1 });
        lastX = mouseX;
        lastY = mouseY;
      }

      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.life -= 0.025;
        if (d.life <= 0) {
          dots.splice(i, 1);
          continue;
        }
        c.beginPath();
        c.arc(d.x, d.y, 3 * d.life, 0, Math.PI * 2);
        c.fillStyle = `rgba(59,130,246,${d.life * 0.35})`;
        c.fill();
      }

      raf = requestAnimationFrame(render);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40 hidden md:block"
      aria-hidden="true"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}
