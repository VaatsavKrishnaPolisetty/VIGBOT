"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { animate, createScope, stagger } from "animejs";
import { Sparkles, ShieldCheck, ArrowRight, Zap, HeartHandshake, ChevronRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MeshGradient } from "./MeshGradient";
import { ParticleConstellation } from "./ParticleConstellation";
import { MagneticButton } from "./MagneticButton";
import { StatCounter } from "./StatCounter";
import { InteractiveLivePreview } from "./InteractiveLivePreview";

interface HeroSectionProps {
  onGetStarted: () => void;
}

/**
 * The complex, layered hero.
 * 7 conceptual layers: aurora bg · dot grid · grain · cursor spotlight
 * (mounted by parent) · staggered headline · count-up stats · floating
 * glass preview with idle float · magnetic CTAs · shimmer pills · scroll
 * cue · click ripples. On scroll-out the whole block parallax-scales
 * (Kombai "Page Scrub" handoff).
 */
export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  // Parallax scale-out on scroll (Kombai page-scrub handoff)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Shimmer pills + scroll-cue entrance
  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const scope = createScope({ root: sectionRef }).add(() => {
      // Headline words — blur-to-focus rise from a clipping mask
      animate(".hero-word-inner", {
        translateY: ["110%", "0%"],
        opacity: [0, 1],
        filter: ["blur(8px)", "blur(0px)"],
        duration: 750,
        delay: stagger(70, { start: 250 }),
        ease: "outExpo",
      });
      // Subheading slides up after the headline
      animate(".hero-sub", {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 600,
        delay: 850,
        ease: "outExpo",
      });
      // Pills, CTAs, stats & preview card fade in last
      animate(".hero-pill", {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: stagger(80, { start: 1150 }),
        duration: 500,
        ease: "outExpo",
      });
      animate(".hero-scroll-cue", {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 600,
        delay: 1700,
        ease: "outExpo",
      });
    });
    return () => scope.revert();
  }, [reduced]);

  // Click ripple on the background grid
  function handleBgClick(e: React.MouseEvent) {
    if (reduced || !rippleRef.current) return;
    const el = rippleRef.current;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dot = document.createElement("span");
    dot.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:8px;height:8px;border-radius:9999px;background:rgba(59,130,246,0.4);pointer-events:none;transform:translate(-50%,-50%);`;
    el.appendChild(dot);
    animate(dot, {
      scale: [1, 18],
      opacity: [0.5, 0],
      duration: 800,
      ease: "outExpo",
      onComplete: () => dot.remove(),
    });
  }

  return (
    <section
      ref={sectionRef}
      onClick={handleBgClick}
      className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-28 pb-16 sm:pt-32"
    >
      <MeshGradient />
      <ParticleConstellation particleCount={60} connectionDistance={125} />
      {/* Shimmer + glow keyframes */}
      <style>{`
        @keyframes textShimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes badgeGlow { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0.0)} 50%{box-shadow:0 0 18px 2px rgba(59,130,246,0.18)} }
        @keyframes badgeGlowEmerald { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.0)} 50%{box-shadow:0 0 18px 2px rgba(16,185,129,0.18)} }
        .shimmer-text { background-size:200% auto; animation: textShimmer 4s linear infinite; }
        .glow-blue { animation: badgeGlow 3s ease-in-out infinite; }
        .glow-emerald { animation: badgeGlowEmerald 3.5s ease-in-out infinite; }
      `}</style>
      {/* Ripple layer */}
      <div ref={rippleRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <motion.div
        style={reduced ? undefined : { scale: heroScale, opacity: heroOpacity, y: heroY }}
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]"
      >
        {/* Left column */}
        <div className="max-w-2xl">
          {/* Eyebrow badges & System Telemetry */}
          <div className="mb-6 flex flex-wrap items-center gap-2.5">
            <span className="hero-pill glow-blue inline-flex items-center gap-1.5 rounded-full border border-blue-200/90 bg-blue-50/90 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-xs backdrop-blur-xs" style={{ opacity: 0 }}>
              <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-spin" style={{ animationDuration: "6s" }} />
              VIGNAN-AI Core
            </span>
            <span className="hero-pill glow-emerald inline-flex items-center gap-1.5 rounded-full border border-emerald-200/90 bg-emerald-50/90 px-3.5 py-1 text-xs font-semibold text-emerald-700 shadow-xs backdrop-blur-xs" style={{ opacity: 0 }}>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Row-Level Security Active
            </span>
            <span className="hero-pill hidden sm:inline-flex items-center font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1" style={{ opacity: 0 }}>
              // R23 CLAUSE 4.2
            </span>
          </div>

          {/* Headline — oversized maximalist typography */}
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] leading-[1.06] drop-shadow-xs">
            <span className="hero-headline-wrap block overflow-hidden">
              {"The AI helpdesk that actually knows".split(" ").map((w, i) => (
                <span key={i} className="hero-word inline-block overflow-hidden align-bottom mr-[0.22em]">
                  <span className="hero-word-inner inline-block will-change-transform" style={{ opacity: 0 }}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pt-1">
              <span className="hero-word inline-block overflow-hidden align-bottom">
                <span
                  className="hero-word-inner shimmer-text inline-block will-change-transform bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent filter drop-shadow-[0_2px_14px_rgba(37,99,235,0.22)]"
                  style={{ opacity: 0 }}
                >
                  your record.
                </span>
              </span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="hero-sub mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl" style={{ opacity: 0 }}>
            Ask about attendance, exams, fees, or policies in plain language.
            VIGBOT pulls the real record and answers instantly — no forms, no
            tickets, no waiting on email.
          </p>

          {/* CTAs */}
          <div className="hero-pill mt-8 flex flex-wrap items-center gap-3" style={{ opacity: 0 }}>
            <MagneticButton onClick={onGetStarted} variant="primary" strength={0.16}>
              Sign in to your dashboard
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              onClick={() =>
                document.getElementById("three-tier")?.scrollIntoView({ behavior: "smooth" })
              }
              variant="secondary"
              strength={0.12}
            >
              See what it can do
              <ChevronRight className="h-4 w-4" />
            </MagneticButton>
          </div>

          {/* Stat counters */}
          <div className="hero-pill mt-10 flex flex-wrap items-center gap-x-10 gap-y-4" style={{ opacity: 0 }}>
            <StatCounter to={385} label="Students secured" />
            <StatCounter to={18} label="ML intents classified" />
            <StatCounter to={1} suffix="ms" prefix="<" label="Tier-1 response" />
          </div>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted-foreground">
            <span className="hero-pill flex items-center gap-1.5" style={{ opacity: 0 }}>
              <Zap className="h-4 w-4 text-blue-500" />
              12 Domain Modules
            </span>
            <span className="hero-pill flex items-center gap-1.5" style={{ opacity: 0 }}>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Verified per-student access
            </span>
            <span className="hero-pill flex items-center gap-1.5" style={{ opacity: 0 }}>
              <HeartHandshake className="h-4 w-4 text-rose-500" />
              Distress-aware support
            </span>
          </div>
        </div>

        {/* Right column — floating glass preview */}
        <div className="hero-pill relative mt-4 lg:mt-0" style={{ opacity: 0 }}>
          <InteractiveLivePreview onExploreMore={onGetStarted} />
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="hero-scroll-cue pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2" style={{ opacity: 0 }}>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
            Scroll
          </span>
          <span className="relative flex h-7 w-4 justify-center rounded-full border border-slate-300">
            <motion.span
              className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500"
              animate={reduced ? undefined : { y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={reduced ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
