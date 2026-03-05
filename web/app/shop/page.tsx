"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Check, Package, ChevronRight, Shield } from "lucide-react";
import toast from "react-hot-toast";

const PRODUCTS = [
  {
    id: "snake-trap",
    name: "Snake Trap Pro",
    subtitle: "Humane capture trap",
    desc: "Corrosion-resistant galvanised steel trap designed for Zimbabwe's common species. Bait-triggered one-way door, safe for non-venomous and mildly venomous snakes. Best for Rock Pythons and Puff Adders.",
    price: 85,
    unit: "USD",
    accent: "#22C55E",
    badge: "Best Seller",
    badgeCls: "bg-venom/20 text-venom border border-venom/30",
    specs: ["Galvanised steel", "60cm × 18cm", "One-way door", "Safe release latch"],
  },
  {
    id: "gators",
    name: "Snake Gaiters",
    subtitle: "Leg & ankle protection",
    desc: "Puncture-resistant polycarbonate and Kevlar-lined gaiters that cover boot-top to knee. Tested against Black Mamba fang penetration at 0.5m strike distance. Field standard for snake handlers across Southern Africa.",
    price: 120,
    unit: "USD",
    accent: "#F59E0B",
    badge: "Field Standard",
    badgeCls: "bg-warning/20 text-warning border border-warning/30",
    specs: ["Kevlar + polycarbonate", "Knee-height coverage", "Fits most boot sizes", "Mamba-tested"],
  },
  {
    id: "handling-tongs",
    name: "Snake Handling Tongs",
    subtitle: "Professional capture tongs",
    desc: "1.2m stainless steel tongs with soft-grip jaw to prevent injury to the snake. Spring-loaded for precision control. Used by Chawa's field team for all capture and relocation work.",
    price: 55,
    unit: "USD",
    accent: "#60A5FA",
    badge: "Expert Use",
    badgeCls: "bg-info/20 text-info border border-info/30",
    specs: ["1.2m reach", "Soft-grip jaw", "Stainless steel", "Spring-loaded"],
  },
  {
    id: "snake-tube",
    name: "Snake Restraint Tube",
    subtitle: "Clear polycarbonate tube",
    desc: "Crystal-clear polycarbonate tube for safe examination, venom milking, and transport. The snake enters voluntarily and is restrained without stress or harm. Essential for venomous species like Mambas and Cobras.",
    price: 40,
    unit: "USD",
    accent: "#A78BFA",
    badge: "Vet Approved",
    badgeCls: "bg-safe/20 text-safe border border-safe/30",
    specs: ["Clear polycarbonate", "4cm diameter", "45cm length", "Washable & reusable"],
  },
  {
    id: "snake-hook",
    name: "Snake Hook",
    subtitle: "Stainless steel handling hook",
    desc: "Classic 90cm aluminium snake hook with a J-curved stainless steel tip for lifting and directing snakes without restraint. Ideal for field observation and guiding snakes away from structures.",
    price: 35,
    unit: "USD",
    accent: "#F87171",
    badge: "Beginner Friendly",
    badgeCls: "bg-danger/10 text-danger border border-danger/20",
    specs: ["90cm handle", "Aluminium shaft", "Stainless J-hook", "Rubber grip"],
  },
];

interface CartItem { id: string; qty: number }

