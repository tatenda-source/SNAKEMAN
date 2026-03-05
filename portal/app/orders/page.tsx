"use client";

import { useState } from "react";
import { ShoppingBag, Package, Truck, CheckCircle2, Clock, XCircle, MoreHorizontal, Search } from "lucide-react";
import toast from "react-hot-toast";

const PRODUCTS_MAP: Record<string, string> = {
  "snake-trap": "Snake Trap Pro",
  "gators": "Snake Gaiters",
  "handling-tongs": "Snake Handling Tongs",
  "snake-tube": "Snake Restraint Tube",
  "snake-hook": "Snake Hook",
};

const ALL_ORDERS = [
  {
    id: "ORD-7821A",
    customer: "Chiedza Mhungu",
    phone: "+263771001122",
    address: "45 Avondale Drive, Harare",
    date: "2026-03-04",
    status: "DELIVERED",
    items: [{ product: "snake-trap", qty: 2, price: 85 }, { product: "snake-hook", qty: 1, price: 35 }],
  },
  {
    id: "ORD-6540B",
    customer: "Blessed Ncube",
    phone: "+263772334455",
    address: "12 Burnside Rd, Bulawayo",
    date: "2026-03-05",
    status: "DISPATCHED",
    items: [{ product: "gators", qty: 1, price: 120 }],
  },
  {
    id: "ORD-9103C",
    customer: "Farai Zishiri",
    phone: "+263773556677",
    address: "3 Greendale Close, Harare",
    date: "2026-03-05",
    status: "PENDING",
    items: [{ product: "handling-tongs", qty: 1, price: 55 }, { product: "snake-tube", qty: 2, price: 40 }],
  },
  {
    id: "ORD-4422D",
    customer: "Rutendo Sithole",
    phone: "+263774112233",
    address: "7 Msasa Park, Harare",
    date: "2026-03-06",
    status: "PENDING",
    items: [{ product: "snake-trap", qty: 1, price: 85 }, { product: "gators", qty: 1, price: 120 }, { product: "snake-hook", qty: 1, price: 35 }],
  },
  {
    id: "ORD-3318E",
    customer: "Tinashe Dube",
    phone: "+263775223344",
    address: "22 Borrowdale Rd, Harare",
    date: "2026-03-06",
    status: "CANCELLED",
    items: [{ product: "snake-tube", qty: 1, price: 40 }],
  },
];

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  PENDING: { label: "Pending", cls: "bg-warning/10 text-warning border border-warning/20", icon: Clock },
  DISPATCHED: { label: "Dispatched", cls: "bg-info/10 text-info border border-info/20", icon: Truck },
  DELIVERED: { label: "Delivered", cls: "bg-accent/10 text-accent border border-accent/20", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", cls: "bg-danger/10 text-danger border border-danger/20", icon: XCircle },
};

