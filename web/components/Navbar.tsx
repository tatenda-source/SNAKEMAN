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
          ? "bg-forest-950/90 backdrop-blur-md border-b border-venom/10 shadow-lg shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <path
                d="M16 2C8 2 2 8 2 16s6 14 14 14c3 0 5-2 6-4 1 2 3 4 6 4-2-4-2-8 0-12-4 2-8 2-10-2s0-8 4-10c-2 4 0 8 4 8s6-4 4-8c4 2 4 8 0 12"
                stroke="#22C55E"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="10" cy="12" r="1.5" fill="#22C55E" />
            </svg>
          </div>
          <span className="text-xl font-display font-bold tracking-wide text-parchment group-hover:text-venom transition-colors">
            SNAKE<span className="text-venom">MAN</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Emergency CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/emergency"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 border border-danger/40 text-danger text-sm font-semibold hover:bg-danger/20 hover:border-danger/70 transition-all animate-pulse-slow"
          >
            <AlertTriangle size={14} />
            EMERGENCY
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-parchment/80 hover:text-venom transition-colors"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-forest-950/98 backdrop-blur-xl border-b border-venom/10">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-base font-medium py-2 border-b border-forest-700 transition-colors hover:text-venom ${
                  pathname === link.href ? "text-venom" : "text-mist/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/emergency"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl bg-danger/10 border border-danger/40 text-danger font-bold text-center"
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
