"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Bot } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useSmoothScroll } from "@/lib/smooth-scroll";
import { CursorTrail } from "./CursorTrail";
import { CursorSpotlight } from "./CursorSpotlight";
import { ScrollProgress } from "./ScrollProgress";
import { CustomCursor } from "./CustomCursor";
import { BrandIntroSequence } from "./BrandIntroSequence";
import { Marquee } from "./Marquee";
import { Sparkles, ShieldCheck, Zap, HeartHandshake, Cpu, Lock, MessageSquareText, CreditCard, Calendar, GraduationCap } from "lucide-react";
import { HeroSection } from "./HeroSection";
import { ProblemSection } from "./sections/ProblemSection";
import { ThreeTierSection } from "./sections/ThreeTierSection";
import { TenStepFlow } from "./sections/TenStepFlow";
import { SecuritySection } from "./sections/SecuritySection";
import { DistressSection } from "./sections/DistressSection";
import { CapabilitiesSection } from "./sections/CapabilitiesSection";
import { FinalCTA } from "./sections/FinalCTA";
import { EasterEggs, useMultiClick } from "./easter-eggs/EasterEggs";

interface LandingPageProps {
  onGetStarted: () => void;
}

/**
 * VIGBOT cinematic landing page — light theme, scroll-driven storytelling
 * narrative. Animation stack: anime.js v4 (timelines, stagger, scroll-scrub,
 * SVG draw), Motion/Framer (hover, layout, scroll transforms), Lenis (smooth
 * scroll), canvas-confetti (easter eggs). Includes a cursor trail, cursor
 * spotlight, magnetic CTAs, and hidden easter eggs thematically tied to
 * VIGBOT's own features (RLS lock, distress guardrail).
 */
export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  // Native browser scroll handles momentum and reaches the end of the page smoothly
  useSmoothScroll(false);

  // Logo multi-click easter egg (5 rapid clicks → distress egg)
  const { triggered: distressActive, registerClick } = useMultiClick(5, 1200);

  // Always start from the top of the page on load / refresh
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Handle asynchronous layout frames
    const frameId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-white text-foreground selection:bg-blue-100 selection:text-blue-900">
      <BrandIntroSequence />
      <CursorTrail />
      <CustomCursor />
      <ScrollProgress />
      <EasterEggs distressActive={distressActive} />

      {/* Floating navbar — fades in after the hero */}
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "translate-y-0 border-b border-slate-200/80 bg-white/85 backdrop-blur-md"
            : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={registerClick}
            className="flex items-center gap-3 cursor-pointer"
            title="VIGNAN-AI"
            aria-label="VIGNAN-AI"
          >
            <Image
              src="/vignan-logo.png"
              alt="Vignan Foundation"
              width={140}
              height={44}
              className="h-8 w-auto object-contain"
            />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <span className="hidden text-sm font-bold tracking-tight text-foreground sm:block">
              {t.appName || "VIGNAN-AI"}
            </span>
          </button>

          <div className="flex items-center gap-2.5">
            <LanguageSelector />
            <button
              onClick={onGetStarted}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer sm:text-sm"
            >
              <span>{t.signIn || "Sign in"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero wrapped in the cursor spotlight */}
      <CursorSpotlight>
        <HeroSection onGetStarted={onGetStarted} />
      </CursorSpotlight>

      {/* Marquee strip — capability keywords scrolling */}
      <Marquee className="border-y border-slate-200/70 bg-white py-3" speed="normal">
        {["Attendance Recovery", "Exam Eligibility", "Fee Demands", "Timetable", "CGPA Audit", "Policy Citations", "Service Tickets", "Campus Navigation", "Distress Guardrail", "ML Intent Classifier", "PII Redaction", "Row-Level Security"].map((kw) => (
          <span key={kw} className="flex items-center gap-3 text-sm font-semibold text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            {kw}
          </span>
        ))}
      </Marquee>

      {/* Scroll-driven narrative scenes */}
      <ProblemSection />
      <ThreeTierSection />
      <TenStepFlow />
      <SecuritySection />
      <DistressSection />
      <CapabilitiesSection />

      {/* Marquee strip before the CTA */}
      <Marquee className="bg-slate-50 py-3" speed="slow" pauseOnHover>
        {["385 Students Secured", "18 ML Intents", "Sub-ms Tier-1", "0% Data Leakage", "24/7 Crisis Routing", "12 Domain Modules", "RLS Guardrail"].map((kw) => (
          <span key={kw} className="flex items-center gap-3 text-sm font-bold text-transparent" style={{ backgroundImage: "linear-gradient(120deg,#2563eb,#4f46e5)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>
            <Zap className="h-3.5 w-3.5 text-blue-400" />
            {kw}
          </span>
        ))}
      </Marquee>

      <FinalCTA onGetStarted={onGetStarted} />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Bot className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-foreground">
              {t.appName || "VIGNAN-AI"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t.footerLayer ||
              "Autonomous Campus Helpdesk & Grievance Resolution Agent"}
          </p>
          <p className="text-[10px] text-slate-300">
            Tip: try the Konami code ↑↑↓↓←→←→BA
          </p>
        </div>
      </footer>
    </div>
  );
};
