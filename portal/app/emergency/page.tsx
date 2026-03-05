"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Clock, Phone, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Emergency {
  id: string;
  timestamp: string;
  status: "ACTIVE" | "RESOLVED";
  report: {
    description: string;
    location_name?: string;
    latitude?: number;
    longitude?: number;
    bitten: boolean;
    user_phone?: string;
  };
  guidance: {
    severity: string;
    call_emergency: boolean;
    immediate_steps: string[];
  };
}

const MOCK_EMERGENCIES: Emergency[] = [
  {
    id: "EMG-20260305143212",
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    status: "ACTIVE",
    report: {
      description: "Black mamba spotted coiled behind wardrobe in bedroom. About 2.5m long, spread black mouth at me.",
      location_name: "14 Borrowdale Road, Harare",
      latitude: -17.7812,
      longitude: 31.0534,
      bitten: false,
      user_phone: "+263771234567",
    },
    guidance: {
      severity: "CRITICAL",
      call_emergency: true,
      immediate_steps: ["Leave the room immediately", "Close all doors", "Call 999 now"],
    },
  },
  {
    id: "EMG-20260305125048",
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    status: "ACTIVE",
    report: {
      description: "I was bitten on my right foot by a thick brown patterned snake. Foot is swelling badly and very painful.",
      location_name: "Chitungwiza, Unit L",
      latitude: -18.0125,
      longitude: 31.0754,
      bitten: true,
      user_phone: "+263772345678",
    },
    guidance: {
      severity: "CRITICAL",
      call_emergency: true,
      immediate_steps: ["Call 999 immediately", "Immobilize foot below heart level", "Remove shoes and socks", "Do NOT cut or suck"],
    },
  },
  {
    id: "EMG-20260305103924",
    timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
    status: "ACTIVE",
    report: {
      description: "Very large python — maybe 4 metres — found sleeping under my car. Need professional removal.",
      location_name: "Kariba Heights",
      bitten: false,
      user_phone: "+263773456789",
    },
    guidance: {
      severity: "MEDIUM",
      call_emergency: false,
      immediate_steps: ["Do not disturb the python", "Keep others and pets away", "Wait for expert removal"],
    },
  },
  {
    id: "EMG-20260305091547",
    timestamp: new Date(Date.now() - 74 * 60000).toISOString(),
    status: "RESOLVED",
    report: {
      description: "Green snake in mango tree, dropped onto child in the garden. Child not bitten but very scared. Snake still in tree.",
      location_name: "Avondale, Harare",
      latitude: -17.7921,
      longitude: 31.0411,
      bitten: false,
      user_phone: "+263774567890",
    },
    guidance: {
      severity: "HIGH",
      call_emergency: false,
      immediate_steps: ["Keep child calm and inside", "Do not shake or disturb the tree", "Observe from safe distance — likely green mamba"],
    },
  },
  {
    id: "EMG-20260305074312",
    timestamp: new Date(Date.now() - 109 * 60000).toISOString(),
    status: "ACTIVE",
    report: {
      description: "Spitting cobra in kitchen. It sprayed liquid at me — hit my eye. Eye burning badly. Snake still in kitchen behind fridge.",
      location_name: "Marondera Town",
      latitude: -18.1856,
      longitude: 31.5522,
      bitten: false,
      user_phone: "+263775678901",
    },
    guidance: {
      severity: "CRITICAL",
      call_emergency: true,
      immediate_steps: ["Flush eye with large amounts of water for 15 minutes", "Do NOT rub eye", "Seek hospital immediately — venom in eyes requires treatment", "Leave kitchen and close door behind you"],
    },
  },
];

const SEVERITY_STYLES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  CRITICAL: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", text: "#FCA5A5", badge: "bg-danger text-white" },
  HIGH: { bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)", text: "#FCD34D", badge: "bg-warning text-surface" },
  MEDIUM: { bg: "rgba(167,139,250,0.06)", border: "rgba(167,139,250,0.2)", text: "#C4B5FD", badge: "bg-info/80 text-surface" },
};

function timeAgo(ts: string) {
  const diff = (Date.now() - new Date(ts).getTime()) / 60000;
  if (diff < 1) return "Just now";
  if (diff < 60) return `${Math.round(diff)} min ago`;
  return `${Math.round(diff / 60)}h ago`;
}

