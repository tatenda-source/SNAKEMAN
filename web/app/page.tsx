"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Camera,
  CalendarDays,
  Zap,
  BookOpen,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Star,
  Shield,
  Eye,
  ShoppingBag,
  XCircle,
  CheckCircle2,
  Phone,
  Heart,
  GraduationCap,
  Bug,
} from "lucide-react";

const DANGER_CONFIG = {
  CRITICAL: { label: "Critical", cls: "badge-critical", dot: "bg-danger" },
  HIGH: { label: "High Danger", cls: "badge-high", dot: "bg-warning" },
  MEDIUM: { label: "Medium Risk", cls: "badge-medium", dot: "bg-safe" },
  LOW: { label: "Low Risk", cls: "bg-venom/20 border border-venom/40 text-venom-glow", dot: "bg-venom" },
};

const SNAKES = [
  { id: "black-mamba", name: "Black Mamba", sci: "Dendroaspis polylepis", danger: "CRITICAL", length: "4.5m", venom: "Neurotoxic", gradient: "from-zinc-900 to-stone-900", accent: "#EF4444" },
  { id: "puff-adder", name: "Puff Adder", sci: "Bitis arietans", danger: "CRITICAL", length: "1.5m", venom: "Cytotoxic", gradient: "from-amber-950 to-stone-950", accent: "#F59E0B" },
  { id: "mozambique-spitting-cobra", name: "Spitting Cobra", sci: "Naja mossambica", danger: "CRITICAL", length: "1.5m", venom: "Cytotoxic + Spit", gradient: "from-brown-950 to-stone-950", accent: "#F59E0B" },
  { id: "boomslang", name: "Boomslang", sci: "Dispholidus typus", danger: "HIGH", length: "1.8m", venom: "Haemotoxic", gradient: "from-green-950 to-emerald-950", accent: "#84CC16" },
  { id: "green-mamba", name: "Green Mamba", sci: "Dendroaspis angusticeps", danger: "HIGH", length: "2.5m", venom: "Neurotoxic", gradient: "from-emerald-950 to-teal-950", accent: "#4ADE80" },
  { id: "egyptian-cobra", name: "Egyptian Cobra", sci: "Naja haje", danger: "HIGH", length: "2.5m", venom: "Neuro + Cyto", gradient: "from-orange-950 to-amber-950", accent: "#FB923C" },
  { id: "african-rock-python", name: "Rock Python", sci: "Python sebae", danger: "MEDIUM", length: "6.0m", venom: "Non-venomous", gradient: "from-purple-950 to-violet-950", accent: "#A78BFA" },
  { id: "rinkhals", name: "Rinkhals", sci: "Hemachatus haemachatus", danger: "HIGH", length: "1.5m", venom: "Neuro + Spit", gradient: "from-slate-950 to-zinc-950", accent: "#F87171" },
];

const FEATURES = [
  {
    icon: Camera,
    title: "Instant AI Identification",
    desc: "Upload any photo and Claude AI identifies the species in seconds — with confidence score, danger level, and full behavioral profile.",
    accent: "venom",
    href: "/identify",
    cta: "Try Identify",
  },
  {
    icon: CalendarDays,
    title: "Expert Consultations",
    desc: "Book one-on-one sessions with Zimbabwe's leading herpetologists and snake handlers. Confirmed appointments, real expertise.",
    accent: "safe",
    href: "/book",
    cta: "Book Now",
  },
  {
    icon: Zap,
    title: "Emergency Response",
    desc: "One tap sends your GPS location and encounter details to on-call experts. Real-time guidance when every second counts.",
    accent: "danger",
    href: "/emergency",
    cta: "Learn More",
  },
  {
    icon: BookOpen,
    title: "Knowledge Library",
    desc: "Curated articles, videos, and photo guides by Zimbabwe's top herpetologists. Safety education for every region.",
    accent: "warning",
    href: "/library",
    cta: "Explore",
  },
  {
    icon: ShoppingBag,
    title: "Safety Equipment",
    desc: "Professional snake traps, gaiters, handling tongs, restraint tubes and hooks — the same gear used by our expert team.",
    accent: "safe",
    href: "/shop",
    cta: "Shop Now",
  },
];

