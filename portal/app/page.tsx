"use client";

import { useState } from "react";
import {
  CalendarDays,
  AlertTriangle,
  Users,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const STAT_CARDS = [
  { label: "Total Bookings", value: "142", change: "+12 this week", icon: CalendarDays, color: "#DC2626", bg: "rgba(220,38,38,0.08)" },
  { label: "Active Emergencies", value: "4", change: "3 require attention", icon: AlertTriangle, color: "#EF4444", bg: "rgba(239,68,68,0.08)", urgent: true },
  { label: "Consultations Done", value: "847", change: "+23 this month", icon: CheckCircle2, color: "#60A5FA", bg: "rgba(96,165,250,0.08)" },
  { label: "Library Views", value: "12.4k", change: "+8% vs last month", icon: Eye, color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
];

const RECENT_BOOKINGS = [
  { id: "A3F2B1", user: "Tatenda Moyo", date: "2026-03-06", time: "09:00", status: "CONFIRMED", reason: "Snake in garden" },
  { id: "B7D4E2", user: "Nomsa Dube", date: "2026-03-06", time: "11:00", status: "PENDING", reason: "Identification help" },
  { id: "C1A9F3", user: "James Mutizwa", date: "2026-03-07", time: "14:00", status: "PENDING", reason: "Educational consultation" },
  { id: "D5K2L8", user: "Rudo Chikomo", date: "2026-03-07", time: "09:00", status: "CONFIRMED", reason: "Post-bite follow-up" },
  { id: "E9M3N4", user: "Patrick Sibanda", date: "2026-03-08", time: "10:00", status: "CANCELLED", reason: "Property inspection" },
];

const ACTIVE_EMERGENCIES = [
  { id: "EMG-143212", description: "Black mamba spotted behind wardrobe in bedroom. About 2.5m, spreading hood.", location: "Borrowdale, Harare", time: "3 min ago", bitten: false },
  { id: "EMG-125048", description: "Puff adder bite on right foot. Severe swelling, intense pain.", location: "Chitungwiza", time: "18 min ago", bitten: true },
  { id: "EMG-103924", description: "4m python found sleeping under car. Professional removal needed.", location: "Kariba Heights", time: "42 min ago", bitten: false },
  { id: "EMG-074312", description: "Spitting cobra sprayed venom in eye. Eye burning. Snake still in kitchen.", location: "Marondera", time: "1h 49m ago", bitten: false },
];

const CHART_DATA = [
  { day: "Mon", bookings: 8, emergencies: 2 },
  { day: "Tue", bookings: 12, emergencies: 1 },
  { day: "Wed", bookings: 6, emergencies: 4 },
  { day: "Thu", bookings: 15, emergencies: 2 },
  { day: "Fri", bookings: 18, emergencies: 3 },
  { day: "Sat", bookings: 9, emergencies: 1 },
  { day: "Sun", bookings: 4, emergencies: 0 },
];

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: "Confirmed", cls: "bg-accent/10 text-accent border border-accent/20" },
  PENDING: { label: "Pending", cls: "bg-warning/10 text-warning border border-warning/20" },
  CANCELLED: { label: "Cancelled", cls: "bg-danger/10 text-danger border border-danger/20" },
  COMPLETED: { label: "Completed", cls: "bg-info/10 text-info border border-info/20" },
};

export default function DashboardPage() {
  const [currentTime] = useState(
    new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Good morning, Usher</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Thursday, 5 March 2026 · {currentTime}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-danger/10 border border-danger/25 text-danger text-xs font-semibold animate-pulse-slow">
          <AlertTriangle size={13} /> 4 Active Emergencies
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`panel rounded-2xl p-5 ${s.urgent ? "border-danger/30" : ""}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: s.bg }}
                >
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                {s.urgent && (
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                )}
              </div>
              <div className="text-2xl font-bold text-text-primary mb-1">{s.value}</div>
              <div className="text-text-muted text-xs">{s.label}</div>
              <div className="text-[11px] mt-2" style={{ color: s.color }}>{s.change}</div>
            </div>
          );
        })}
      </div>

      {/* Chart + Emergencies */}
      <div className="grid grid-cols-5 gap-5">
        {/* Chart */}
        <div className="col-span-3 panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-text-primary">Weekly Activity</h2>
              <p className="text-text-muted text-xs mt-0.5">Bookings vs Emergencies</p>
            </div>
            <TrendingUp size={16} className="text-text-muted" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEmergencies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#161B24", border: "1px solid #1E2739", borderRadius: "8px", color: "#E2E8F0" }}
                labelStyle={{ color: "#64748B" }}
              />
              <Area type="monotone" dataKey="bookings" stroke="#DC2626" strokeWidth={2} fill="url(#colorBookings)" name="Bookings" />
              <Area type="monotone" dataKey="emergencies" stroke="#EF4444" strokeWidth={2} fill="url(#colorEmergencies)" name="Emergencies" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Active Emergencies */}
        <div className="col-span-2 panel rounded-2xl p-5 border-danger/20">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <AlertTriangle size={15} className="text-danger" /> Active
            </h2>
            <span className="text-xs text-danger font-semibold">{ACTIVE_EMERGENCIES.length} open</span>
          </div>
          <div className="space-y-3">
            {ACTIVE_EMERGENCIES.map((e) => (
              <div
                key={e.id}
                className="rounded-xl p-3 border transition-all hover:border-danger/30 cursor-pointer"
                style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.15)" }}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="text-xs font-mono text-danger/70">{e.id}</div>
                  <div className="flex items-center gap-1 text-[10px] text-text-muted">
                    <Clock size={9} />{e.time}
                  </div>
                </div>
                <p className="text-text-primary text-xs leading-snug mb-2 line-clamp-2">{e.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-[10px]">{e.location}</span>
                  {e.bitten && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger text-white font-bold">
                      BITTEN
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="panel rounded-2xl">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Recent Bookings</h2>
          <a href="/bookings" className="text-accent text-xs hover:underline">View all</a>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["ID", "Client", "Date & Time", "Reason", "Status", ""].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {RECENT_BOOKINGS.map((b) => {
              const s = STATUS_CONFIG[b.status];
              return (
                <tr key={b.id} className="hover:bg-white/1 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-text-muted">{b.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">{b.user}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {b.date} · <span className="text-text-primary font-medium">{b.time}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted max-w-[180px] truncate">{b.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${s.cls}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary">
                      <MoreHorizontal size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