export default function EmergencyPortalPage() {
  const [emergencies, setEmergencies] = useState<Emergency[]>(MOCK_EMERGENCIES);
  const [selected, setSelected] = useState<Emergency | null>(MOCK_EMERGENCIES[0]);
  const [note, setNote] = useState("");
  const [resolving, setResolving] = useState(false);

  const active = emergencies.filter((e) => e.status === "ACTIVE");

  const handleResolve = async (id: string) => {
    setResolving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setEmergencies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "RESOLVED" } : e))
    );
    if (selected?.id === id) setSelected(null);
    setNote("");
    setResolving(false);
    toast.success(`Emergency ${id} marked as resolved`);
  };

  const s = selected ? SEVERITY_STYLES[selected.guidance.severity] || SEVERITY_STYLES.MEDIUM : null;

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <AlertTriangle size={22} className="text-danger" />
            Emergency Response
          </h1>
          <p className="text-text-muted text-sm mt-0.5">
            {active.length} active · Real-time expert coordination
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          WebSocket Connected
        </div>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* Emergency list */}
        <div className="w-80 flex-none space-y-3 overflow-y-auto">
          {emergencies.map((e) => {
            const style = SEVERITY_STYLES[e.guidance.severity] || SEVERITY_STYLES.MEDIUM;
            return (
              <div
                key={e.id}
                onClick={() => setSelected(e)}
                className={`rounded-2xl p-4 cursor-pointer transition-all border ${
                  selected?.id === e.id ? "border-accent/30" : ""
                } ${e.status === "RESOLVED" ? "opacity-40" : ""}`}
                style={{ background: style.bg, borderColor: selected?.id === e.id ? "#DC2626" : style.border }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-mono text-[10px] text-text-muted">{e.id.slice(0, 16)}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${style.badge}`}>
                      {e.guidance.severity}
                    </span>
                    {e.status === "RESOLVED" && (
                      <CheckCircle2 size={12} className="text-accent" />
                    )}
                  </div>
                </div>
                <p className="text-text-primary text-xs leading-snug mb-2 line-clamp-2">{e.report.description}</p>
                <div className="flex items-center justify-between text-[10px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin size={9} />{e.report.location_name || "Location unknown"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={9} />{timeAgo(e.timestamp)}
                  </span>
                </div>
                {e.report.bitten && (
                  <div className="mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger text-white font-bold">
                      BITE REPORTED
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="flex-1 panel rounded-2xl p-6 space-y-5 overflow-y-auto" style={s ? { borderColor: s.border } : {}}>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${s?.badge}`}>
                    {selected.guidance.severity}
                  </span>
                  {selected.report.bitten && (
                    <span className="text-xs px-3 py-1 rounded-full bg-danger text-white font-bold animate-pulse">
                      BITE REPORTED — CRITICAL
                    </span>
                  )}
                  {selected.status === "RESOLVED" && (
                    <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                      Resolved
                    </span>
                  )}
                </div>
                <div className="font-mono text-text-muted text-sm">{selected.id}</div>
              </div>
              <div className="text-right text-xs text-text-muted">
                <div>{new Date(selected.timestamp).toLocaleTimeString()}</div>
                <div>{timeAgo(selected.timestamp)}</div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl p-4" style={{ background: s?.bg, borderLeft: `3px solid ${s?.text}` }}>
              <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">Encounter Description</div>
              <p className="text-text-primary text-sm leading-relaxed">{selected.report.description}</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Location", value: selected.report.location_name || "Not provided" },
                { label: "Phone", value: selected.report.user_phone || "Not provided" },
                { label: "GPS", value: selected.report.latitude ? `${selected.report.latitude.toFixed(4)}, ${selected.report.longitude?.toFixed(4)}` : "Not captured" },
                { label: "Bitten", value: selected.report.bitten ? "YES — Urgent" : "No" },
              ].map((r) => (
                <div key={r.label} className="panel rounded-xl p-3">
                  <div className="text-[10px] text-text-muted uppercase tracking-wide mb-1">{r.label}</div>
                  <div className={`text-sm font-medium ${r.label === "Bitten" && selected.report.bitten ? "text-danger" : "text-text-primary"}`}>
                    {r.value}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Guidance */}
            <div>
              <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-3">AI Guidance Given to User</div>
              <ol className="space-y-2">
                {selected.guidance.immediate_steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-text-primary">
                    <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex-none flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Expert response */}
            {selected.status === "ACTIVE" && (
              <div className="pt-4 border-t border-border space-y-3">
                <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Expert Notes (optional)</div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Additional guidance or resolution notes..."
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/40 resize-none transition-colors"
                  rows={3}
                />
                <div className="flex gap-3">
                  {selected.report.user_phone && (
                    <a
                      href={`tel:${selected.report.user_phone}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl panel border border-border text-text-primary text-sm hover:border-accent/30 transition-colors"
                    >
                      <Phone size={14} /> Call User
                    </a>
                  )}
                  <button
                    onClick={() => handleResolve(selected.id)}
                    disabled={resolving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20 text-sm font-semibold hover:bg-accent/20 transition-colors disabled:opacity-50"
                  >
                    {resolving ? (
                      <><Loader2 size={14} className="animate-spin" /> Resolving...</>
                    ) : (
                      <><CheckCircle2 size={14} /> Mark Resolved</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 panel rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle size={40} className="text-text-muted/20 mx-auto mb-3" />
              <p className="text-text-muted text-sm">Select an emergency to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
