"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { animate, createDrawable } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "./Reveal";
import { ScrambleText } from "../ScrambleText";
import { Heart, Phone, LifeBuoy } from "lucide-react";

/**
 * Scene 6 — the emotional beat:
 * The background warms with a rose tint, the SVG heartbeat draws,
 * and double-clicking or clicking the heartbeat accelerates its rhythm.
 */
export function DistressSection() {
  const ref = useRef<HTMLDivElement>(null);
  const beatRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-30%" });

  const [bpm, setBpm] = useState(72);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const warmth = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.16, 0]);

  const triggerBeatAnimation = (duration = 1400) => {
    if (!beatRef.current || reduced) return;
    const [drawable] = createDrawable(beatRef.current);
    animate(drawable, {
      draw: ["0 0", "0 1", "1 1"],
      duration,
      ease: "inOut(3)",
    });
  };

  useEffect(() => {
    if (!inView || reduced) return;
    const timer = setTimeout(() => triggerBeatAnimation(1400), 300);
    return () => clearTimeout(timer);
  }, [inView, reduced]);

  const handleHeartbeatClick = () => {
    // Accelerate heartbeat temporarily as an interactive tactile response
    setBpm((prev) => (prev >= 120 ? 72 : prev + 24));
    triggerBeatAnimation(650);
  };

  const handleCopy = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <section
      id="distress"
      ref={ref}
      className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-white py-28"
    >
      {/* Warming rose tint tied to scroll */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={
          reduced
            ? undefined
            : {
                background:
                  "radial-gradient(ellipse 65% 55% at 50% 45%, rgba(244,63,94,0.11), transparent 70%)",
                opacity: warmth,
              }
        }
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-rose-600">
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            Distress-Aware by Design
          </div>
        </Reveal>

        {/* Interactive Heartbeat SVG */}
        <div
          onClick={handleHeartbeatClick}
          className="group relative mx-auto mt-8 cursor-pointer select-none transition-transform hover:scale-105 active:scale-95"
          title="Click to accelerate pulse"
        >
          <svg viewBox="0 0 300 60" className="mx-auto h-20 w-auto filter drop-shadow-[0_2px_10px_rgba(244,63,94,0.3)]" fill="none">
            <path
              ref={beatRef}
              d="M0,30 H80 L95,10 L110,50 L125,5 L140,55 L155,30 H300"
              stroke="#f43f5e"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-mono text-[10px] font-semibold text-rose-400 group-hover:text-rose-600 transition-colors uppercase tracking-widest">
            [PULSE RATE: {bpm} BPM // TAP TO INTERACT]
          </span>
        </div>

        <Reveal delay={0.3}>
          <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            If a student is in crisis,
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 bg-clip-text text-transparent">
              <ScrambleText text="everything stops." />
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.45}>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Before any academic answer, VIGNAN-AI listens for distress signals, hopelessness,
            or self-harm keywords. The academic engine immediately halts, alerting verified campus
            authorities and presenting 24/7 counselors.
          </p>
        </Reveal>

        <Reveal delay={0.6}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleCopy("+91-98765-43210")}
              className="flex items-center gap-2 rounded-full border border-rose-200/90 bg-rose-50/90 px-4 py-2.5 text-rose-700 shadow-xs hover:bg-rose-100 transition cursor-pointer"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Campus Counselor: +91-98765-43210</span>
              {copiedNumber === "+91-98765-43210" && (
                <span className="font-mono text-[10px] text-emerald-600 font-bold">COPIED</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleCopy("14416")}
              className="flex items-center gap-2 rounded-full border border-rose-200/90 bg-rose-50/90 px-4 py-2.5 text-rose-700 shadow-xs hover:bg-rose-100 transition cursor-pointer"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              <span>Tele-MANAS: 14416 (24/7 Free)</span>
              {copiedNumber === "14416" && (
                <span className="font-mono text-[10px] text-emerald-600 font-bold">COPIED</span>
              )}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
