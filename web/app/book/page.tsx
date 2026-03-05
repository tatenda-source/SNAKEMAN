"use client";

import { useState, useEffect } from "react";
import { CalendarDays, CheckCircle2, ChevronRight, Star, MapPin, Loader2, ShieldAlert, Bug, Search } from "lucide-react";
import { getExperts, getAvailableSlots, createBooking } from "@/lib/api";
import type { Expert } from "@/lib/types";
import toast from "react-hot-toast";

const SERVICES = [
  {
    id: "snake-catch",
    label: "Snake Catch & Removal",
    icon: ShieldAlert,
    desc: "Expert comes to your location, safely captures and relocates the snake.",
    duration: "1–2 hrs",
    accent: "#EF4444",
  },
  {
    id: "fumigation",
    label: "Fumigation",
    icon: Bug,
    desc: "Full property treatment to deter snakes and eliminate nesting conditions.",
    duration: "2–4 hrs",
    accent: "#F59E0B",
  },
  {
    id: "risk-assessment",
    label: "Risk Assessment",
    icon: Search,
    desc: "Thorough inspection and a written report identifying snake risk factors on your property.",
    duration: "1–3 hrs",
    accent: "#A78BFA",
  },
];

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

// Computed once at module load — this list doesn't change during the session,
// so computing it inside the component would waste a loop on every render.
function buildNext14Weekdays(): string[] {
  const days: string[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      days.push(d.toISOString().split("T")[0]);
    }
  }
  return days;
}

const NEXT_14_WEEKDAYS = buildNext14Weekdays();

