"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Phone, CheckCircle2, Loader2, ChevronRight } from "lucide-react";
import { reportEmergency } from "@/lib/api";
import toast from "react-hot-toast";

type Step = "form" | "submitting" | "guidance";

interface Guidance {
  severity: string;
  call_emergency: boolean;
  immediate_steps: string[];
  do_not: string[];
  estimated_response: string;
  nearest_facility_type: string;
  reassurance: string;
}

const SEVERITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  CRITICAL: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.5)", text: "#FCA5A5" },
  HIGH: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)", text: "#FCD34D" },
  MEDIUM: { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)", text: "#C4B5FD" },
  LOW: { bg: "rgba(220,38,38,0.1)", border: "rgba(220,38,38,0.3)", text: "#F87171" },
};

export default function EmergencyPage() {
  const [step, setStep] = useState<Step>("form");
  const [bitten, setBitten] = useState(false);
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [phone, setPhone] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [emergencyId, setEmergencyId] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<Guidance | null>(null);

  const getLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
        toast.success("Location captured");
      },
      () => {
        setLocationLoading(false);
        toast.error("Could not get location. Please enter manually.");
      }
    );
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please describe the encounter");
      return;
    }
    setStep("submitting");
    try {
      const res = await reportEmergency({
        description,
        latitude: coords?.lat,
        longitude: coords?.lng,
        location_name: locationName,
        bitten,
        user_phone: phone,
      });
      setEmergencyId(res.emergency_id);
      setGuidance(res.guidance);
      setStep("guidance");
    } catch {
      toast.error("Failed to send emergency report. Call 999 directly.");
      setStep("form");
    }
  };

  const sc = guidance ? SEVERITY_COLORS[guidance.severity] || SEVERITY_COLORS.MEDIUM : null;

  return (
    <div className="min-h-screen bg-void pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-3xl glass-red flex items-center justify-center mx-auto mb-6 animate-glow-red">
            <AlertTriangle size={36} className="text-danger" />
          </div>
          <h1 className="font-display text-5xl font-bold text-parchment mb-3">
            Emergency
          </h1>
          <p className="text-smoke text-base">
            Report a snake encounter or bite. Our experts respond immediately.
          </p>
          <div className="mt-4 text-danger font-bold text-sm">
            If life-threatening — call <span className="text-parchment">999</span> or <span className="text-parchment">+263 242 702 730</span> first.
          </div>
        </div>

        {/* FORM */}
        {step === "form" && (
          <div className="space-y-5">
            {/* Bitten toggle */}
            <div
              className={`rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 ${
                bitten ? "glass-red border-danger/50 animate-glow-red" : "glass border-forest-600"
              }`}
              onClick={() => setBitten(!bitten)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-bold text-lg ${bitten ? "text-danger" : "text-parchment"}`}>
                    {bitten ? "BITTEN — Get to hospital NOW" : "I was not bitten"}
                  </div>
                  <div className="text-smoke text-sm mt-0.5">Tap to toggle</div>
                </div>
                <div
                  className={`w-14 h-7 rounded-full transition-all ${bitten ? "bg-danger" : "bg-forest-600"} relative`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${bitten ? "left-8" : "left-1"}`}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-5">
              <label className="text-xs text-smoke font-semibold tracking-wide uppercase block mb-3">
                Describe the Encounter *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 'Large grey snake about 2m long in my kitchen. It spread a black mouth and hissed at me. I did not get bitten but it is still in the room...'"
                className="w-full bg-transparent text-parchment placeholder:text-smoke/40 resize-none outline-none text-sm leading-relaxed"
                rows={5}
                autoFocus
              />
            </div>

            {/* Location */}
            <div className="glass rounded-2xl p-5">
              <label className="text-xs text-smoke font-semibold tracking-wide uppercase block mb-3">
                Location
              </label>
              <div className="flex gap-3 mb-3">
                <input
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. 14 Borrowdale Road, Harare"
                  className="flex-1 bg-forest-800/40 text-parchment placeholder:text-smoke/40 rounded-xl px-4 py-2.5 text-sm outline-none border border-forest-600 focus:border-venom/50 transition-colors"
                />
                <button
                  onClick={getLocation}
                  disabled={locationLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-green text-venom text-sm font-semibold hover:glow-green transition-all disabled:opacity-50"
                >
                  {locationLoading ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                  GPS
                </button>
              </div>
              {coords && (
                <div className="text-venom text-xs flex items-center gap-1">
                  <CheckCircle2 size={11} /> GPS: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="glass rounded-2xl p-5">
              <label className="text-xs text-smoke font-semibold tracking-wide uppercase block mb-3">
                Your Phone Number
              </label>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-smoke" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+263 7X XXX XXXX"
                  type="tel"
                  className="flex-1 bg-transparent text-parchment placeholder:text-smoke/40 outline-none text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-5 rounded-2xl bg-danger text-white font-black text-lg flex items-center justify-center gap-3 hover:bg-danger/90 glow-red animate-glow-red transition-all shadow-2xl shadow-danger/30"
            >
              <AlertTriangle size={22} />
              SEND EMERGENCY REPORT
            </button>

            <p className="text-center text-smoke/50 text-xs">
              Report sent to all on-call experts immediately. Average response: under 2 minutes.
            </p>
          </div>
        )}

        {/* SUBMITTING */}
        {step === "submitting" && (
          <div className="text-center py-20">
            <Loader2 size={48} className="text-danger animate-spin mx-auto mb-6" />
            <p className="text-parchment font-bold text-xl mb-2">Sending Emergency Report...</p>
            <p className="text-smoke text-sm">Notifying on-call experts. Getting AI guidance.</p>
          </div>
        )}

        {/* GUIDANCE */}
        {step === "guidance" && guidance && (
          <div className="space-y-5">
            {/* Emergency ID */}
            <div className="text-center glass rounded-2xl p-5">
              <CheckCircle2 size={32} className="text-venom mx-auto mb-3" />
              <p className="text-parchment font-bold text-lg">Report Submitted</p>
              <p className="text-smoke text-sm">Emergency ID: <span className="text-venom font-mono font-bold">{emergencyId}</span></p>
              <p className="text-smoke text-xs mt-2">Experts have been notified. Estimated response: {guidance.estimated_response}</p>
            </div>

            {/* Severity */}
            <div
              className="rounded-2xl p-5 border"
              style={sc ? { background: sc.bg, borderColor: sc.border } : {}}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} style={{ color: sc?.text }} />
                <span className="font-bold text-sm tracking-widest uppercase" style={{ color: sc?.text }}>
                  Severity: {guidance.severity}
                </span>
              </div>
              <p className="text-parchment/80 text-sm">{guidance.reassurance}</p>
            </div>

            {/* Immediate steps */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-parchment font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-venom" /> DO This Now
              </h3>
              <ol className="space-y-3">
                {guidance.immediate_steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-venom/20 text-venom flex-none flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-parchment/80 leading-snug">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Do NOT */}
            <div className="glass-red rounded-2xl p-5">
              <h3 className="text-danger font-bold mb-4">DO NOT</h3>
              <ul className="space-y-2">
                {guidance.do_not.map((d, i) => (
                  <li key={i} className="flex gap-2 text-sm text-parchment/70">
                    <span className="text-danger mt-0.5">✗</span> {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Call emergency */}
            {guidance.call_emergency && (
              <a
                href="tel:999"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-danger text-white font-black text-lg glow-red animate-glow-red"
              >
                <Phone size={22} /> CALL 999 NOW
              </a>
            )}

            <button
              onClick={() => { setStep("form"); setDescription(""); setGuidance(null); }}
              className="w-full py-3 rounded-2xl glass text-smoke text-sm hover:text-parchment transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
