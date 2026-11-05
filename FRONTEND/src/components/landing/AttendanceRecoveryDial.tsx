"use client";

import { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Plus, Minus, Calculator } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AttendanceRecoveryDial() {
  const reduced = useReducedMotion();
  // Simulated initial state: 120 conducted, 89 attended = 74.17%
  const baseConducted = 120;
  const baseAttended = 89;

  const [simulatedClasses, setSimulatedClasses] = useState(3);

  const totalConducted = baseConducted + simulatedClasses;
  const totalAttended = baseAttended + simulatedClasses;
  const currentPct = Number(((totalAttended / totalConducted) * 100).toFixed(1));
  const basePct = Number(((baseAttended / baseConducted) * 100).toFixed(1));

  const isEligible = currentPct >= 75.0;
  const isCondonation = currentPct >= 65.0 && currentPct < 75.0;

  // Circle dimensions
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentPct / 100) * circumference;

  const statusColor = isEligible
    ? "text-emerald-500"
    : isCondonation
    ? "text-amber-500"
    : "text-rose-500";

  const statusStroke = isEligible
    ? "#10b981"
    : isCondonation
    ? "#f59e0b"
    : "#f43f5e";

  const handleSimulateChange = (delta: number) => {
    const next = Math.max(0, Math.min(15, simulatedClasses + delta));
    setSimulatedClasses(next);

    // If crossing the 75% threshold, trigger a celebration
    const nextPct = ((baseAttended + next) / (baseConducted + next)) * 100;
    if (nextPct >= 75.0 && currentPct < 75.0 && !reduced) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#6366f1"],
      });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-blue-950/5">
      {/* Background radial accent */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{
          background: isEligible
            ? "radial-gradient(circle, #10b981, transparent)"
            : "radial-gradient(circle, #f59e0b, transparent)",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Attendance Recovery Engine</h3>
            <p className="text-xs text-muted-foreground">Autonomous R23 Regulation Audit</p>
          </div>
        </div>
        <span className="font-mono text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          SEC. 4.2 COMPLIANT
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-6">
        {/* SVG Circular Progress Ring */}
        <div className="relative flex items-center justify-center mx-auto">
          <svg width={size} height={size} className="rotate-[-90deg]">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* 75% Regulatory Threshold Marker */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#94a3b8"
              strokeWidth={strokeWidth + 2}
              strokeDasharray="2 12"
              fill="transparent"
              className="opacity-40"
            />
            {/* Active Animated Value */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={statusStroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeLinecap="round"
              fill="transparent"
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </svg>

          {/* Central Percentage */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <motion.span
              key={currentPct}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-extrabold tracking-tight text-slate-900"
            >
              {currentPct}%
            </motion.span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {isEligible ? "Hall Ticket Ready" : "Recovery Mode"}
            </span>
          </div>
        </div>

        {/* Interactive Controls & Live Breakdown */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span className="font-medium">Live Simulation:</span>
              <span className="font-bold text-slate-900">
                +{simulatedClasses} Future Classes Attended
              </span>
            </div>

            {/* Micro Stepper Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSimulateChange(-1)}
                disabled={simulatedClasses <= 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer shadow-xs transition"
                aria-label="Decrease classes"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <div className="flex-1 text-center font-mono text-xs font-semibold text-slate-800">
                {totalAttended} / {totalConducted} Periods
              </div>
              <button
                type="button"
                onClick={() => handleSimulateChange(1)}
                disabled={simulatedClasses >= 15}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer shadow-xs transition"
                aria-label="Increase classes"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Verdict Status Box */}
          <div
            className={`flex items-start gap-3 rounded-xl p-3.5 text-xs transition-colors ${
              isEligible
                ? "border border-emerald-200 bg-emerald-50/80 text-emerald-900"
                : isCondonation
                ? "border border-amber-200 bg-amber-50/80 text-amber-900"
                : "border border-rose-200 bg-rose-50/80 text-rose-900"
            }`}
          >
            {isEligible ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            ) : isCondonation ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            ) : (
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            )}
            <div>
              <div className="font-bold">
                {isEligible
                  ? "Direct Exam Eligibility Attained"
                  : isCondonation
                  ? "Condonation Tier (Requires ₹1,500 VC Approval)"
                  : "Detained Bracket (Attendance <65%)"}
              </div>
              <div className="mt-0.5 text-[11px] opacity-90">
                {isEligible
                  ? "Surpassed the 75% cutoff without penalty fees."
                  : `Need ${Math.max(0, 3 - simulatedClasses)} more consecutive attendances to clear the 75.0% threshold.`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