function orderTotal(items: { price: number; qty: number }[]) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (filter !== "ALL" && o.status !== filter) return false;
    if (search && !o.customer.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedOrder = orders.find((o) => o.id === selected);

  const handleDispatch = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "DISPATCHED" } : o));
    toast.success(`Order ${id} marked as dispatched.`);
  };

  const handleDeliver = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "DELIVERED" } : o));
    toast.success(`Order ${id} marked as delivered.`);
  };

  const stats = {
    pending: orders.filter((o) => o.status === "PENDING").length,
    dispatched: orders.filter((o) => o.status === "DISPATCHED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    revenue: orders.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + orderTotal(o.items), 0),
  };

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <ShoppingBag size={22} className="text-accent" />
            Shop Orders
          </h1>
          <p className="text-text-muted text-sm mt-0.5">
            {stats.pending} pending · {stats.dispatched} in transit
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Pending", value: stats.pending, color: "#F59E0B", bg: "rgba(245,158,11,0.08)", icon: Clock },
          { label: "In Transit", value: stats.dispatched, color: "#60A5FA", bg: "rgba(96,165,250,0.08)", icon: Truck },
          { label: "Delivered", value: stats.delivered, color: "#DC2626", bg: "rgba(220,38,38,0.08)", icon: CheckCircle2 },
          { label: "Revenue", value: `$${stats.revenue}`, color: "#A78BFA", bg: "rgba(167,139,250,0.08)", icon: Package },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="panel rounded-2xl p-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <Icon size={16} style={{ color: s.color }} />
              </div>
              <div className="text-xl font-bold text-text-primary">{s.value}</div>
              <div className="text-text-muted text-xs mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="flex items-center gap-2 panel rounded-xl px-4 py-2.5 border border-border max-w-xs">
          <Search size={14} className="text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
          />
        </div>
        {["ALL", "PENDING", "DISPATCHED", "DELIVERED", "CANCELLED"].map((s) => (
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
                  {["Order ID", "Customer", "Items", "Total", "Date", "Status", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((o) => {
                  const s = STATUS_CONFIG[o.status];
                  const SIcon = s.icon;
                  return (
                    <tr
                      key={o.id}
                      onClick={() => setSelected(o.id === selected ? null : o.id)}
                      className={`cursor-pointer transition-colors hover:bg-white/2 ${selected === o.id ? "bg-accent/5" : ""}`}
                    >
                      <td className="px-5 py-3.5 font-mono text-xs text-text-muted">{o.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium text-text-primary">{o.customer}</div>
                        <div className="text-[11px] text-text-muted">{o.phone}</div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-text-muted">
                        {o.items.map((i) => (
                          <div key={i.product}>{PRODUCTS_MAP[i.product]} × {i.qty}</div>
                        ))}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-text-primary">${orderTotal(o.items)}</td>
                      <td className="px-5 py-3.5 text-sm text-text-muted">{o.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 w-fit ${s.cls}`}>
                          <SIcon size={10} />{s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {o.status === "PENDING" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDispatch(o.id); }}
                            className="px-2 py-1 text-xs bg-info/10 text-info rounded-lg hover:bg-info/20 transition-colors"
                          >
                            Dispatch
                          </button>
                        )}
                        {o.status === "DISPATCHED" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeliver(o.id); }}
                            className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                          >
                            Delivered
                          </button>
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
        {selectedOrder && (
          <div className="w-72 panel rounded-2xl p-5 flex-none space-y-5">
            <div>
              <div className="text-[11px] text-text-muted uppercase tracking-wide mb-1">Order</div>
              <div className="font-mono font-bold text-accent text-lg">{selectedOrder.id}</div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "Customer", value: selectedOrder.customer },
                { label: "Phone", value: selectedOrder.phone },
                { label: "Date", value: selectedOrder.date },
                { label: "Deliver to", value: selectedOrder.address },
              ].map((r) => (
                <div key={r.label}>
                  <div className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">{r.label}</div>
                  <div className="text-text-primary text-xs">{r.value}</div>
                </div>
              ))}
              <div>
                <div className="text-[10px] text-text-muted uppercase tracking-wide mb-1.5">Items</div>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((i) => (
                    <div key={i.product} className="flex justify-between text-xs">
                      <span className="text-text-primary">{PRODUCTS_MAP[i.product]} × {i.qty}</span>
                      <span className="text-text-muted">${i.price * i.qty}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-1.5 flex justify-between text-xs font-bold">
                    <span className="text-text-primary">Total</span>
                    <span className="text-accent">${orderTotal(selectedOrder.items)}</span>
                  </div>
                </div>
              </div>
            </div>
            {selectedOrder.status === "PENDING" && (
              <button
                onClick={() => handleDispatch(selectedOrder.id)}
                className="w-full py-2.5 rounded-xl bg-info/10 text-info border border-info/20 text-sm font-semibold hover:bg-info/20 transition-colors"
              >
                Mark as Dispatched
              </button>
            )}
            {selectedOrder.status === "DISPATCHED" && (
              <button
                onClick={() => handleDeliver(selectedOrder.id)}
                className="w-full py-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20 text-sm font-semibold hover:bg-accent/20 transition-colors"
              >
                Mark as Delivered
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
