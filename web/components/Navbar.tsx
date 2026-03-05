"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, AlertTriangle } from "lucide-react";

const navLinks = [
  { href: "/identify", label: "Identify" },
  { href: "/library", label: "Library" },
  { href: "/book", label: "Consult" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-forest-950/92 backdrop-blur-md border-b border-venom/10 shadow-lg shadow-black/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* ── GRAFFITI LOGO ── */}
        <Link href="/" className="flex items-center gap-2 group flex-none">
          {/* Tag-style snake icon — thick outer stroke (shadow), bright inner stroke */}
          <div className="relative w-9 h-9 flex-none">
            <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
              {/* Dark outer stroke for graffiti outline depth */}
              <path
                d="M18 3C10 3 3 10 3 18s7 15 15 15c3 0 5-2 6-5 1 3 3 5 6 5-2-4-2-9 0-13-4 2-8 2-10-2s0-9 4-11c-2 4 0 9 4 9s6-4 4-9c4 2 4 9 0 13"
                stroke="#020c04"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Bright venom stroke on top */}
              <path
                d="M18 3C10 3 3 10 3 18s7 15 15 15c3 0 5-2 6-5 1 3 3 5 6 5-2-4-2-9 0-13-4 2-8 2-10-2s0-9 4-11c-2 4 0 9 4 9s6-4 4-9c4 2 4 9 0 13"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]"
              />
              {/* Eye */}
              <circle cx="11" cy="14" r="2.5" fill="#020c04" />
              <circle cx="11" cy="14" r="1.5" fill="#22C55E" />
              <circle cx="11.5" cy="13.5" r="0.5" fill="#F59E0B" />
            </svg>
          </div>

          {/* Graffiti wordmark — italic, stroked, skewed */}
          <div className="flex flex-col leading-none" style={{ transform: "skewX(-7deg)" }}>
            <span
              className="text-[8px] font-black uppercase tracking-[0.25em] text-smoke/60 select-none"
              style={{ fontStyle: "italic" }}
            >
              Chawa's
            </span>
            <span
              className="font-display font-black text-[19px] leading-none tracking-tight"
              style={{
                fontStyle: "italic",
                WebkitTextStroke: "1.5px #020c04",
                textShadow: "2px 3px 0 rgba(0,0,0,0.85), 0 0 22px rgba(34,197,94,0.35)",
              }}
            >
              <span className="text-parchment">Wild</span>
              <span className="text-venom">Catcher</span>
            </span>
          </div>
        </Link>

        {/* ── DESKTOP NAV (≥1024px) ── */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-venom ${
                pathname === link.href ? "text-venom" : "text-mist/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── EMERGENCY + HAMBURGER ── */}
        <div className="flex items-center gap-3 flex-none">
          <Link
            href="/emergency"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-danger/10 border border-danger/40 text-danger text-xs font-bold hover:bg-danger/20 hover:border-danger/70 transition-all"
          >
            <AlertTriangle size={12} />
            <span className="hidden md:inline">EMERGENCY</span>
            <span className="md:hidden">SOS</span>
          </Link>

          {/* Hamburger — shows below lg */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl glass text-parchment/80 hover:text-venom transition-colors"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU (below lg) ── */}
      {open && (
        <div className="lg:hidden bg-forest-950/98 backdrop-blur-xl border-b border-venom/10">
          <div className="px-6 py-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center text-base font-medium py-3 border-b border-forest-700/50 transition-colors hover:text-venom hover:pl-2 ${
                  pathname === link.href ? "text-venom" : "text-mist/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/emergency"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 mt-3 px-4 py-3.5 rounded-xl bg-danger/10 border border-danger/40 text-danger font-bold text-sm"
            >
              <AlertTriangle size={16} />
              EMERGENCY
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
