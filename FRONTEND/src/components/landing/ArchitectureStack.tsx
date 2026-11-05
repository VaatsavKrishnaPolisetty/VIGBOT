"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ShieldCheck, Cpu, Cloud, Database, Send, Zap, Lock, Sparkles, Check } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LayerData {
  id: string;
  number: string;
  name: string;
  category: string;
  latency: string;
  icon: typeof ShieldCheck;
  color: string;
  glow: string;
  border: string;
  details: string[];
}

const layers: LayerData[] = [
  {
    id: "tier1",
    number: "01",
    name: "Deterministic RLS & Verification Guard",
    category: "Zero-AI Database Engine",
    latency: "< 0.8ms",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.2)",
    border: "border-emerald-200",
    details: [
      "Cryptographic student token isolation (VFSTR-SEC-2026)",
      "Strict Row-Level Security: zero cross-student data leakage",
      "Immediate distress & suicide keyword interceptor",
      "Deterministic formula computation (attendance, exam eligibility)",
    ],
  },
  {
    id: "tier2",
    number: "02",
    name: "On-Device ML Intent Classifier",
    category: "18 Campus Domain Modules",
    latency: "1.2ms (Zero Network Hop)",
    icon: Cpu,
    color: "from-blue-600 to-indigo-600",
    glow: "rgba(59, 130, 246, 0.2)",
    border: "border-blue-200",
    details: [
      "18 TF-IDF + Logistic Regression classifiers running locally",
      "Direct routing to timetable, fees, circulars, and grade audit",
      "Confidence thresholding (>= 0.72 direct execution)",
      "Continuous feedback loop from student upvotes/downvotes",
    ],
  },
  {
    id: "tier3",
    number: "03",
    name: "Sanitized Cloud LLM Fallback",
    category: "PII-Redacted Gemini / Groq",
    latency: "~450ms",
    icon: Cloud,
    color: "from-indigo-600 to-violet-600",
    glow: "rgba(99, 102, 241, 0.2)",
    border: "border-indigo-200",
    details: [
      "Pre-flight PII scrubber redacts roll numbers, names, phone numbers",
      "Complex academic reasoning and tutoring queries only",
      "Offline-first graceful fallback if cloud is unavailable",
      "R23 syllabus and clause citations injected as context",
    ],
  },
];

export function ArchitectureStack() {
  const stackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stackRef, { once: true, margin: "-100px" });
  const [activeLayer, setActiveLayer] = useState<string>("tier1");
  const [isPacketTransiting, setIsPacketTransiting] = useState(false);
  const [transitStep, setTransitStep] = useState(0);
  const reduced = useReducedMotion();

  const current = layers.find((l) => l.id === activeLayer) || layers[0];

  const triggerPacketSimulation = useCallback(() => {
    if (isPacketTransiting) return;
    setIsPacketTransiting(true);
    setTransitStep(1);
    setActiveLayer("tier1");

    setTimeout(() => {
      setTransitStep(2);
      setActiveLayer("tier2");
    }, 600);

    setTimeout(() => {
      setTransitStep(3);
      setActiveLayer("tier3");
    }, 1200);

    setTimeout(() => {
      setIsPacketTransiting(false);
      setTransitStep(0);
    }, 1800);
  }, [isPacketTransiting]);

  // Automatically simulate query pipeline when the section is reached via scroll
  useEffect(() => {
    if (!inView || reduced) return;
    const timer = setTimeout(() => {
      triggerPacketSimulation();
    }, 500);
    return () => clearTimeout(timer);
  }, [inView, reduced, triggerPacketSimulation]);

  return (
    <div
      ref={stackRef}
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 sm:p-10 backdrop-blur-xl shadow-2xl shadow-indigo-950/5"
    >
      {/* Dynamic Background Flare */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-25 blur-3xl transition-all duration-700"
        style={{ background: current.glow }}
      />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
              Interactive Hardware & Software Stack
            </span>
          </div>
          <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            The Three-Tier Verification Engine
          </h3>
        </div>

        <button
          type="button"
          onClick={triggerPacketSimulation}
          disabled={isPacketTransiting}
          className="inline-flex items-center gap-2 self-start rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-slate-800 disabled:opacity-50 cursor-pointer transition active:scale-95"
        >
          <Send className={`h-3.5 w-3.5 ${isPacketTransiting ? "animate-pulse" : ""}`} />
          <span>{isPacketTransiting ? "Routing Packet..." : "Simulate Query Pipeline"}</span>
        </button>
      </div>

      {/* 3D Stack View & Layer Details */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        {/* Visual Stack Cards */}
        <div className="relative space-y-3">
          {layers.map((layer, idx) => {
            const isSelected = activeLayer === layer.id;
            const Icon = layer.icon;
            const isPacketHere = transitStep === idx + 1;

            return (
              <motion.div
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                whileHover={{ scale: reduced ? 1 : 1.01, x: 4 }}
                transition={{ duration: 0.2 }}
                className={`relative cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                  isSelected
                    ? `${layer.border} bg-white shadow-lg shadow-slate-200/60 ring-2 ring-blue-500/20`
                    : "border-slate-200/60 bg-slate-50/60 hover:bg-white/80 opacity-80"
                }`}
              >
                {/* Simulated Packet Orb traversing */}
                {isPacketHere && (
                  <motion.div
                    layoutId="transit-orb"
                    className="absolute -left-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Zap className="h-3 w-3" />
                  </motion.div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${layer.color} text-white shadow-sm`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-400">
                          {layer.number}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{layer.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">{layer.category}</p>
                    </div>
                  </div>

                  <span className="font-mono text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {layer.latency}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Deep Dive Panel */}
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="font-mono text-xs font-bold uppercase text-slate-500">
              Layer Inspection // {current.number}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
              <Sparkles className="h-3 w-3" />
              Verified Architecture
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-bold text-slate-900">{current.name}</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Guaranteed latency & safety thresholds for all 385 enrolled students.
            </p>

            <ul className="mt-4 space-y-2.5">
              {current.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Micro Telemetry */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>MODE: DETERMINISTIC</span>
            <span className="text-emerald-600 font-bold">RLS INTEGRITY: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