// Animated snake SVG
function SnakeSVG() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full max-w-lg opacity-90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <path
        d="M50 250 Q100 200 150 220 Q200 240 250 200 Q300 160 350 180 Q380 190 390 160"
        stroke="#22C55E"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
        className="drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]"
      />
      {/* Scale detail lines */}
      <path
        d="M50 250 Q100 200 150 220 Q200 240 250 200 Q300 160 350 180 Q380 190 390 160"
        stroke="#4ADE80"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 12"
        fill="none"
        opacity="0.6"
      />
      {/* Head */}
      <ellipse cx="392" cy="155" rx="16" ry="10" fill="#15803D" />
      <ellipse cx="392" cy="155" rx="14" ry="8" fill="#22C55E" />
      {/* Eye */}
      <circle cx="399" cy="151" r="3" fill="#030A05" />
      <circle cx="400" cy="150" r="1" fill="#F59E0B" />
      {/* Tongue */}
      <path d="M406 157 L416 153 M416 153 L421 149 M416 153 L421 156" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tail */}
      <path d="M50 250 Q30 265 20 255 Q15 250 22 245" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Ambient glow particles */}
      <circle cx="150" cy="220" r="2" fill="#4ADE80" opacity="0.4" />
      <circle cx="250" cy="200" r="2" fill="#4ADE80" opacity="0.4" />
      <circle cx="350" cy="180" r="2" fill="#4ADE80" opacity="0.3" />
    </svg>
  );
}

function SnakeScalePattern({ color = "green" }: { color?: string }) {
  const fill = color === "red" ? "rgba(239,68,68,0.03)" : "rgba(34,197,94,0.025)";
  const stroke = color === "red" ? "rgba(239,68,68,0.13)" : "rgba(34,197,94,0.11)";
  const rib = color === "red" ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.05)";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='20' viewBox='0 0 40 20'><path d='M20,0 L40,10 L20,20 L0,10 Z' fill='${fill}' stroke='${stroke}' stroke-width='0.7'/><line x1='20' y1='1' x2='20' y2='19' stroke='${rib}' stroke-width='0.5'/></svg>`;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundSize: "40px 20px",
      }}
    />
  );
}

