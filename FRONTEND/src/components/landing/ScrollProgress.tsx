"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Cpu, Zap } from "lucide-react";

/**
 * Top slim multi-stop gradient progress bar
 * and top Dynamic Island telemetry HUD.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  const [showHud, setShowHud] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowHud(window.scrollY > 180);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (reduced) return null;

  return (
    <>
      {/* Top progress bar with glowing tip */}
      <motion.div
        className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500"
        style={{ scaleX }}
        aria-hidden="true"
      />

      {/* Floating Dynamic Island Telemetry HUD (Center Top) */}
      <motion.div
        initial={false}
        animate={{
          y: showHud ? 0 : -50,
          opacity: showHud ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed top-4 left-1/2 z-[52] -translate-x-1/2 hidden md:flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/85 px-4 py-1.5 shadow-lg shadow-slate-900/5 backdrop-blur-md"
      >
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>RLS ACTIVE</span>
        </div>
        <div className="h-3 w-px bg-slate-200" />
        <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-blue-700">
          <Cpu className="h-3 w-3" />
          <span>18 INTENTS</span>
        </div>
        <div className="h-3 w-px bg-slate-200" />
        <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-600">
          <Zap className="h-3 w-3 text-amber-500" />
          <span>&lt;0.8MS</span>
        </div>
      </motion.div>
    </>
  );
}
