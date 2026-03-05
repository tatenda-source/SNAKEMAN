"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Instagram,
  Shield,
  Award,
  Star,
  MapPin,
  ChevronRight,
  Zap,
  Eye,
  Heart,
} from "lucide-react";

const STATS = [
  { n: "12+", label: "Years in the field" },
  { n: "800+", label: "Snakes handled" },
  { n: "3", label: "Provinces covered" },
  { n: "0", label: "Fatalities on his watch" },
];

const CREDENTIALS = [
  {
    icon: Shield,
    title: "Certified Snake Handler",
    body: "Licensed by Zimbabwe Parks & Wildlife Management Authority for capture, relocation, and handling of all native venomous species.",
    accent: "#22C55E",
  },
  {
    icon: Award,
    title: "Herpetology Training",
    body: "Advanced field training under Zimbabwe's foremost herpetologists, with specialist study in African elapids and vipers.",
    accent: "#A78BFA",
  },
  {
    icon: Eye,
    title: "Wildlife Educator",
    body: "Conducts community education drives across Harare, Bulawayo, and Mutare — teaching safe co-existence with Zimbabwe's wild neighbours.",
    accent: "#F59E0B",
  },
  {
    icon: Heart,
    title: "Conservation Advocate",
    body: "Fierce defender of non-lethal relocation. Every snake caught is moved to suitable habitat — not a single one unnecessarily harmed.",
    accent: "#EF4444",
  },
];

const HIGHLIGHTS = [
  "Captured a 4.2m African Rock Python from a Borrowdale rooftop — bare-handed, zero drama.",
  "Extracted a Black Mamba from a primary school classroom in under 8 minutes, school back in session the same morning.",
  "Featured in Zimbabwe Herald for record-breaking spitting cobra removal from a Harare CBD office block.",
  "Trained 200+ homeowners in Puff Adder identification and safe-distance protocol.",
  "First responder for snakebite victims across 3 provinces, coordinating anti-venom logistics in under 20 minutes.",
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-void pt-20">

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient opacity-60" />
        {/* Diamond scale pattern */}
        <div className="absolute inset-0 scales-bg pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6">
          <div className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-green text-venom text-xs font-semibold tracking-widest uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-venom animate-pulse" />
              The Man Behind the Catch
            </div>

            {/* Main hero layout */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left — Text */}
              <div>
                <h1 className="font-display text-6xl lg:text-7xl font-black leading-[0.9] mb-6">
                  <span className="text-parchment">Meet</span>
                  <br />
                  <span className="text-venom text-glow-green">Chawa.</span>
                </h1>
                <p className="text-mist/70 text-lg leading-relaxed mb-6">
                  Zimbabwe's most fearless wildlife handler. When everyone else runs, Chawa walks toward it —
                  camera in one hand, tongs in the other, grinning the whole time.
                </p>
                <p className="text-smoke text-base leading-relaxed mb-8">
                  Founder of <span className="text-venom font-semibold">Chawa's Wild Adventures</span>, he has spent over a decade in the field
                  catching, relocating, and educating Zimbabweans about the country's most misunderstood
                  creatures. His philosophy is simple: every snake has a right to live, every human has a right
                  to feel safe, and there is no reason those two things can't coexist.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.instagram.com/chawaswildadventures"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl glass-green text-venom font-semibold text-sm hover:glow-green transition-all"
                  >
                    <Instagram size={16} />
                    @chawaswildadventures
                  </a>
                  <Link
                    href="/book"
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl glass text-parchment font-semibold text-sm hover:border-venom/30 transition-all"
                  >
                    Book a Session <ChevronRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Right — Avatar card */}
              <div className={`transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <div className="glass rounded-3xl p-8 relative overflow-hidden">
                  {/* Scale bg */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cellipse cx='20' cy='20' rx='18' ry='13' fill='none' stroke='%2322C55E' stroke-width='0.5'/%3E%3C/svg%3E")`,
                      backgroundSize: "40px 40px",
                    }}
                  />
                  {/* Avatar */}
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-36 h-36 rounded-3xl bg-venom/10 border-2 border-venom/30 flex items-center justify-center mb-5 glow-green">
                      <span className="font-display text-6xl font-black text-venom">C</span>
                    </div>
                    <div className="font-display text-3xl font-black text-parchment mb-1">Chawa</div>
                    <div className="text-venom text-sm font-semibold mb-1">Founder & Lead Handler</div>
                    <div className="text-smoke text-xs flex items-center gap-1 mb-6">
                      <MapPin size={11} /> Harare, Zimbabwe
                    </div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-6">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} size={14} className="text-warning fill-warning" />
                      ))}
                      <span className="text-smoke text-xs ml-1">5.0 · 312 sessions</span>
                    </div>
                    {/* Availability */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-venom/10 border border-venom/20 text-venom text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-venom animate-pulse" />
                      Available for callouts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────── */}
      <section className="py-16 border-y border-forest-700 bg-forest-950/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-5xl font-black text-venom text-glow-green mb-2">{s.n}</div>
                <div className="text-smoke text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CREDENTIALS ───────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-venom text-xs font-semibold tracking-widest uppercase mb-3">Why Trust Chawa</div>
            <h2 className="font-display text-4xl font-bold text-parchment">
              Credentials & Expertise
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {CREDENTIALS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="glass rounded-2xl p-6">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}30` }}
                  >
                    <Icon size={20} style={{ color: c.accent }} />
                  </div>
                  <h3 className="font-semibold text-parchment mb-2">{c.title}</h3>
                  <p className="text-smoke text-sm leading-relaxed">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HIGHLIGHT REEL ────────────────────────────── */}
      <section className="py-24 bg-forest-950/60">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-venom text-xs font-semibold tracking-widest uppercase mb-3">The Legend in Action</div>
            <h2 className="font-display text-4xl font-bold text-parchment">Career Highlights</h2>
          </div>
          <div className="space-y-4">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="glass rounded-2xl px-6 py-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-venom/10 border border-venom/20 flex items-center justify-center flex-none mt-0.5">
                  <Zap size={14} className="text-venom" />
                </div>
                <p className="text-smoke text-sm leading-relaxed">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-venom/3 rounded-3xl" />
            <div className="relative">
              <div className="font-display text-4xl font-bold text-parchment mb-4">
                Ready to Work with Chawa?
              </div>
              <p className="text-smoke text-lg mb-8 max-w-lg mx-auto">
                Whether you need a snake removed, your property assessed, or a full fumigation —
                book directly with Zimbabwe's most trusted handler.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/book"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-venom text-forest-950 font-bold text-sm glow-green hover:bg-venom-glow transition-all"
                >
                  Book a Session <ChevronRight size={16} />
                </Link>
                <Link
                  href="/emergency"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl glass-red text-danger font-bold text-sm hover:glow-red transition-all"
                >
                  Emergency Callout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