export default function HomePage() {
  const [activeSnake, setActiveSnake] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveSnake((prev) => (prev + 1) % SNAKES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const snake = SNAKES[activeSnake];
  const danger = DANGER_CONFIG[snake.danger as keyof typeof DANGER_CONFIG];

  return (
    <div className="min-h-screen bg-void">

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <SnakeScalePattern />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-green text-venom text-xs font-semibold tracking-widest uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-venom animate-pulse" />
              Chawa's WildCatcher · Zimbabwe
            </div>

            <h1 className="font-display text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] mb-8">
              <span className="text-parchment">Know</span>
              <br />
              <span className="text-parchment">Your </span>
              <span className="text-venom text-glow-green">Snake.</span>
              <br />
              <span className="text-parchment text-5xl lg:text-6xl xl:text-7xl">Save Your Life.</span>
            </h1>

            <p className="text-mist/60 text-lg leading-relaxed max-w-lg mb-10">
              AI-powered instant identification for Zimbabwe's most dangerous snake species.
              Expert consultations, emergency response, and life-saving education — all in one platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/identify"
                className="group flex items-center gap-3 px-7 py-4 rounded-2xl bg-venom text-forest-950 font-bold text-sm tracking-wide hover:bg-venom-glow transition-all duration-300 shadow-lg shadow-venom/20 glow-green"
              >
                <Camera size={18} />
                Identify a Snake
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/emergency"
                className="flex items-center gap-3 px-7 py-4 rounded-2xl glass-red text-danger font-bold text-sm tracking-wide hover:glow-red transition-all duration-300 animate-glow-red"
              >
                <AlertTriangle size={18} />
                Emergency
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-14 pt-10 border-t border-forest-700">
              {[
                { n: "8", label: "Species Covered" },
                { n: "4", label: "Expert Herpetologists" },
                { n: "24/7", label: "Emergency Support" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-bold text-venom">{s.n}</div>
                  <div className="text-smoke text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — snake display */}
          <div className={`flex flex-col items-center gap-6 transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="relative w-full animate-float">
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
                style={{ background: snake.accent }} />
              <div className="glass rounded-3xl p-8 relative overflow-hidden">
                <SnakeScalePattern color={snake.danger === "CRITICAL" ? "red" : "green"} />
                <SnakeSVG />
              </div>
            </div>

            {/* Active snake info card */}
            <div className="w-full glass rounded-2xl p-5 transition-all duration-500">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-display text-xl font-bold text-parchment">{snake.name}</div>
                  <div className="text-smoke text-xs italic mt-0.5">{snake.sci}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${danger.cls}`}>
                  {danger.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-forest-800/50 rounded-xl p-3">
                  <div className="text-smoke text-xs mb-1">Max Length</div>
                  <div className="text-parchment font-semibold text-sm">{snake.length}</div>
                </div>
                <div className="bg-forest-800/50 rounded-xl p-3">
                  <div className="text-smoke text-xs mb-1">Venom</div>
                  <div className="text-parchment font-semibold text-sm">{snake.venom}</div>
                </div>
              </div>
              {/* Species indicator dots */}
              <div className="flex gap-1.5 mt-4 justify-center">
                {SNAKES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSnake(i)}
                    className={`rounded-full transition-all ${i === activeSnake ? "w-5 h-2 bg-venom" : "w-2 h-2 bg-forest-600 hover:bg-forest-400"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────── */}
      <section className="relative py-24 bg-forest-950 scales-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-void to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-parchment mb-4">
              Everything You Need to Stay Safe
            </h2>
            <p className="text-smoke text-lg max-w-xl mx-auto">
              From instant AI identification to emergency response — Chawa's WildCatcher has you covered across Zimbabwe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              const accentColors: Record<string, string> = {
                venom: "#22C55E",
                safe: "#A78BFA",
                danger: "#EF4444",
                warning: "#F59E0B",
              };
              const ac = accentColors[f.accent];
              return (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group glass rounded-2xl p-6 flex flex-col gap-5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
                  style={{ "--accent": ac } as React.CSSProperties}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${ac}18`, border: `1px solid ${ac}30` }}
                  >
                    <Icon size={22} style={{ color: ac }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-parchment mb-2 group-hover:text-white transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-smoke text-sm leading-relaxed">{f.desc}</p>
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs font-semibold mt-auto group-hover:gap-2 transition-all"
                    style={{ color: ac }}
                  >
                    {f.cta} <ChevronRight size={13} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SPECIES ENCYCLOPEDIA ─────────────────────── */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-venom text-xs font-semibold tracking-widest uppercase mb-3">
                Know Them All
              </div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-parchment">
                Zimbabwe's 8 Species
              </h2>
            </div>
            <Link
              href="/library"
              className="hidden md:flex items-center gap-2 text-venom text-sm font-semibold hover:gap-3 transition-all"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex gap-4 overflow-x-auto snap-scroll px-6 pb-6 md:px-6">
          {SNAKES.map((snake) => {
            const d = DANGER_CONFIG[snake.danger as keyof typeof DANGER_CONFIG];
            return (
              <Link
                key={snake.id}
                href={`/library/${snake.id}`}
                className={`flex-none w-64 snap-start glass rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
              >
                {/* Color header */}
                <div
                  className="h-28 relative overflow-hidden flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${snake.accent}20 0%, ${snake.accent}05 100%)` }}
                >
                  <SnakeScalePattern color={snake.danger === "CRITICAL" ? "red" : "green"} />
                  {/* Silhouette placeholder */}
                  <svg viewBox="0 0 120 80" className="w-28 opacity-60" fill="none">
                    <path
                      d="M10 70 Q30 50 50 60 Q70 70 90 50 Q105 35 115 40"
                      stroke={snake.accent}
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <ellipse cx="116" cy="38" rx="7" ry="4.5" fill={snake.accent} opacity="0.8" />
                  </svg>
                  <div
                    className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: `${snake.accent}20`,
                      border: `1px solid ${snake.accent}40`,
                      color: snake.accent,
                    }}
                  >
                    {d.label}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-parchment text-sm mb-0.5 group-hover:text-venom transition-colors">
                    {snake.name}
                  </h3>
                  <p className="text-smoke text-xs italic mb-3">{snake.sci}</p>
                  <div className="flex justify-between text-xs text-smoke/70">
                    <span>Max {snake.length}</span>
                    <span>{snake.venom}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── EMERGENCY SECTION ────────────────────────── */}
      <section className="relative py-24 overflow-hidden bg-forest-950 danger-scales-bg">
        <div className="absolute inset-0 bg-danger-gradient" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-red text-danger text-sm font-bold tracking-widest uppercase mb-8 animate-pulse">
            <AlertTriangle size={14} />
            Emergency Protocol
          </div>
          <h2 className="font-display text-5xl lg:text-6xl font-black text-parchment mb-6">
            Snake Encounter?
            <br />
            <span className="text-danger">Act Fast.</span>
          </h2>
          <p className="text-mist/50 text-lg mb-12 max-w-2xl mx-auto">
            Our emergency system connects you to on-call experts within seconds.
            Share your location and encounter details — we guide you through every step.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-12 text-left">
            {[
              { step: "01", title: "Hit Emergency", desc: "One tap activates the emergency protocol and shares your GPS." },
              { step: "02", title: "Describe Encounter", desc: "Voice or text — describe what happened and whether you were bitten." },
              { step: "03", title: "Expert Guides You", desc: "An on-call expert provides real-time, step-by-step guidance." },
            ].map((s) => (
              <div key={s.step} className="glass-red rounded-2xl p-5">
                <div className="font-mono text-danger/50 text-xs font-bold mb-2">{s.step}</div>
                <div className="font-semibold text-parchment mb-1">{s.title}</div>
                <div className="text-smoke text-sm">{s.desc}</div>
              </div>
            ))}
          </div>

          <Link
            href="/emergency"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-danger text-white font-black text-lg tracking-wide hover:bg-danger/90 transition-all glow-red animate-glow-red shadow-2xl shadow-danger/30"
          >
            <AlertTriangle size={22} />
            EMERGENCY BUTTON
          </Link>
        </div>
      </section>

      {/* ─── EXPERTS PREVIEW ──────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-venom text-xs font-semibold tracking-widest uppercase mb-3">Our Team</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-parchment mb-4">
              Zimbabwe's Top Experts
            </h2>
            <p className="text-smoke max-w-lg mx-auto">
              Herpetologists, emergency toxicologists, and wildlife rescue specialists — ready to help you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { initials: "TM", name: "Dr. Tendai Moyo", title: "Senior Herpetologist", rating: 4.9, consultations: 847, location: "Harare", available: true },
              { initials: "SN", name: "Sibongile Ncube", title: "Wildlife Rescue Specialist", rating: 4.8, consultations: 623, location: "Bulawayo", available: true },
              { initials: "MF", name: "Marcus Fitzgerald", title: "Emergency Toxicologist", rating: 4.95, consultations: 1204, location: "Harare", available: false },
              { initials: "RC", name: "Ruvimbo Chikwanda", title: "Conservation Educator", rating: 4.7, consultations: 312, location: "Mutare", available: true },
            ].map((e) => (
              <div key={e.name} className="glass rounded-2xl p-5 group hover:border-venom/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-venom/10 border border-venom/20 flex items-center justify-center font-display font-bold text-venom text-lg">
                    {e.initials}
                  </div>
                  <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${e.available ? "bg-venom/10 text-venom border border-venom/20" : "bg-smoke/10 text-smoke border border-smoke/20"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${e.available ? "bg-venom animate-pulse" : "bg-smoke"}`} />
                    {e.available ? "Available" : "Busy"}
                  </div>
                </div>
                <h3 className="font-semibold text-parchment text-sm mb-0.5">{e.name}</h3>
                <p className="text-smoke text-xs mb-4">{e.title}</p>
                <div className="flex items-center gap-3 text-xs text-smoke/70">
                  <span className="flex items-center gap-1"><Star size={10} className="text-warning" />{e.rating}</span>
                  <span>{e.consultations} sessions</span>
                </div>
                <div className="flex items-center gap-1 text-smoke/50 text-xs mt-1">
                  <MapPin size={10} />{e.location}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl glass-green text-venom font-semibold text-sm hover:glow-green transition-all"
            >
              Book a Consultation <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FIRST AID QUICK REFERENCE ────────────────── */}
      <section className="py-24 bg-void">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/30 text-warning text-sm font-bold tracking-widest uppercase mb-6">
              <Heart size={14} /> First Aid Reference
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-parchment mb-4">
              If You're Bitten in Zimbabwe
            </h2>
            <p className="text-smoke max-w-xl mx-auto">
              Know these steps before a snake is ever near you. In a crisis, seconds matter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* DO column */}
            <div className="glass rounded-3xl p-8 border border-venom/15">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-venom/15 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-venom" />
                </div>
                <h3 className="font-display text-xl font-bold text-venom">DO</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Stay calm — panic speeds venom spread through the bloodstream",
                  "Immobilise the bitten limb at or below heart level",
                  "Remove rings, watches, tight clothing near the bite",
                  "Mark the bite site with a pen and note the exact time",
                  "Get to the nearest hospital immediately — don't wait for symptoms",
                  "Call Zimbabwe emergency services: 999 / 04-994301",
                  "If you safely can, photograph the snake from a distance for ID",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-smoke leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-venom/15 text-venom flex-none flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* DO NOT column */}
            <div className="glass rounded-3xl p-8 border border-danger/15">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center">
                  <XCircle size={20} className="text-danger" />
                </div>
                <h3 className="font-display text-xl font-bold text-danger">DO NOT</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Cut the wound or attempt to suck out venom — this does not work",
                  "Apply a tourniquet — cuts off blood flow and causes tissue death",
                  "Apply ice or cold water to the bite",
                  "Give aspirin, ibuprofen or alcohol — these thin the blood",
                  "Try to catch or kill the snake — causes more bites",
                  "Drive yourself to hospital if you feel dizzy or weak",
                  "Wait to see if symptoms develop before seeking medical help",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-smoke leading-relaxed">
                    <XCircle size={14} className="text-danger/60 flex-none mt-0.5" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Spitting cobra eye protocol */}
          <div className="glass-red rounded-2xl p-6 border border-warning/25 max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Eye size={16} className="text-warning" />
              <span className="text-warning font-bold text-sm uppercase tracking-wide">Spitting Cobra or Rinkhals — Venom in Eyes</span>
            </div>
            <p className="text-smoke text-sm leading-relaxed">
              Flush immediately with large volumes of clean water for <strong className="text-parchment">15–20 minutes</strong>.
              Do NOT rub. Seek hospital urgently — venom causes permanent corneal damage if untreated within hours.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SAFETY EDUCATION ─────────────────────────── */}
      <section className="py-24 bg-forest-950 scales-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-void to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-green text-venom text-sm font-bold tracking-widest uppercase mb-6">
              <GraduationCap size={14} /> Safety Education
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-parchment mb-4">
              Know Before You Encounter
            </h2>
            <p className="text-smoke max-w-xl mx-auto">
              Zimbabwe's landscapes are rich with wildlife. The more you know, the safer your family stays.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: "Snake Awareness",
                desc: "Learn to identify the 8 species found across Zimbabwe's provinces — from Harare suburbs to the Lowveld. Understand their habitats, seasonal activity, and warning signs.",
                topics: ["Species ID", "Regional habitats", "Seasonal patterns", "Body language"],
                accent: "#22C55E",
                href: "/library",
                cta: "Explore Library",
              },
              {
                icon: Heart,
                title: "Snakebite First Aid",
                desc: "Life-saving protocols for every venom type found in Zimbabwe — cytotoxic, neurotoxic, and haemotoxic. Critical knowledge for farmers, parents, hikers, and rural communities.",
                topics: ["Venom types", "Immobilisation", "Hospital protocols", "Antivenom"],
                accent: "#F59E0B",
                href: "/library",
                cta: "Learn First Aid",
              },
              {
                icon: Bug,
                title: "Property Safety",
                desc: "Reduce snake encounters on your property. Understand what attracts snakes, how to secure your home, and when to call a professional for removal or assessment.",
                topics: ["Habitat reduction", "Entry point sealing", "Removal vs. DIY", "Safe gardens"],
                accent: "#A78BFA",
                href: "/book",
                cta: "Book Assessment",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="glass rounded-2xl p-7 flex flex-col group hover:border-white/15 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${card.accent}18`, border: `1px solid ${card.accent}30` }}
                  >
                    <Icon size={22} style={{ color: card.accent }} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-parchment mb-3">{card.title}</h3>
                  <p className="text-smoke text-sm leading-relaxed mb-5">{card.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {card.topics.map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-forest-800/60 text-smoke/70 border border-forest-700">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={card.href}
                    className="mt-auto flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
                    style={{ color: card.accent }}
                  >
                    {card.cta} <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Zimbabwe-specific note */}
          <div className="mt-12 glass rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-venom/10 border border-venom/20 flex items-center justify-center flex-none">
              <Phone size={20} className="text-venom" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="font-semibold text-parchment mb-1">Zimbabwe Emergency Contacts</div>
              <div className="text-smoke text-sm">
                Emergency Services: <span className="text-parchment font-mono">999</span> &nbsp;·&nbsp;
                Harare Hospital: <span className="text-parchment font-mono">04-994301</span> &nbsp;·&nbsp;
                Mpilo Hospital (Bulawayo): <span className="text-parchment font-mono">09-72111</span> &nbsp;·&nbsp;
                Poison Control: <span className="text-parchment font-mono">04-791631</span>
              </div>
            </div>
            <Link
              href="/emergency"
              className="flex-none flex items-center gap-2 px-5 py-2.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-bold hover:bg-danger/20 transition-all"
            >
              <AlertTriangle size={14} /> Emergency
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer className="bg-forest-950 border-t border-forest-700 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-none gap-px">
                <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-smoke/50">Chawa's</span>
                <span className="font-display text-lg font-black leading-none">
                  <span className="text-parchment">Wild</span><span className="text-venom">Catcher</span>
                </span>
              </div>
              <span className="text-smoke text-sm">Zimbabwe's Snake Intelligence Platform</span>
            </div>
            <div className="flex gap-8 text-sm text-smoke/60">
              {["Identify", "Library", "Consult", "Shop", "Emergency"].map((l) => (
                <Link
                  key={l}
                  href={`/${l.toLowerCase()}`}
                  className="hover:text-venom transition-colors"
                >
                  {l}
                </Link>
              ))}
            </div>
            <div className="text-smoke/40 text-xs">
              Built for Zimbabwe. Powered by AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
