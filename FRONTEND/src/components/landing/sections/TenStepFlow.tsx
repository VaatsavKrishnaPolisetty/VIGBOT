"use client";

import { useRef, useState } from "react";
import {
  ShieldAlert,
  Lock,
  RotateCcw,
  GraduationCap,
  BookOpen,
  UserCheck,
  Compass,
  Cpu,
  Database,
  Ticket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const steps = [
  { n: "01", title: "Distress Check", desc: "Every message is scanned for crisis first. Safety always wins.", tag: "Safety Tier", icon: ShieldAlert, color: "text-rose-500 bg-rose-50 border-rose-200" },
  { n: "02", title: "Privacy Guardrail", desc: "Prompt injection and cross-student access attempts are rejected.", tag: "RLS Security", icon: Lock, color: "text-emerald-500 bg-emerald-50 border-emerald-200" },
  { n: "03", title: "Learned Remediations", desc: "Feedback fixes from past thumbs-downs intercept known mismatches.", tag: "Self-Correction", icon: RotateCcw, color: "text-blue-500 bg-blue-50 border-blue-200" },
  { n: "04", title: "Exam Eligibility", desc: "Attendance recovery math and condonation brackets, computed live.", tag: "R23 Audit", icon: GraduationCap, color: "text-amber-500 bg-amber-50 border-amber-200" },
  { n: "05", title: "Academic Tutoring", desc: "Concept explanations for technical and engineering questions.", tag: "Curriculum", icon: BookOpen, color: "text-indigo-500 bg-indigo-50 border-indigo-200" },
  { n: "06", title: "Human Handover", desc: "Escalation to the Dean or grievance cell on explicit request.", tag: "Grievance", icon: UserCheck, color: "text-purple-500 bg-purple-50 border-purple-200" },
  { n: "07", title: "Universal Dispatch", desc: "Navigation, status lookups, and 27 application capabilities.", tag: "Campus Hub", icon: Compass, color: "text-teal-500 bg-teal-50 border-teal-200" },
  { n: "08", title: "ML Intent Classifier", desc: "The 18-intent TF-IDF model routes the query to a handler.", tag: "On-Device ML", icon: Cpu, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { n: "09", title: "Fast Record Lookup", desc: "Simple read-only queries skip the classifier entirely.", tag: "Sub-ms DB", icon: Database, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { n: "10", title: "Service Actions", desc: "Transactional requests become tracked tickets with SLA dates.", tag: "Autonomous SLA", icon: Ticket, color: "text-violet-600 bg-violet-50 border-violet-200" },
];

/**
 * Scene 4 — Natural Horizontal Carousel for the 10-step flow.
 * Does NOT force vertical scroll-hijacking. Users scroll down the page naturally;
 * if they want to explore the 10 steps, they can scroll right or use the nav buttons.
 */
export function TenStepFlow() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const offset = direction === "left" ? -400 : 400;
    trackRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section
      id="how-it-works"
      className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 py-24 sm:py-28 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
                Deterministic Pipeline
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                // 10-STAGE VALIDATION
              </span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Ten steps from question to answer
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl">
              VIGNAN-AI processes each inquiry through a safety-first, 10-stage deterministic pipeline.
              Swipe or use arrows to inspect each stage.
            </p>
          </div>

          {/* Carousel Arrow Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
              Scroll to explore →
            </span>
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              aria-label="Previous step"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              aria-label="Next step"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Free-scrolling horizontal cards container */}
        <div
          ref={trackRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="group relative flex w-[310px] sm:w-[350px] shrink-0 snap-start flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/90 p-7 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-950/10 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-4xl sm:text-5xl font-black text-slate-200 group-hover:text-blue-500/30 transition-colors">
                      {s.n}
                    </span>
                    <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${s.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                      <span>{s.tag}</span>
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground min-h-[48px]">
                    {s.desc}
                  </p>
                </div>

                {/* Progress Indicators & Micro Step Tracker */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {steps.map((_, j) => (
                      <span
                        key={j}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          j === i ? "w-5 bg-blue-600" : "w-1.5 bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">
                    STAGE {i + 1} OF 10
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
