"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  AlertTriangle,
  BookOpen,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/bookings", icon: CalendarDays, label: "Bookings" },
  { href: "/emergency", icon: AlertTriangle, label: "Emergency", badge: true },
  { href: "/content", icon: BookOpen, label: "Content" },
  { href: "/experts", icon: Users, label: "Experts" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-none panel border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path
                d="M12 2C7 2 2 7 2 12s5 10 10 10c2 0 4-2 5-4 1 2 2 4 4 4-1.5-3-1.5-6 0-9-3 1.5-6 1.5-7.5-1.5S13 5 16 3c-1.5 3 0 6 3 6s4.5-3 3-6"
                stroke="#22C55E"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide text-text-primary">
              SNAKE<span className="text-accent">MAN</span>
            </div>
            <div className="text-text-muted text-[10px] tracking-wide uppercase">Expert Portal</div>
          </div>
        </div>
      </div>

      {/* Expert info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent text-sm">
            U
          </div>
          <div className="min-w-0">
            <div className="text-text-primary text-sm font-medium truncate">Usher</div>
            <div className="flex items-center gap-1 text-[10px] text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                active
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-text-muted hover:text-text-primary hover:bg-white/3"
              }`}
            >
              <Icon size={16} className={active ? "text-accent" : "text-text-muted group-hover:text-text-primary"} />
              {label}
              {badge && (
                <span className="ml-auto w-2 h-2 rounded-full bg-danger animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border space-y-1">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-white/3 transition-all">
          <Settings size={16} /> Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-danger hover:bg-danger/5 transition-all">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
