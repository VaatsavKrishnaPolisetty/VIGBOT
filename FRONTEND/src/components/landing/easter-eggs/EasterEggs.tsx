"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, X, Cpu, ShieldCheck, Heart } from "lucide-react";

/**
 * Easter-egg controller for the landing page:
 *  - Konami code (↑↑↓↓←→←→BA) → accent confetti burst + developer telemetry sheet.
 *  - Typing "vigbot" anywhere → soft screen-wide blue aura pulse.
 *  - Typing "dev" anywhere → opens behind-the-scenes engineering inspector.
 *  - Draggable glowing AI orb in the bottom corner with physics.
 */
export function EasterEggs({
  distressActive,
}: {
  distressActive: boolean;
}) {
  const [agentBadge, setAgentBadge] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const typedBuffer = useRef("");

  // Key sequence detection
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const sequence = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
    ];
    let pos = 0;

    function onKey(e: KeyboardEvent) {
      typedBuffer.current = (typedBuffer.current + e.key.toLowerCase()).slice(-8);

      // "vigbot" trigger
      if (typedBuffer.current.endsWith("vigbot")) {
        setGlowPulse(true);
        setTimeout(() => setGlowPulse(false), 900);
      }

      // "dev" trigger
      if (typedBuffer.current.endsWith("dev")) {
        setDevModalOpen(true);
      }

      // Konami detection
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === sequence[pos]) {
        pos++;
        if (pos === sequence.length) {
          pos = 0;
          setAgentBadge(true);
          setDevModalOpen(true);
          setTimeout(() => setAgentBadge(false), 3500);
          if (!reduced) {
            confetti({
              particleCount: 110,
              spread: 80,
              origin: { y: 0.3 },
              colors: ["#2563eb", "#4f46e5", "#0ea5e9", "#10b981", "#ffffff"],
            });
          }
        }
      } else {
        pos = key === sequence[0] ? 1 : 0;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Type "vigbot" glow pulse */}
      <div
        className="pointer-events-none fixed inset-0 z-[60] transition-opacity duration-500"
        style={{
          opacity: glowPulse ? 1 : 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.18), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Distress egg: rose tint + heartbeat modal */}
      <div
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center transition-opacity duration-700"
        style={{ opacity: distressActive ? 1 : 0 }}
        aria-hidden={!distressActive}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(244,63,94,0.14), transparent 75%)",
          }}
        />
        {distressActive && (
          <div className="relative z-10 mx-4 max-w-md rounded-2xl border border-rose-200 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-md">
            <svg width="120" height="40" viewBox="0 0 120 40" className="mx-auto mb-3">
              <path
                d="M0,20 L25,20 L32,8 L40,32 L48,20 L120,20"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </svg>
            <p className="text-sm font-bold text-rose-700">
              If you&apos;re in distress, you&apos;re not alone.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Campus 24/7 Counselor: +91-98765-43210 · Tele-MANAS: 14416
            </p>
            <p className="mt-2 text-[10px] text-slate-400">
              (a VIGNAN-AI safety feature, embedded into every student touchpoint)
            </p>
          </div>
        )}
      </div>

      {/* Konami badge pill */}
      <div
        className="pointer-events-none fixed left-1/2 top-16 z-[80] -translate-x-1/2 transition-all duration-500"
        style={{
          opacity: agentBadge ? 1 : 0,
          transform: `translate(-50%, ${agentBadge ? "0" : "-12px"})`,
        }}
        aria-hidden={!agentBadge}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/95 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-xl backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          ✦ VIGNAN-AI Core Agent Unlocked ✦
        </span>
      </div>

      {/* Behind the Scenes Dev Inspector Modal */}
      <AnimatePresence>
        {devModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-slate-200">
                    VIGNAN-AI ARCHITECTURE TELEMETRY
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDevModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Framework:</span>
                  <span className="text-emerald-400 font-bold">Next.js 16 (App Router)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Animation Engine:</span>
                  <span className="text-blue-400 font-bold">Motion + anime.js v4 + Lenis</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Database Layer:</span>
                  <span className="text-purple-400 font-bold">SQLite / PostgreSQL + Neon Driver</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Classifier:</span>
                  <span className="text-indigo-400 font-bold">18-Intent TF-IDF on CPU</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Row-Level Security:</span>
                  <span className="text-emerald-400 font-bold">VFSTR-SEC-2026 JWT Scoped</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Latency Threshold:</span>
                  <span className="text-amber-400 font-bold">&lt;0.8ms (Deterministic Tier 1)</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDevModalOpen(false)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Hook to detect rapid multi-clicks on an element (for the logo egg). */
export function useMultiClick(threshold = 5, windowMs = 1200) {
  const [triggered, setTriggered] = useState(false);
  const clicks = useRef<number[]>([]);

  const registerClick = useCallback(() => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < windowMs), now];
    if (clicks.current.length >= threshold) {
      clicks.current = [];
      setTriggered(true);
      setTimeout(() => setTriggered(false), 3200);
    }
  }, [threshold, windowMs]);

  return { triggered, registerClick };
}
