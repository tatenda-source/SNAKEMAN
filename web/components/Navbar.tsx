"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

        {/* ── LOGO ── */}
        <Link href="/" className="flex items-center gap-2 group flex-none">
          <Image
            src="/logo.jpg"
            alt="chawaswildadventures"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* ── DESKTOP NAV ── */}
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

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl glass text-parchment/80 hover:text-venom transition-colors"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
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