export default function BookPage() {
  const [selectedService, setSelectedService] = useState<string>("");
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS);
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState<{ id: string } | null>(null);

  useEffect(() => {
    getExperts().then((r) => setExperts(r.experts)).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedDate) {
      getAvailableSlots(selectedDate, selectedExpert?.id)
        .then((r) => setAvailableSlots(r.available_slots))
        .catch(() => setAvailableSlots(TIME_SLOTS));
    }
  }, [selectedDate, selectedExpert]);

  const canSubmit =
    selectedService && selectedExpert && selectedDate && selectedSlot && form.name && form.email && form.phone && form.reason;

  const handleBook = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await createBooking({
        user_name: form.name,
        user_email: form.email,
        user_phone: form.phone,
        reason: form.reason,
        location: form.location,
        expert_id: selectedExpert!.id,
        date: selectedDate,
        time_slot: selectedSlot,
      });
      setBooked({ id: res.booking_id });
      toast.success(`Booking ${res.booking_id} submitted!`);
    } catch {
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="min-h-screen bg-void pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-3xl glass-green flex items-center justify-center mx-auto mb-6 glow-green">
            <CheckCircle2 size={36} className="text-venom" />
          </div>
          <h1 className="font-display text-4xl font-bold text-parchment mb-4">Booking Submitted!</h1>
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="text-smoke text-sm mb-1">Your Booking ID</div>
            <div className="font-mono text-2xl font-bold text-venom">{booked.id}</div>
            <div className="text-smoke/60 text-xs mt-3">
              {selectedExpert?.name} will confirm within 2 hours.
              You'll receive a confirmation at {form.email}.
            </div>
          </div>
          <button
            onClick={() => { setBooked(null); setSelectedService(""); setSelectedExpert(null); setSelectedDate(""); setSelectedSlot(""); }}
            className="px-6 py-3 rounded-2xl glass-green text-venom font-semibold text-sm"
          >
            Book Another Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-green text-venom text-xs font-semibold tracking-widest uppercase mb-6">
            <CalendarDays size={12} /> Expert Consultations
          </div>
          <h1 className="font-display text-5xl font-bold text-parchment mb-4">Book a Session</h1>
          <p className="text-smoke text-lg max-w-lg mx-auto">
            Schedule time with Zimbabwe's leading herpetologists and wildlife experts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1 — Service */}
            <div>
              <h2 className="font-semibold text-parchment mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-venom/20 text-venom flex items-center justify-center text-xs font-bold">1</span>
                Select a Service
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {SERVICES.map((svc) => {
                  const Icon = svc.icon;
                  const active = selectedService === svc.id;
                  return (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedService(svc.id)}
                      className={`text-left rounded-2xl p-5 border transition-all ${
                        active ? "border-venom/40 glass-green" : "glass border-transparent hover:border-forest-600"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: `${svc.accent}18`, border: `1px solid ${svc.accent}30` }}
                      >
                        <Icon size={18} style={{ color: svc.accent }} />
                      </div>
                      <div className="font-semibold text-parchment text-sm mb-1">{svc.label}</div>
                      <div className="text-smoke text-xs leading-relaxed mb-2">{svc.desc}</div>
                      <div className="text-xs font-medium" style={{ color: svc.accent }}>{svc.duration}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 — Choose Expert */}
            {selectedService && (
            <div>
              <h2 className="font-semibold text-parchment mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-venom/20 text-venom flex items-center justify-center text-xs font-bold">2</span>
                Choose an Expert
              </h2>
              <div className="space-y-3">
                {experts.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => setSelectedExpert(e)}
                    className={`rounded-2xl p-5 cursor-pointer transition-all border ${
                      selectedExpert?.id === e.id
                        ? "glass-green border-venom/40"
                        : "glass border-transparent hover:border-forest-600"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-venom/10 border border-venom/20 flex items-center justify-center font-display font-bold text-venom text-lg flex-none">
                        {e.avatar_initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-parchment">{e.name}</div>
                            <div className="text-smoke text-xs">{e.title}</div>
                          </div>
                          <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full flex-none ml-2 ${e.available ? "bg-venom/10 text-venom" : "bg-smoke/10 text-smoke"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${e.available ? "bg-venom animate-pulse" : "bg-smoke"}`} />
                            {e.available ? "Available" : "Busy"}
                          </div>
                        </div>
                        <p className="text-smoke/60 text-xs mt-1.5 line-clamp-2">{e.specialization}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-smoke/50">
                          <span className="flex items-center gap-1"><Star size={10} className="text-warning" />{e.rating}</span>
                          <span>{e.total_consultations} sessions</span>
                          <span className="flex items-center gap-1"><MapPin size={10} />{e.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Step 3 — Date */}
            {selectedExpert && (
              <div>
                <h2 className="font-semibold text-parchment mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-venom/20 text-venom flex items-center justify-center text-xs font-bold">3</span>
                  Pick a Date
                </h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {NEXT_14_WEEKDAYS.map((d) => {
                    const date = new Date(d);
                    return (
                      <button
                        key={d}
                        onClick={() => { setSelectedDate(d); setSelectedSlot(""); }}
                        className={`flex-none flex flex-col items-center px-4 py-3 rounded-xl text-xs transition-all ${
                          selectedDate === d
                            ? "bg-venom text-forest-950 font-bold"
                            : "glass text-smoke hover:text-parchment"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold opacity-70">
                          {date.toLocaleDateString("en", { weekday: "short" })}
                        </span>
                        <span className="text-lg font-bold mt-0.5">{date.getDate()}</span>
                        <span className="opacity-70">
                          {date.toLocaleDateString("en", { month: "short" })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4 — Time */}
            {selectedDate && (
              <div>
                <h2 className="font-semibold text-parchment mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-venom/20 text-venom flex items-center justify-center text-xs font-bold">4</span>
                  Select Time
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const available = availableSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        disabled={!available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedSlot === slot
                            ? "bg-venom text-forest-950 font-bold"
                            : available
                            ? "glass text-parchment hover:border-venom/40"
                            : "opacity-30 cursor-not-allowed glass text-smoke"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right — Booking form */}
          <div>
            <h2 className="font-semibold text-parchment mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-venom/20 text-venom flex items-center justify-center text-xs font-bold">5</span>
              Your Details
            </h2>
            <div className="glass rounded-2xl p-5 space-y-4">
              {[
                { key: "name", label: "Full Name", placeholder: "Tatenda Nyemudzo", type: "text" },
                { key: "email", label: "Email", placeholder: "you@example.com", type: "email" },
                { key: "phone", label: "Phone", placeholder: "+263 7X XXX XXXX", type: "tel" },
                { key: "location", label: "Your Location", placeholder: "Harare, Suburbs", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-smoke font-semibold tracking-wide uppercase block mb-1.5">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full bg-forest-800/40 text-parchment placeholder:text-smoke/40 rounded-xl px-4 py-2.5 text-sm outline-none border border-forest-600 focus:border-venom/50 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs text-smoke font-semibold tracking-wide uppercase block mb-1.5">
                  Reason for Consultation
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="I found a snake in my garden and want to identify it safely..."
                  className="w-full bg-forest-800/40 text-parchment placeholder:text-smoke/40 rounded-xl px-4 py-2.5 text-sm outline-none border border-forest-600 focus:border-venom/50 resize-none transition-colors"
                  rows={3}
                />
              </div>

              {/* Summary */}
              {selectedService && selectedExpert && selectedDate && selectedSlot && (
                <div className="bg-venom/5 border border-venom/15 rounded-xl p-3 text-xs space-y-1">
                  <div className="text-venom font-semibold">Booking Summary</div>
                  <div className="text-smoke">{SERVICES.find(s => s.id === selectedService)?.label}</div>
                  <div className="text-smoke">{selectedExpert.name}</div>
                  <div className="text-smoke">{selectedDate} at {selectedSlot}</div>
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={!canSubmit || loading}
                className="w-full py-3.5 rounded-xl bg-venom text-forest-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-venom-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed glow-green"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Booking...</>
                ) : (
                  <>Confirm Booking <ChevronRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
