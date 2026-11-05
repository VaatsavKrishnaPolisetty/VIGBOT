"use client";

import { useRef } from "react";
import { Reveal } from "./Reveal";
import { ScrambleText } from "../ScrambleText";
import { ArchitectureStack } from "../ArchitectureStack";

/**
 * Scene 3 — the 3-tier engine.
 * Fully upgraded to an interactive, 3D layered architecture stack
 * with live packet transit simulation, latency metrics, and inspector panel.
 */
export function ThreeTierSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="three-tier" ref={ref} className="relative bg-gradient-to-b from-white via-slate-50 to-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-14 text-center">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
              The Intelligence Architecture
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              <ScrambleText text="Three tiers, one answer" />
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Most questions never need the cloud. VIGNAN-AI runs deterministic database
              rules and local on-device ML classifiers first — escalating to LLMs only when deep
              academic reasoning is needed.
            </p>
          </div>
        </Reveal>

        {/* Interactive 3D Architecture Stack & Packet Tracer */}
        <Reveal delay={0.15}>
          <ArchitectureStack />
        </Reveal>
      </div>
    </section>
  );
}
