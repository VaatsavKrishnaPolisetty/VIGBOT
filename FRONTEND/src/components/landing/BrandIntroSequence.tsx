"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Shield, Cpu } from "lucide-react";

export function BrandIntroSequence({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Check if user already saw intro this session
    const seen = sessionStorage.getItem("vigbot_intro_seen");
    if (seen) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const t1 = setTimeout(() => setStep(1), 300);
    const t2 = setTimeout(() => setStep(2), 850);
    const t3 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("vigbot_intro_seen", "true");
      onComplete?.();
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setVisible(false);
    sessionStorage.setItem("vigbot_intro_seen", "true");
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white selection:bg-blue-600"
        >
          {/* Animated Radial Lens Flare & Grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute h-96 w-96 rounded-full bg-blue-600/20 blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute h-72 w-72 rounded-full bg-indigo-500/15 blur-[90px] pointer-events-none" />

          {/* Central Monolith Card */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative flex items-center justify-center mb-6"
            >
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-25 blur-xl animate-spin" style={{ animationDuration: "8s" }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
                <Image
                  src="/vignan-logo.png"
                  alt="Vignan Logo"
                  width={64}
                  height={64}
                  className="h-12 w-auto object-contain filter drop-shadow"
                />
              </div>
            </motion.div>

            {/* Title with metallic sheen */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="overflow-hidden"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>VIGNAN</span>
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  AI SYSTEM
                </span>
              </h1>
            </motion.div>

            {/* Precision Telemetry Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="mt-3 flex items-center gap-3 font-mono text-[11px] tracking-wider text-slate-400 uppercase"
            >
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                RLS Guard: ARMED
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-blue-400">
                <Cpu className="h-3 w-3" />
                18 Intents
              </span>
              <span>•</span>
              <span>v2.4 Core</span>
            </motion.div>

            {/* Glowing progress line */}
            <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: step >= 2 ? "100%" : step >= 1 ? "40%" : "0%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-blue-500 via-indigo-400 to-sky-300 shadow-[0_0_12px_#38bdf8]"
              />
            </div>
          </div>

          {/* Quick Skip button */}
          <button
            onClick={handleSkip}
            className="absolute bottom-6 text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-mono cursor-pointer"
          >
            [ESC / Click to Skip]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

