"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { animate } from "animejs";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Bot,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  User,
  CheckCircle2,
  Fingerprint,
  Eye,
  EyeOff,
  AlertCircle,
  Radio,
  Check,
  KeyRound,
} from "lucide-react";
import { CURRENT_STUDENT } from "@/data/student";
import { getStudentData } from "@/data/students-db";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useStudent } from "@/context/StudentContext";
import { ParticleConstellation } from "@/components/landing/ParticleConstellation";

interface LoginViewProps {
  onLogin: () => void;
  onBack?: () => void;
}

const PRESET_PERSONAS = [
  {
    id: "251FA04E13",
    name: "Aman Kumar",
    role: "Regular Student",
    dept: "CSE (Section 7)",
    attendance: "76.5%",
    status: "Hall Ticket Ready",
    pwd: "aman@251FA04E13",
  },
  {
    id: "24CSE001",
    name: "Asha Reddy",
    role: "High Attendance",
    dept: "B.Tech CSE Sec-A",
    attendance: "78.4%",
    status: "Honors Bracket",
    pwd: "asha@24CSE001",
  },
  {
    id: "24CSE002",
    name: "Rahul Verma",
    role: "Condonation Tier",
    dept: "B.Tech CSE Sec-A",
    attendance: "68.2%",
    status: "Recovery Alert",
    pwd: "rahul@24CSE002",
  },
];

/**
 * Lightweight hardware-accelerated 3D Holographic Smart Card
 */
function HolographicSmartCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, showGlare: false });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (py - 0.5) * -12,
      ry: (px - 0.5) * 12,
      gx: px * 100,
      gy: py * 100,
      showGlare: true,
    });
  }

  function handleLeave() {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, showGlare: false });
  }

  return (
    <div style={{ perspective: 1000 }} className="relative">
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.12s ease-out",
        }}
        className="group relative rounded-2xl will-change-transform"
      >
        {/* Specular glare overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(320px circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.7), transparent 65%)`,
            opacity: tilt.showGlare ? 1 : 0,
          }}
        />
        {children}
      </div>
    </div>
  );
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const { t } = useLanguage();
  const { loginAsStudent } = useStudent();
  const [studentId, setStudentId] = useState(CURRENT_STUDENT.id);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rippleRef = useRef<HTMLDivElement>(null);

  // Restore native hardware cursor immediately on mount
  useEffect(() => {
    document.body.style.cursor = "default";
    const interactive = document.querySelectorAll("a, button, input, [role='button']");
    interactive.forEach((el) => ((el as HTMLElement).style.cursor = ""));
  }, []);

  // Background interactive click ripple (ignores interactive elements)
  function handleBgClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest("input, button, a, label, select, [role='button']")) return;
    if (!rippleRef.current) return;
    const el = rippleRef.current;
    const x = e.clientX;
    const y = e.clientY;
    const dot = document.createElement("span");
    dot.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:8px;height:8px;border-radius:9999px;background:rgba(59,130,246,0.35);pointer-events:none;transform:translate(-50%,-50%);z-index:1;`;
    el.appendChild(dot);
    animate(dot, {
      scale: [1, 20],
      opacity: [0.5, 0],
      duration: 800,
      ease: "outExpo",
      onComplete: () => dot.remove(),
    });
  }

  // Live lookup of student profile for the landscape identity card
  const resolvedStudent = useMemo(() => {
    const rawId = studentId.trim().toUpperCase();
    if (!rawId) return null;
    try {
      const data = getStudentData(rawId);
      if (data?.profile?.id) return data;
    } catch {
      // Fallback
    }
    return null;
  }, [studentId]);

  // Real-time roll number format validator check
  const isRollValid = useMemo(() => {
    const clean = studentId.trim();
    return clean.length >= 8 && /^[0-9A-Z]+$/i.test(clean);
  }, [studentId]);

  // Detect Caps Lock state
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState("CapsLock")) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleSelectPersona = (persona: typeof PRESET_PERSONAS[0]) => {
    setStudentId(persona.id);
    setPassword(persona.pwd);
    setError(null);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
      colors: ["#2563eb", "#4f46e5", "#10b981"],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError(t.enterStudentId || "Please enter your Student Roll Number.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password in format: firstname@regdnumber (e.g. aman@251FA04E13)");
      return;
    }
    setError(null);
    setIsLoading(true);
    const regd = studentId.trim().toUpperCase();
    const pwd = password.trim();
    try {
      await loginAsStudent(regd, pwd);
      setIsLoading(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#2563eb", "#4f46e5", "#10b981", "#ffffff"],
      });
      onLogin();
    } catch (err: any) {
      console.warn("Login error:", err);
      setError(err?.message || "Authentication failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={handleBgClick}
      className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden bg-slate-50 text-foreground selection:bg-blue-600 selection:text-white"
    >
      {/* Ripple click layer */}
      <div ref={rippleRef} className="pointer-events-none fixed inset-0 z-10" aria-hidden="true" />

      {/* Living Cryptographic Constellation & Ambient Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <ParticleConstellation particleCount={30} connectionDistance={115} />

        {/* Ambient colored auroras (lightweight radial gradients without heavy GPU blurs) */}
        <div
          className="absolute -top-32 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full pointer-events-none opacity-40"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.22), rgba(79,70,229,0.12), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 -left-20 h-[32rem] w-[32rem] rounded-full pointer-events-none opacity-35"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.18), transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-24 h-[32rem] w-[32rem] rounded-full pointer-events-none opacity-30"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)" }}
        />

        {/* Fine Drafting Grid */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 45%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 45%, transparent 90%)",
          }}
        />
      </div>

      {/* Top Header with Back Pill & Academic Telemetry */}
      <header className="relative z-20 w-full border-b border-slate-200/75 bg-white/80 px-4 py-3.5 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Floating Back Pill */}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="group flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-md transition-all hover:border-blue-300 hover:bg-white hover:text-blue-600 cursor-pointer"
                title="Return to Landing Page Overview"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Overview</span>
              </button>
            )}

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <Image
                src="/vignan-logo.png"
                alt="Vignan Foundation"
                width={130}
                height={40}
                priority
                className="h-8 w-auto object-contain"
              />
              <span className="hidden font-mono text-[11px] font-bold tracking-wider text-slate-400 sm:inline-block uppercase">
                // STUDENT GATEWAY
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200/90 bg-emerald-50/90 px-3.5 py-1 font-mono text-[11px] font-semibold text-emerald-800 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>RLS ARMED // AES-256</span>
            </div>
          </div>
        </div>
      </header>

      {/* Full Landscape Login Box (Themed Light Maximalist Monolith) */}
      <main className="relative z-20 flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl">
          {/* Main 2-Column Landscape Card with Specular Bioluminescent Aura */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 shadow-2xl shadow-blue-950/10 backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12">
            {/* Top Multi-stop Gradient Light Strip */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400" />

            {/* ========================================================= */}
            {/* LEFT COLUMN: Physical Smart Pass & Persona Switcher */}
            {/* ========================================================= */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-7 sm:p-9 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col justify-between relative overflow-hidden">
              {/* Decorative Guilloche Watermark Seal */}
              <div
                className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full border-8 border-blue-100/50 opacity-25"
              />

              {/* Brand Lockup */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                      <Bot className="h-4 w-4" />
                    </span>
                    <span className="font-extrabold text-sm tracking-tight text-slate-900">
                      VIGNAN-AI
                    </span>
                    <span className="font-mono text-[10px] text-blue-600 font-bold bg-blue-100/80 px-2 py-0.5 rounded-full border border-blue-200">
                      CORE v2.4
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                    VFSTR // 2026
                  </span>
                </div>

                <h2 className="mt-3 text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-snug">
                  University Student Portal
                </h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Cryptographically verified gateway to attendance math, examination schedules, and institutional records.
                </p>
              </div>

              {/* PHYSICAL METALLIC SMART PASS SPECIMEN (Interactive 3D Tilt) */}
              <div className="relative z-10 my-6">
                <HolographicSmartCard>
                  <div className="relative rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-5 shadow-xl shadow-blue-950/5 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:border-blue-300">
                    {/* Top Bar of the Smart Card */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        {/* Golden Metallic EMV Chip Specimen */}
                        <div className="flex h-7 w-9 items-center justify-center rounded-md border border-amber-300 bg-gradient-to-tr from-amber-200 via-amber-300 to-amber-100 p-1 shadow-xs">
                          <div className="h-full w-full rounded border border-amber-400/60 grid grid-cols-2 gap-0.5 opacity-80">
                            <span className="bg-amber-400/40 rounded-xs" />
                            <span className="bg-amber-400/40 rounded-xs" />
                            <span className="bg-amber-400/40 rounded-xs" />
                            <span className="bg-amber-400/40 rounded-xs" />
                          </div>
                        </div>
                        <Radio className="h-3.5 w-3.5 text-blue-500 opacity-75" />
                      </div>

                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        R23 SEC. 4.2 COMPLIANT
                      </span>
                    </div>

                    {/* Student Persona Information */}
                    <div className="mt-4 flex items-center gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white font-black text-sm shadow-md shadow-blue-600/20">
                        {(resolvedStudent?.profile?.name || CURRENT_STUDENT.name)
                          .split(" ")
                          .map((w: string) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {resolvedStudent?.profile?.name || CURRENT_STUDENT.name}
                          </h3>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        </div>
                        <p className="font-mono text-[11px] font-semibold text-blue-600">
                          {resolvedStudent?.profile?.id || CURRENT_STUDENT.id}
                        </p>
                      </div>
                    </div>

                    {/* Live Attendance & Department Grid */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Department</span>
                        <p className="text-[11px] font-semibold text-slate-700 truncate">
                          {resolvedStudent?.profile?.department || "CSE (AI & ML)"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Live Attendance</span>
                        <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="h-3 w-3 stroke-[3]" />
                          <span>
                            {resolvedStudent?.attendance?.overallPercentage
                              ? `${resolvedStudent.attendance.overallPercentage}% (Eligible)`
                              : "76.5% (Hall Ticket Ready)"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Security Scoped Token Badge */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <KeyRound className="h-3 w-3 text-slate-400" />
                        TOKEN: VFSTR-SEC-2026
                      </span>
                      <span className="text-blue-600 font-bold">PII-REDACTED</span>
                    </div>
                  </div>
                </HolographicSmartCard>

                {/* PERSONA FAST SWITCHER CHIPS */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5 px-0.5">
                    <span>Quick Persona Switcher</span>
                    <span className="text-blue-600 font-semibold">1-Tap Load</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PRESET_PERSONAS.map((persona) => {
                      const isSelected = studentId === persona.id;
                      return (
                        <button
                          key={persona.id}
                          type="button"
                          onClick={() => handleSelectPersona(persona)}
                          className={`flex flex-col items-start p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-400 bg-blue-50/90 shadow-xs ring-1 ring-blue-400"
                              : "border-slate-200/80 bg-white/70 hover:bg-white hover:border-slate-300"
                          }`}
                        >
                          <span className="text-[11px] font-bold text-slate-900 truncate w-full">
                            {persona.name}
                          </span>
                          <span className="font-mono text-[9px] text-blue-600 font-semibold truncate w-full">
                            {persona.id}
                          </span>
                          <span className="text-[8px] text-slate-400 mt-0.5">
                            {persona.attendance} Attd
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Left Column Security Guarantee Footer */}
              <div className="relative z-10 pt-2 text-[11px] text-muted-foreground flex items-center gap-2 border-t border-slate-200/60">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Mathematical Row-Level Security: zero cross-student record visibility.
                </span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN: The Tactile Light Login Form */}
            {/* ========================================================= */}
            <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Form Heading & Subtitle */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h1 className="text-2xl sm:text-[1.65rem] font-extrabold tracking-tight text-slate-900">
                      Student Single Sign-On
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Sign in with your university roll number and institutional password.
                    </p>
                  </div>
                  <span className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
                    <User className="h-5 w-5" />
                  </span>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-700 animate-in fade-in duration-200">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Roll Number Field with Real-Time Validation Pill */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <label htmlFor="student-roll-id">
                        {t.rollNoLabel || "Student Roll Number"}
                      </label>
                      {isRollValid ? (
                        <span className="font-mono text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="h-3 w-3 stroke-[3]" />
                          VALID ROLL FORMAT
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-blue-600 font-medium">
                          {t.loginRollFormat || "Format: 251FA04E13"}
                        </span>
                      )}
                    </div>
                    <div className="relative group">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        id="student-roll-id"
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder={t.enterStudentId || "Enter Student Roll Number"}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-4 font-mono text-sm text-slate-900 placeholder-slate-400 shadow-2xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field with Eye Toggle & Caps Lock Indicator */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <label htmlFor="student-password">
                        {t.loginPasswordPin || "Institutional Password"}
                      </label>
                      {capsLockActive && (
                        <span className="font-mono text-[10px] text-amber-600 font-bold flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          CAPS LOCK ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        id="student-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyDown}
                        placeholder="e.g. aman@251FA04E13"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-10 font-mono text-sm text-slate-900 placeholder-slate-400 shadow-2xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Format: <span className="font-semibold text-slate-800">firstname@regdnumber</span> (e.g. <span className="font-mono text-blue-600 font-semibold">aman@251FA04E13</span>)
                    </p>
                  </div>

                  {/* Remember Me & Biometric Notice */}
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{t.loginKeepAuth || "Keep me authenticated"}</span>
                    </label>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                      <Fingerprint className="h-3.5 w-3.5 text-blue-500" />
                      <span>Biometric ready</span>
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>{t.loginAuthenticating || "Authenticating Student..."}</span>
                      </span>
                    ) : (
                      <>
                        <span>{t.signIn || t.loginTitle || "Sign In to Portal"}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Bottom Card Meta & Admin Link */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Check className="h-3 w-3 stroke-[3]" />
                    Row-Level Security
                  </span>
                  <span>•</span>
                  <span>18 ML Intents</span>
                </div>

                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full border-t border-slate-200/75 bg-white/80 px-6 py-3.5 text-center text-xs text-muted-foreground backdrop-blur-md">
        <p>
          {t.loginFooterPolicy ||
            "VIGNAN-AI • Autonomous Campus Helpdesk & Grievance Resolution Agent • Protected by University Privacy Policies"}
        </p>
      </footer>
    </div>
  );
};
