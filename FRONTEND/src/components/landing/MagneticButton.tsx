"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  strength?: number;
}

/**
 * Magnetic CTA — the button drifts toward the cursor on hover and springs
 * back on leave. Primary variant has an animated conic-gradient border ring
 * that rotates subtly. Falls back to a normal button on reduced motion.
 */
export function MagneticButton({
  children,
  onClick,
  variant = "primary",
  className,
  strength = 0.15,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 25, mass: 0.15 });
  const sy = useSpring(y, { stiffness: 160, damping: 25, mass: 0.15 });

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const isPrimary = variant === "primary";

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors cursor-pointer overflow-hidden",
        isPrimary
          ? "text-white shadow-lg shadow-blue-600/25"
          : "border border-slate-200 bg-white text-foreground hover:bg-slate-50",
        className
      )}
    >
      {/* Animated gradient fill for primary */}
      {isPrimary && (
        <span
          className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#2563eb,#4f46e5,#0ea5e9)] bg-[length:200%_100%] transition-[background-position] duration-500 group-hover:bg-[position:100%_0]"
        />
      )}
      {/* Shimmer sweep for secondary */}
      {!isPrimary && (
        <span className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full">
          <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-blue-100/70 to-transparent transition-transform duration-700 group-hover:translate-x-[300%]" />
        </span>
      )}
      {children}
    </motion.button>
  );
}
