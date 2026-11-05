"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { animate } from "animejs";
import confetti from "canvas-confetti";
import { adminLogin } from "@/actions/admin";
import {
  Lock,
  ShieldAlert,
  Key,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
  CheckCircle2,
  Database,
  ArrowRight,
  ArrowLeft,
  Check,
  Radio,
  Landmark,
  AlertCircle,
  KeyRound,
  FileCheck2,
} from "lucide-react";
import { ParticleConstellation } from "@/components/landing/ParticleConstellation";

/**
 * Lightweight hardware-accelerated 3D Holographic Nodal Officer Pass
 */
function HolographicOfficerCard({ children }: { children: React.ReactNode }) {
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

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const router = useRouter();
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
    dot.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:8px;height:8px;border-radius:9999px;background:rgba(79,70,229,0.35);pointer-events:none;transform:translate(-50%,-50%);z-index:1;`;
    el.appendChild(dot);
    animate(dot, {
      scale: [1, 20],
      opacity: [0.5, 0],
      duration: 800,
      ease: "outExpo",
      onComplete: () => dot.remove(),
    });
  }

  // Clock effect for Indian Standard Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }) + " IST"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Detect Caps Lock state
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState("CapsLock")) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminLogin(username, password);
      if (res.success) {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 },
          colors: ["#2563eb", "#4f46e5", "#10b981", "#d97706"],
        });
        localStorage.setItem("adminSession", JSON.stringify(res.admin));
        router.push("/admin");
      } else {
        setError(res.error || "Invalid administrator credentials. Access denied.");
      }
    } catch (err) {
      setError("A secure connection error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.6 },
      colors: ["#4f46e5", "#2563eb", "#10b981"],
    });
  };

  const navigateToStudentPortal = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("vignan_portal_direct", "student");
    }
  };

  return (
    <div
      onClick={handleBgClick}
      className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white"
    >
      {/* Ripple click layer */}
      <div ref={rippleRef} className="pointer-events-none fixed inset-0 z-10" aria-hidden="true" />

      {/* Living Constellation & Ambient Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <ParticleConstellation particleCount={30} connectionDistance={115} />

        {/* Ambient colored auroras (lightweight radial gradients without heavy GPU blurs) */}
        <div
          className="absolute -top-32 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full pointer-events-none opacity-40"
          style={{ background: "radial-gradient(circle, rgba(79,70,229,0.22), rgba(37,99,235,0.12), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 -left-20 h-[32rem] w-[32rem] rounded-full pointer-events-none opacity-35"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18), transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-24 h-[32rem] w-[32rem] rounded-full pointer-events-none opacity-30"
          style={{ background: "radial-gradient(circle, rgba(217,119,6,0.15), transparent 70%)" }}
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

      {/* Top Header with Back to Student Portal & Telemetry */}
      <header className="relative z-20 w-full border-b border-slate-200/75 bg-white/80 px-4 py-3.5 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/?portal=student"
              onClick={navigateToStudentPortal}
              className="group flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-md transition-all hover:border-blue-300 hover:bg-white hover:text-blue-600 cursor-pointer"
              title="Return directly to Student Portal Login"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Student Portal</span>
            </Link>

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
                // NODAL OFFICER GATEWAY
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex min-w-[110px] items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1 font-mono text-[11px] font-medium text-slate-600 shadow-2xs">
              <Clock className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>{currentTime || "IST Live"}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-indigo-200/90 bg-indigo-50/90 px-3.5 py-1 font-mono text-[11px] font-semibold text-indigo-900 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
              <span>RLAC 2.1 // STATUTORY CLEARANCE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Full Landscape Login Box (Themed Light Maximalist Monolith) */}
      <main className="relative z-20 flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl">
          {/* Main 2-Column Landscape Card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 shadow-2xl shadow-indigo-950/10 backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12">
            {/* Top Multi-stop Gradient Light Strip */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-600 via-blue-600 to-amber-500" />

            {/* ========================================================= */}
            {/* LEFT COLUMN: Physical Holographic Nodal Pass & Telemetry */}
            {/* ========================================================= */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/20 p-7 sm:p-9 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col justify-between relative overflow-hidden">
              {/* Decorative Guilloche Watermark Seal */}
              <div
                className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full border-8 border-indigo-100/50 opacity-25"
              />

              {/* Brand Lockup */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                      <Landmark className="h-4 w-4" />
                    </span>
                    <span className="font-extrabold text-sm tracking-tight text-slate-900">
                      VIGNAN-AI
                    </span>
                    <span className="font-mono text-[10px] text-indigo-700 font-bold bg-indigo-100/80 px-2 py-0.5 rounded-full border border-indigo-200">
                      NODAL v2.4
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                    VFSTR // STATUTORY
                  </span>
                </div>

                <h2 className="mt-3 text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-snug">
                  Nodal Officer Gateway
                </h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Cryptographically secured console for university ombudsmen, grievance hearings, and regulatory compliance.
                </p>
              </div>

              {/* PHYSICAL METALLIC NODAL PASS SPECIMEN (Interactive 3D Tilt) */}
              <div className="relative z-10 my-6">
                <HolographicOfficerCard>
                  <div className="relative rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 p-5 shadow-xl shadow-indigo-950/5 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:border-indigo-300">
                    {/* Top Bar of the Smart Pass */}
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
                        <Radio className="h-3.5 w-3.5 text-indigo-500 opacity-75" />
                      </div>

                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        TIER-1 ROOT CLEARANCE
                      </span>
                    </div>

                    {/* Officer Identity Information */}
                    <div className="mt-4 flex items-center gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white font-black text-sm shadow-md shadow-indigo-600/20">
                        NO
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            Institutional Nodal Officer
                          </h3>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        </div>
                        <p className="font-mono text-[11px] font-semibold text-indigo-600">
                          ADM-VFSTR-001 • CLAUSE 2.1
                        </p>
                      </div>
                    </div>

                    {/* Live Authority & Security Grid */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Jurisdiction</span>
                        <p className="text-[11px] font-semibold text-slate-700 truncate">
                          Academic & Ombudsman
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Audit Status</span>
                        <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="h-3 w-3 stroke-[3]" />
                          <span>TLS 1.3 / Verified</span>
                        </p>
                      </div>
                    </div>

                    {/* Security Scoped Token Badge */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <KeyRound className="h-3 w-3 text-slate-400" />
                        SCOPE: RLAC-ROOT-OVERSIGHT
                      </span>
                      <span className="text-indigo-600 font-bold">IMMUTABLE LOGS</span>
                    </div>
                  </div>
                </HolographicOfficerCard>

                {/* QUICK DEMO CREDENTIALS ASSISTANT */}
                <div className="mt-4 p-3 bg-white/80 rounded-xl border border-indigo-100/90 shadow-2xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      Testing Command Center?
                    </span>
                    <div className="text-[10px] font-mono text-slate-500">
                      ID: <span className="font-bold text-indigo-600">admin</span> • Key: <span className="font-bold text-indigo-600">admin123</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer hover:shadow-xs active:scale-95"
                  >
                    Auto-fill Demo
                  </button>
                </div>
              </div>

              {/* Left Column Security Guarantee Footer */}
              <div className="relative z-10 pt-2 text-[11px] text-muted-foreground flex items-center gap-2 border-t border-slate-200/60">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Clause 2.1 RLAC Protected • Immutable ledger of all statutory actions.
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
                      Administrator Authentication
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Sign in with your designated administrative roll and institutional security key.
                    </p>
                  </div>
                  <span className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
                    <Lock className="h-5 w-5" />
                  </span>
                </div>

                {/* Institutional Trust Pills */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> TLS 1.3
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3 text-blue-600" /> RLS 2.1 Active
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 flex items-center gap-1 font-semibold">
                    <Database className="w-3 h-3 text-purple-600" /> Neon DB
                  </span>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-700 animate-in fade-in duration-200">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  {/* Administrative Roll / Username */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <label htmlFor="admin-username">Administrative Roll / Username</label>
                      <span className="font-mono text-[10px] text-indigo-600 font-medium">
                        Default: admin
                      </span>
                    </div>
                    <div className="relative group">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input
                        id="admin-username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter admin ID (e.g. admin)"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-4 font-mono text-sm text-slate-900 placeholder-slate-400 shadow-2xs transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  {/* Security Key / Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <label htmlFor="admin-password">Security Key / Password</label>
                      {capsLockActive && (
                        <span className="font-mono text-[10px] text-amber-600 font-bold flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          CAPS LOCK ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="relative group">
                      <Key className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyDown}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-10 font-mono text-sm text-slate-900 placeholder-slate-400 shadow-2xs transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                  </div>

                  {/* Security Advisory Pill */}
                  <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600">
                    <FileCheck2 className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>
                      Authentication is bound to institutional IP & audited against Clause 2.1 RLAC.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 hover:from-indigo-700 hover:to-blue-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Authenticating via Neon PostgreSQL...</span>
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Secure Command Center Login</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Bottom Card Meta & Student Portal Link */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Check className="h-3 w-3 stroke-[3]" />
                    PostgreSQL TLS 1.3
                  </span>
                  <span>•</span>
                  <span>Statutory Clearance</span>
                </div>

                <Link
                  href="/?portal=student"
                  onClick={navigateToStudentPortal}
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Student Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full border-t border-slate-200/75 bg-white/80 px-6 py-3.5 text-center text-xs text-muted-foreground backdrop-blur-md">
        <p>
          Authorized University Personnel Only. All authentication attempts are logged and monitored under UGC & AICTE Higher Education Regulations.
        </p>
      </footer>
    </div>
  );
}
