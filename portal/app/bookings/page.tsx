"use client";

import { useState } from "react";
import { CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle, MoreHorizontal, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

const ALL_BOOKINGS = [
  { id: "A3F2B1", user: "Tatenda Moyo", email: "t.moyo@gmail.com", phone: "+263771234567", date: "2026-03-06", time: "09:00", status: "CONFIRMED", reason: "Snake found in garden — need removal advice", location: "Borrowdale, Harare", snake_concern: "Puff Adder" },
  { id: "B7D4E2", user: "Nomsa Dube", email: "n.dube@gmail.com", phone: "+263772345678", date: "2026-03-06", time: "11:00", status: "PENDING", reason: "Photo identification help", location: "Bulawayo CBD", snake_concern: "Unknown" },
  { id: "C1A9F3", user: "James Mutizwa", email: "j.mutizwa@yahoo.com", phone: "+263773456789", date: "2026-03-07", time: "14:00", status: "PENDING", reason: "Educational consultation for school", location: "Mutare", snake_concern: null },
  { id: "D5K2L8", user: "Rudo Chikomo", email: "r.chikomo@gmail.com", phone: "+263774567890", date: "2026-03-07", time: "09:00", status: "CONFIRMED", reason: "Post-bite follow-up — recovering from puff adder bite", location: "Gweru", snake_concern: "Puff Adder" },
  { id: "E9M3N4", user: "Patrick Sibanda", email: "p.sibanda@gmail.com", phone: "+263775678901", date: "2026-03-08", time: "10:00", status: "CANCELLED", reason: "Property inspection before purchase", location: "Masvingo", snake_concern: null },
  { id: "F2P6Q7", user: "Grace Mudyanadzo", email: "grace.m@hotmail.com", phone: "+263776789012", date: "2026-03-09", time: "11:00", status: "COMPLETED", reason: "Identification of shed snake skin", location: "Harare North", snake_concern: "Boomslang" },
];

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  CONFIRMED: { label: "Confirmed", cls: "bg-accent/10 text-accent border border-accent/20", icon: CheckCircle2 },
  PENDING: { label: "Pending", cls: "bg-warning/10 text-warning border border-warning/20", icon: AlertCircle },
  CANCELLED: { label: "Cancelled", cls: "bg-danger/10 text-danger border border-danger/20", icon: XCircle },
  COMPLETED: { label: "Completed", cls: "bg-info/10 text-info border border-info/20", icon: CheckCircle2 },
};

export default function BookingsPage() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = ALL_BOOKINGS.filter((b) => {
    if (filter !== "ALL" && b.status !== filter) return false;
    if (search && !b.user.toLowerCase().includes(search.toLowerCase()) && !b.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedBooking = ALL_BOOKINGS.find((b) => b.id === selected);

  const handleConfirm = (id: string) => {
    toast.success(`Booking ${id} confirmed. User notified.`);
  };
  const handleCancel = (id: string) => {
    toast.error(`Booking ${id} cancelled.`);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Bookings</h1>
          <p className="text-text-muted text-sm mt-0.5">{ALL_BOOKINGS.length} total · {ALL_BOOKINGS.filter(b => b.status === "PENDING").length} pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 panel rounded-xl px-4 py-2.5 border border-border max-w-xs">
          <Search size={14} className="text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
          />
        </div>
        {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === s ? "bg-accent/10 text-accent border border-accent/20" : "panel text-text-muted hover:text-text-primary"}`}
          >
            {s === "ALL" ? "All" : STATUS_CONFIG[s]?.label}
          </button>
        ))}
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* Table */}
        <div className="flex-1 panel rounded-2xl overflow-hidden flex flex-col min-h-0">
          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-panel">
                <tr className="border-b border-border">
                  {["ID", "Client", "Date & Time", "Concern", "Status", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((b) => {
                  const s = STATUS_CONFIG[b.status];
                  const SIcon = s.icon;
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelected(b.id === selected ? null : b.id)}
                      className={`cursor-pointer transition-colors hover:bg-white/2 ${selected === b.id ? "bg-accent/5" : ""}`}
                    >
                      <td className="px-5 py-3.5 font-mono text-xs text-text-muted">{b.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium text-text-primary">{b.user}</div>
                        <div className="text-[11px] text-text-muted">{b.email}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-muted">
                        <div className="flex items-center gap-1"><CalendarDays size={11} />{b.date}</div>
                        <div className="flex items-center gap-1 mt-0.5"><Clock size={11} />{b.time}</div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-text-muted max-w-[140px] truncate">{b.snake_concern || "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 w-fit ${s.cls}`}>
                          <SIcon size={10} />{s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {b.status === "PENDING" && (
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleConfirm(b.id); }}
                              className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCancel(b.id); }}
                              className="px-2 py-1 text-xs bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selectedBooking && (
          <div className="w-72 panel rounded-2xl p-5 flex-none space-y-5">
            <div>
              <div className="text-[11px] text-text-muted uppercase tracking-wide mb-1">Booking</div>
              <div className="font-mono font-bold text-accent text-lg">{selectedBooking.id}</div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "Client", value: selectedBooking.user },
                { label: "Email", value: selectedBooking.email },
                { label: "Phone", value: selectedBooking.phone },
                { label: "Date", value: `${selectedBooking.date} at ${selectedBooking.time}` },
                { label: "Location", value: selectedBooking.location },
                { label: "Species Concern", value: selectedBooking.snake_concern || "Not specified" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">{r.label}</div>
                  <div className="text-text-primary">{r.value}</div>
                </div>
              ))}
              <div>
                <div className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">Reason</div>
                <div className="text-text-primary text-xs leading-relaxed">{selectedBooking.reason}</div>
              </div>
            </div>

            {selectedBooking.status === "PENDING" && (
              <div className="space-y-2 pt-2 border-t border-border">
                <button
                  onClick={() => handleConfirm(selectedBooking.id)}
                  className="w-full py-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20 text-sm font-semibold hover:bg-accent/20 transition-colors"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => handleCancel(selectedBooking.id)}
                  className="w-full py-2.5 rounded-xl bg-danger/5 text-danger text-sm font-semibold hover:bg-danger/10 transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
