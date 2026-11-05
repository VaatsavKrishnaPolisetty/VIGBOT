"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Accent color for the tinted shadow and border glow */
  accent?: "blue" | "emerald" | "indigo" | "violet" | "rose" | "amber";
  /** Max tilt in degrees */
  tilt?: number;
  /** Show the animated conic-gradient border ring */
  animatedBorder?: boolean;
}

const accentShadow: Record<string, string> = {
  blue: "rgba(37,99,235,0.15)",
  emerald: "rgba(16,185,129,0.15)",
  indigo: "rgba(79,70,229,0.15)",
  violet: "rgba(139,92,246,0.15)",
  rose: "rgba(244,63,94,0.15)",
  amber: "rgba(245,158,11,0.15)",
};

const accentRing: Record<string, string> = {
  blue: "#3b82f6,#60a5fa,#818cf8,#3b82f6",
  emerald: "#10b981,#34d399,#6ee7b7,#10b981",
  indigo: "#6366f1,#818cf8,#a5b4fc,#6366f1",
  violet: "#8b5cf6,#a78bfa,#c4b5fd,#8b5cf6",
  rose: "#f43f5e,#fb7185,#fda4af,#f43f5e",
  amber: "#f59e0b,#fbbf24,#fcd34d,#f59e0b",
};

/**
 * The maximalist workhorse: a frosted-glass card with 3D tilt, cursor-tracked
 * specular glare, an animated rotating conic-gradient border ring, and a
 * colored drop shadow tinted to the accent. Falls back to a flat card under
 * reduced motion or on touch devices.
 */
export function GlassCard({
  children,
  className,
  accent = "blue",
  tilt = 8,
  animatedBorder = true,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 200, damping: 18 });
  const sy = useSpring(my, { stiffness: 200, damping: 18 });

  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt]);
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  if (reduced) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        boxShadow: `0 20px 50px -12px ${accentShadow[accent]}, 0 8px 20px -6px rgba(0,0,0,0.06)`,
      }}
      className={cn(
        "group relative rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl",
        className
      )}
    >
      {/* Animated conic-gradient border ring */}
      {animatedBorder && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            padding: "1.5px",
            background: `conic-gradient(from var(--card-angle, 0deg), ${accentRing[accent]})`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: "cardBorderSpin 4s linear infinite",
          }}
        />
      )}
      <style>{`@keyframes cardBorderSpin { to { --card-angle: 360deg; } }`}</style>

      {/* Specular glare */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) =>
              `radial-gradient(300px circle at ${gx} ${gy}, rgba(255,255,255,0.5), transparent 60%)`
          ),
        }}
        aria-hidden="true"
      />

      {/* Inner top-edge highlight (light hitting glass) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      <div style={{ transform: "translateZ(40px)" }} className="relative">
        {children}
      </div>
    </motion.div>
  );
}
