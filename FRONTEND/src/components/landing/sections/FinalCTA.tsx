"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { animate, createScope, stagger } from "animejs";
import confetti from "canvas-confetti";
import { ArrowRight, Bot } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "../MagneticButton";
import { ScrambleText } from "../ScrambleText";
import { ParticleConstellation } from "../ParticleConstellation";

/**
 * Scene 9 — the closing shot. Mirrors the hero's aurora on a light canvas,
 * the wordmark reappears closing the visual loop, and a celebratory confetti
 * burst fires when the CTA is clicked. Light theme.
 */
export function FinalCTA({ onGetStarted }: { onGetStarted: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const blobScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.1]);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const scope = createScope({ root: ref }).add(() => {
      animate(".cta-line", {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(120, { start: 200 }),
        duration: 700,
        ease: "outExpo",
      });
    });
    return () => scope.revert();
  }, [reduced]);

  function handleCTA() {
    if (!reduced) {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.7 },
        colors: ["#2563eb", "#4f46e5", "#0ea5e9", "#ffffff"],
        scalar: 0.7,
      });
    }
    setTimeout(onGetStarted, reduced ? 0 : 500);
  }

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50/40 py-28 text-center"
    >
      <ParticleConstellation particleCount={35} connectionDistance={95} />
      {/* Lighter aurora blobs on the light canvas */}
      <motion.div
        style={{ scale: reduced ? undefined : blobScale }}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/4 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-blue-400/15 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[30rem] w-[30rem] translate-x-1/2 rounded-full bg-indigo-400/15 blur-[120px]" />
      </motion.div>

      {/* Dot grid for visual continuity with the hero */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Wordmark loop */}
        <div className="cta-line mb-8 flex items-center justify-center gap-2.5" style={{ opacity: 0 }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
            <Bot className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-foreground">VIGNAN-AI</span>
        </div>

        <h2 className="cta-line text-3xl font-bold tracking-tight text-foreground sm:text-5xl" style={{ opacity: 0 }}>
          Your record is already connected.
          <br className="hidden sm:block" />{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            <ScrambleText text="Go ask it something." />
          </span>
        </h2>

        <p className="cta-line mt-6 text-base text-muted-foreground sm:text-lg" style={{ opacity: 0 }}>
          Sign in with your university roll number to talk to VIGBOT.
        </p>

        <div className="cta-line mt-10 flex justify-center" style={{ opacity: 0 }}>
          <MagneticButton onClick={handleCTA} variant="primary" strength={0.16}>
            Sign in to VIGNAN-AI
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
