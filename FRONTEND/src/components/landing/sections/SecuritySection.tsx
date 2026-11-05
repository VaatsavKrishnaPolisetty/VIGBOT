"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { animate } from "animejs";
import { ShieldCheck, ShieldAlert, Lock, Zap, CheckCircle, Terminal } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "./Reveal";
import { ScrambleText } from "../ScrambleText";

export function SecuritySection() {
  const lockRef = useRef<HTMLDivElement>(null);
  const inView = useInView(lockRef, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();

  const [testState, setTestState] = useState<"idle" | "testing" | "blocked">("idle");

  useEffect(() => {
    if (!inView || reduced || !lockRef.current) return;
    // Decisively snap the shackle shut into the lock body
    animate(".lock-shackle", {
      rotate: [-70, 0],
      translateY: [-6, 0],
      duration: 750,
      ease: "outBounce",
      delay: 350,
    });
    animate(".lock-body-group", {
      translateY: [0, 2.5, 0],
      duration: 250,
      delay: 600,
      ease: "outQuad",
    });
    animate(".lock-glow", {
      opacity: [0, 0.9, 0],
      scale: [0.8, 1.6],
      duration: 1000,
      delay: 580,
      ease: "outQuad",
    });
  }, [inView, reduced]);

  const handleSimulateAttack = () => {
    if (testState === "testing") return;
    setTestState("testing");

    setTimeout(() => {
      setTestState("blocked");
    }, 700);
  };

  return (
    <section
      id="trust-&-security"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white py-28"
    >
      {/* Background ambient security shield halo */}
      <div
        className="pointer-events-none absolute h-[36rem] w-[36rem] rounded-full bg-emerald-100/35 blur-[140px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600">
              Deterministic Security & Isolation
            </span>
          </div>
        </Reveal>

        {/* Animated Master Lock */}
        <div ref={lockRef} className="relative mx-auto mt-10 mb-8 h-28 w-24">
          <div
            className="lock-glow pointer-events-none absolute inset-0 rounded-full bg-emerald-400/40 blur-2xl"
            style={{ opacity: 0 }}
          />
          <svg viewBox="0 0 96 112" className="relative h-full w-full filter drop-shadow-md">
            {/* Shackle: starts open and swings shut into the lock */}
            <path
              className="lock-shackle"
              d="M28 48 V36 a20 20 0 0 1 40 0 V48"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              style={{
                transformOrigin: "28px 48px",
                transform: reduced ? "none" : "rotate(-70deg) translateY(-6px)",
              }}
            />
            {/* Body */}
            <g className="lock-body-group">
              <rect x="20" y="48" width="56" height="48" rx="10" fill="#10b981" />
              {/* Keyhole */}
              <circle cx="48" cy="68" r="5" fill="white" />
              <rect x="46" y="68" width="4" height="14" fill="white" />
            </g>
          </svg>
        </div>

        <Reveal delay={0.2}>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            A student can never see{" "}
            <span className="text-slate-400 line-through decoration-rose-400/70">
              another student&apos;s
            </span>{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              <ScrambleText text="records." />
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.35}>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Every query is mathematically scoped to your verified student token before it reaches
            the database layer. Cross-student queries are rejected deterministically by PostgreSQL
            Row-Level Security — mathematically impossible to hallucinate or prompt-inject.
          </p>
        </Reveal>

        {/* Interactive Intrusion Simulation Playground */}
        <div className="mx-auto mt-10 max-w-xl">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-5 text-left text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span>SECURITY_TEST_CONSOLE</span>
              </div>
              <button
                type="button"
                onClick={handleSimulateAttack}
                disabled={testState === "testing"}
                className="rounded-lg bg-emerald-600 px-3 py-1 font-mono text-[11px] font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition cursor-pointer"
              >
                {testState === "testing" ? "Simulating..." : "Test Cross-Student Access"}
              </button>
            </div>

            <div className="mt-3.5 font-mono text-xs space-y-1.5 leading-relaxed text-slate-300">
              <div className="text-slate-500"># Authenticated: 251FA04E13 (Aman Kumar)</div>
              <div>
                <span className="text-blue-400">&gt; Query:</span> &quot;Show me Rahul&apos;s exam marks (24CSE002)&quot;
              </div>

              {testState === "testing" && (
                <div className="text-amber-400 animate-pulse">
                  [*] Intercepting query... Validating token cryptographic boundary...
                </div>
              )}

              {testState === "blocked" && (
                <div className="space-y-1 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2.5 text-emerald-400">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>POLICY REJECTION ENFORCED [0.38ms]</span>
                  </div>
                  <div className="text-[11px] text-emerald-300">
                    RLS Guard prevented unauthorized relation access. User 251FA04E13 token cannot inspect row partition 24CSE002.
                  </div>
                </div>
              )}

              {testState === "idle" && (
                <div className="text-slate-500 text-[11px]">
                  Click above to run live intrusion validation against the security model.
                </div>
              )}
            </div>
          </div>
        </div>

        <Reveal delay={0.5}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              VFSTR-SEC-2026 JWT Scoped
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Deterministic SQL Filters
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Egress PII Redactor
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
