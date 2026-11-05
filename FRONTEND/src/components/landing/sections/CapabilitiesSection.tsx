"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "./Reveal";
import { ScrambleText } from "../ScrambleText";
import { AttendanceRecoveryDial } from "../AttendanceRecoveryDial";
import {
  GraduationCap,
  Calendar,
  FileCheck,
  CreditCard,
  MapPin,
  HeartHandshake,
  Users,
  Compass,
  Sparkles,
  ChevronRight,
  BookOpen,
  Award,
} from "lucide-react";

const capabilities = [
  { name: "Attendance & recovery math", category: "Academic", icon: FileCheck },
  { name: "Marks, CGPA & degree audit", category: "Academic", icon: Award },
  { name: "Fees, receipts & due dates", category: "Finance", icon: CreditCard },
  { name: "Timetable & exam halls", category: "Campus", icon: Calendar },
  { name: "Service-request ticketing", category: "Administrative", icon: FileCheck },
  { name: "Campus navigation & directions", category: "Campus", icon: MapPin },
  { name: "Policy citations (R23 Clause 4.2)", category: "Compliance", icon: BookOpen },
  { name: "Lost & found, clubs, marketplace", category: "Student Life", icon: Compass },
  { name: "Wellness & counseling resources", category: "Student Life", icon: HeartHandshake },
  { name: "Faculty directory & mentor booking", category: "Mentorship", icon: Users },
  { name: "Curriculum & credit tracking", category: "Academic", icon: GraduationCap },
  { name: "Broadcast alerts & circulars", category: "Administrative", icon: Sparkles },
];

/**
 * Scene 7 — Capabilities Inventory & Interactive Attendance Recovery:
 * Combines the live Attendance Recovery Dial with the 12 domain capabilities.
 */
export function CapabilitiesSection() {
  const reduced = useReducedMotion();

  return (
    <section id="features" className="relative bg-gradient-to-b from-white via-slate-50 to-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
              Complete Academic Scope
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              <ScrambleText text="One assistant, your whole academic life" />
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              No more chasing five different portals. VIGNAN-AI connects to every
              record that matters and answers deterministically from the source of truth.
            </p>
          </div>
        </Reveal>

        {/* 2-Column Showcase: Left = Live Attendance Dial (Sticky pinned), Right = Capabilities Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Dial stays pinned while the 12 cards scroll */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start z-10">
            <AttendanceRecoveryDial />
          </div>

          {/* Right Column: Capabilities Stack */}
          <div className="lg:col-span-7 space-y-3">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <Reveal key={cap.name} delay={Math.min(i * 0.04, 0.4)} y={15}>
                  <div className="group flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/80 p-3.5 sm:p-4 shadow-2xs backdrop-blur-md transition-all duration-300 hover:border-blue-300 hover:bg-white hover:shadow-md hover:translate-x-1 cursor-default">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {cap.name}
                        </span>
                        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                          {cap.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-300 group-hover:text-blue-500 transition-colors">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-blue-500" />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
