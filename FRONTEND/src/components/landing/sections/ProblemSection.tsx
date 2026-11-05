"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FIVE_PORTALS = "five portals".split("");

// Scatter vectors for each letter of "five portals"
const scatterVectors = [
  { x: -45, y: -25, r: -22 },
  { x: -30, y: -45, r: 18 },
  { x: -15, y: -30, r: -15 },
  { x: -5, y: -50, r: 25 },
  { x: 0, y: 0, r: 0 }, // space
  { x: 10, y: -40, r: -20 },
  { x: 25, y: -25, r: 15 },
  { x: 40, y: -45, r: -30 },
  { x: 30, y: -15, r: 10 },
  { x: 50, y: -35, r: 25 },
  { x: 60, y: -20, r: -18 },
  { x: 75, y: -40, r: 35 },
];

const portals = [
  { name: "Attendance Portal", color: "border-blue-200 text-blue-700 bg-blue-50/80" },
  { name: "Exam Cell System", color: "border-purple-200 text-purple-700 bg-purple-50/80" },
  { name: "Finance Desk", color: "border-amber-200 text-amber-700 bg-amber-50/80" },
  { name: "Academic Office", color: "border-emerald-200 text-emerald-700 bg-emerald-50/80" },
  { name: "Grievance Cell", color: "border-rose-200 text-rose-700 bg-rose-50/80" },
];

function KineticChar({
  char,
  vec,
  progress,
  reduced,
}: {
  char: string;
  vec: { x: number; y: number; r: number };
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const charX = useTransform(progress, [0, 1], [0, vec.x]);
  const charY = useTransform(progress, [0, 1], [0, vec.y]);
  const charRotate = useTransform(progress, [0, 1], [0, vec.r]);
  const charOpacity = useTransform(progress, [0, 0.85], [1, 0.25]);

  if (char === " ") return <span> </span>;

  return (
    <motion.span
      className="inline-block text-blue-600 transition-colors"
      style={
        reduced
          ? undefined
          : {
              x: charX,
              y: charY,
              rotate: charRotate,
              opacity: charOpacity,
            }
      }
    >
      {char}
    </motion.span>
  );
}

/**
 * Scene 2 — Kinetic Scatter Problem Section:
 * The letters of "five portals" physically scatter apart upon scroll-strike,
 * while "one conversation" gathers from scattered positions.
 * Accompanied by 5 floating deprecated portal tags converging into 1 intelligence node.
 */
export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.3"],
  });

  // Strike & scatter progress
  const strikeWidth = useTransform(scrollYProgress, [0.15, 0.45], ["0%", "100%"]);
  const scatterProgress = useTransform(scrollYProgress, [0.25, 0.6], [0, 1]);

  // Assembly of "one conversation"
  const newOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const newScale = useTransform(scrollYProgress, [0.4, 0.75], [0.92, 1]);

  return (
    <section
      id="problem"
      ref={ref}
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white py-32"
    >
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute h-[32rem] w-[32rem] rounded-full bg-blue-100/40 blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Eyebrow */}
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
          THE CAMPUS DILEMMA
        </span>

        {/* Main kinetic headline */}
        <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-tight">
          You shouldn&apos;t need{" "}
          <span className="relative inline-block whitespace-nowrap">
            {FIVE_PORTALS.map((char, i) => (
              <KineticChar
                key={i}
                char={char}
                vec={scatterVectors[i] || { x: 0, y: 0, r: 0 }}
                progress={scatterProgress}
                reduced={reduced}
              />
            ))}

            {/* Glowing Rose Strike-through Laser Line */}
            {!reduced && (
              <motion.span
                className="absolute left-0 top-1/2 z-20 h-[4px] -translate-y-1/2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                style={{ width: strikeWidth }}
              />
            )}
          </span>{" "}
          to know your attendance.
        </p>

        {/* Dynamic Assembled "One Conversation" */}
        <motion.p
          className="mt-8 text-3xl font-extrabold sm:text-5xl tracking-tight"
          style={
            reduced
              ? {
                  backgroundImage: "linear-gradient(120deg,#2563eb,#4f46e5,#7c3aed)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }
              : {
                  opacity: newOpacity,
                  scale: newScale,
                  backgroundImage: "linear-gradient(120deg,#2563eb,#4f46e5,#7c3aed)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }
          }
        >
          You need one conversation.
        </motion.p>

        <p className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
          VIGNAN-AI collapses fragmented university portals — ERP attendance, exam
          schedules, bank fees, syllabus regulations, and grievances — into a single
          deterministic dialogue that queries the source of truth in under a millisecond.
        </p>

        {/* 5 Deprecated Portals Converging Visual */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-2.5">
          {portals.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-xs backdrop-blur-xs ${p.color}`}
            >
              <span className="line-through opacity-75">{p.name}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">→ VIGBOT</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
