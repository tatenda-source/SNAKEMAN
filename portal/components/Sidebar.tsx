"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  AlertTriangle,
  BookOpen,
  Users,
  Settings,
  LogOut,
  ShoppingBag,
} from "lucide-react";

const NAV = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/bookings", icon: CalendarDays, label: "Bookings" },
  { href: "/emergency", icon: AlertTriangle, label: "Emergency", badge: true },
  { href: "/orders", icon: ShoppingBag, label: "Orders" },
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
          <Image
            src="/logo.jpg"
            alt="chawaswildadventures"
            width={140}
            height={42}
            className="h-9 w-auto object-contain"
          />
        </div>
        <div className="text-text-muted text-[10px] tracking-wide uppercase mt-2">Expert Portal</div>
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