export default function ShopPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ordered, setOrdered] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (!existing) return delta > 0 ? [...prev, { id, qty: 1 }] : prev;
      const next = existing.qty + delta;
      if (next <= 0) return prev.filter((c) => c.id !== id);
      return prev.map((c) => (c.id === id ? { ...c, qty: next } : c));
    });
  };

  const getQty = (id: string) => cart.find((c) => c.id === id)?.qty ?? 0;

  const total = cart.reduce((sum, item) => {
    const p = PRODUCTS.find((p) => p.id === item.id);
    return sum + (p?.price ?? 0) * item.qty;
  }, 0);

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill in all delivery details.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Add at least one product to your order.");
      return;
    }
    setOrdered(true);
    toast.success("Order placed! We'll contact you to confirm.");
  };

  if (ordered) {
    return (
      <div className="min-h-screen bg-void pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-3xl glass-green flex items-center justify-center mx-auto mb-6 glow-green">
            <Check size={36} className="text-venom" />
          </div>
          <h1 className="font-display text-4xl font-bold text-parchment mb-4">Order Placed!</h1>
          <div className="glass rounded-2xl p-6 mb-6 text-left space-y-3">
            {cart.map((item) => {
              const p = PRODUCTS.find((p) => p.id === item.id)!;
              return (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-smoke">{p.name} × {item.qty}</span>
                  <span className="text-parchment font-medium">${p.price * item.qty}</span>
                </div>
              );
            })}
            <div className="border-t border-forest-700 pt-3 flex justify-between font-bold">
              <span className="text-parchment">Total</span>
              <span className="text-venom">${total} USD</span>
            </div>
            <div className="text-smoke/60 text-xs pt-2">
              Delivering to: {form.address}. Our team will call {form.phone} to confirm dispatch.
            </div>
          </div>
          <button
            onClick={() => { setOrdered(false); setCart([]); setForm({ name: "", phone: "", address: "" }); }}
            className="px-6 py-3 rounded-2xl glass-green text-venom font-semibold text-sm"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-green text-venom text-xs font-semibold tracking-widest uppercase mb-6">
            <Package size={12} /> Equipment & Safety Gear
          </div>
          <h1 className="font-display text-5xl font-bold text-parchment mb-4">Snake Safety Shop</h1>
          <p className="text-smoke text-lg max-w-lg mx-auto">
            Professional-grade handling equipment and protective gear — the same kit used by Chawa's expert team.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2 space-y-4">
            {PRODUCTS.map((product) => {
              const qty = getQty(product.id);
              return (
                <div
                  key={product.id}
                  className="glass rounded-2xl p-6 flex gap-5 transition-all hover:border-white/10"
                  style={{ borderColor: qty > 0 ? `${product.accent}30` : undefined }}
                >
                  {/* Icon block */}
                  <div
                    className="w-16 h-16 rounded-2xl flex-none flex items-center justify-center"
                    style={{ background: `${product.accent}12`, border: `1px solid ${product.accent}25` }}
                  >
                    <Shield size={28} style={{ color: product.accent }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-parchment">{product.name}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${product.badgeCls}`}>
                            {product.badge}
                          </span>
                        </div>
                        <div className="text-smoke text-xs">{product.subtitle}</div>
                      </div>
                      <div className="text-right flex-none">
                        <div className="font-bold text-parchment text-lg">${product.price}</div>
                        <div className="text-smoke text-xs">USD</div>
                      </div>
                    </div>

                    <p className="text-smoke text-sm leading-relaxed mb-3">{product.desc}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {product.specs.map((spec) => (
                        <span key={spec} className="text-[10px] px-2 py-0.5 rounded-md bg-forest-800/60 text-smoke/70 border border-forest-700">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-3">
                      {qty === 0 ? (
                        <button
                          onClick={() => updateQty(product.id, 1)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                          style={{
                            background: `${product.accent}15`,
                            border: `1px solid ${product.accent}30`,
                            color: product.accent,
                          }}
                        >
                          <Plus size={14} /> Add to Order
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(product.id, -1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-smoke hover:text-parchment glass transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-parchment">{qty}</span>
                          <button
                            onClick={() => updateQty(product.id, 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-smoke hover:text-parchment glass transition-all"
                          >
                            <Plus size={14} />
                          </button>
                          <span className="text-sm text-smoke ml-1">= ${product.price * qty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary + form */}
          <div className="space-y-5">
            {/* Cart */}
            <div className="glass rounded-2xl p-5">
              <h2 className="font-semibold text-parchment mb-4 flex items-center gap-2">
                <ShoppingCart size={16} className="text-venom" /> Your Order
              </h2>
              {cart.length === 0 ? (
                <p className="text-smoke text-sm text-center py-6 opacity-50">No items yet</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {cart.map((item) => {
                    const p = PRODUCTS.find((p) => p.id === item.id)!;
                    return (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div>
                          <div className="text-parchment font-medium">{p.name}</div>
                          <div className="text-smoke text-xs">× {item.qty}</div>
                        </div>
                        <div className="text-parchment font-semibold">${p.price * item.qty}</div>
                      </div>
                    );
                  })}
                  <div className="border-t border-forest-700 pt-3 flex justify-between font-bold">
                    <span className="text-parchment">Total</span>
                    <span className="text-venom">${total} USD</span>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery form */}
            <div className="glass rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-parchment">Delivery Details</h2>
              {[
                { key: "name", label: "Full Name", placeholder: "Tatenda Nyemudzo" },
                { key: "phone", label: "Phone", placeholder: "+263 7X XXX XXXX" },
                { key: "address", label: "Delivery Address", placeholder: "14 Borrowdale Road, Harare" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-smoke font-semibold tracking-wide uppercase block mb-1.5">
                    {f.label}
                  </label>
                  <input
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full bg-forest-800/40 text-parchment placeholder:text-smoke/40 rounded-xl px-4 py-2.5 text-sm outline-none border border-forest-600 focus:border-venom/50 transition-colors"
                  />
                </div>
              ))}

              <div className="bg-venom/5 border border-venom/15 rounded-xl p-3 text-xs text-smoke/70 leading-relaxed">
                Orders are confirmed via phone call within 2 hours. Harare delivery 1–2 days. Outside Harare 3–5 days.
              </div>

              <button
                onClick={handleOrder}
                disabled={cart.length === 0}
                className="w-full py-3.5 rounded-xl bg-venom text-forest-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-venom-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed glow-green"
              >
                Place Order <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
