"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Video, Image, Lightbulb, Eye, Heart, ChevronRight, Search } from "lucide-react";

const SNAKES = [
  { id: "black-mamba", name: "Black Mamba", danger: "CRITICAL", accent: "#EF4444" },
  { id: "puff-adder", name: "Puff Adder", danger: "CRITICAL", accent: "#F59E0B" },
  { id: "mozambique-spitting-cobra", name: "Spitting Cobra", danger: "CRITICAL", accent: "#F59E0B" },
  { id: "boomslang", name: "Boomslang", danger: "HIGH", accent: "#84CC16" },
  { id: "green-mamba", name: "Green Mamba", danger: "HIGH", accent: "#F87171" },
  { id: "egyptian-cobra", name: "Egyptian Cobra", danger: "HIGH", accent: "#FB923C" },
  { id: "african-rock-python", name: "Rock Python", danger: "MEDIUM", accent: "#A78BFA" },
  { id: "rinkhals", name: "Rinkhals", danger: "HIGH", accent: "#F87171" },
];

const DANGER_COLORS: Record<string, string> = {
  CRITICAL: "#EF4444",
  HIGH: "#F59E0B",
  MEDIUM: "#A78BFA",
  LOW: "#DC2626",
};

const SAMPLE_ARTICLES = [
  { id: "1", title: "What to Do If You're Bitten by a Puff Adder", type: "article", author: "Dr. Tendai Moyo", views: 4821, snake: "Puff Adder", tag: "First Aid", featured: true },
  { id: "2", title: "How to Identify the Black Mamba — Definitive Guide", type: "article", author: "Dr. Tendai Moyo", views: 7234, snake: "Black Mamba", tag: "Identification", featured: true },
  { id: "3", title: "Snake Safety for Harare Homeowners", type: "tip", author: "Sibongile Ncube", views: 2340, snake: null, tag: "Safety", featured: false },
  { id: "4", title: "Mozambique Spitting Cobra — Eye Safety Protocol", type: "tip", author: "Marcus Fitzgerald", views: 3107, snake: "Spitting Cobra", tag: "Emergency", featured: false },
  { id: "5", title: "The Boomslang: Africa's Most Underestimated Snake", type: "article", author: "Ruvimbo Chikwanda", views: 1892, snake: "Boomslang", tag: "Education", featured: false },
  { id: "6", title: "Rock Python Encounter — What Happened and What I Learned", type: "article", author: "Sibongile Ncube", views: 1204, snake: "Rock Python", tag: "Field Story", featured: false },
];

const TYPE_ICONS: Record<string, React.ElementType> = { article: BookOpen, video: Video, photo: Image, tip: Lightbulb };
const TYPE_COLORS: Record<string, string> = { article: "#DC2626", video: "#A78BFA", photo: "#F59E0B", tip: "#FB923C" };

const CATEGORIES = ["All", "First Aid", "Identification", "Safety", "Emergency", "Education"];

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSnake, setActiveSnake] = useState<string | null>(null);

  const filtered = SAMPLE_ARTICLES.filter((a) => {
    if (activeCategory !== "All" && a.tag !== activeCategory) return false;
    if (activeSnake && a.snake !== activeSnake) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-void pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-green text-venom text-xs font-semibold tracking-widest uppercase mb-6">
            <BookOpen size={12} /> Knowledge Library
          </div>
          <h1 className="font-display text-5xl font-bold text-parchment mb-4">
            Learn. Prepare. Survive.
          </h1>
          <p className="text-smoke text-lg max-w-xl mx-auto">
            Expert-curated guides, identification help, emergency protocols, and field stories from Zimbabwe's wildlife frontline.
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-8 max-w-xl mx-auto">
          <div className="flex-1 flex items-center gap-3 glass rounded-2xl px-5 py-3 border border-forest-600 focus-within:border-venom/50 transition-colors">
            <Search size={16} className="text-smoke flex-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, tips, guides..."
              className="flex-1 bg-transparent text-parchment placeholder:text-smoke/40 outline-none text-sm"
            />
          </div>
        </div>

        {/* Snake filter */}
        <div className="mb-8">
          <div className="text-xs text-smoke font-semibold tracking-wide uppercase mb-3">Filter by Species</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveSnake(null)}
              className={`flex-none px-4 py-2 rounded-xl text-xs font-semibold transition-all ${!activeSnake ? "bg-venom text-forest-950" : "glass text-smoke hover:text-parchment"}`}
            >
              All Species
            </button>
            {SNAKES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSnake(activeSnake === s.name ? null : s.name)}
                className="flex-none px-4 py-2 rounded-xl text-xs font-semibold transition-all glass hover:border-white/15"
                style={activeSnake === s.name ? { background: `${s.accent}20`, color: s.accent, borderColor: `${s.accent}40` } : {}}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeCategory === c ? "bg-venom text-forest-950" : "glass text-smoke hover:text-parchment"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Species Encyclopedia Cards */}
        <div className="mb-14">
          <h2 className="font-display text-2xl font-bold text-parchment mb-6">Species Encyclopedia</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SNAKES.map((s) => (
              <Link
                key={s.id}
                href={`/library/${s.id}`}
                className="glass rounded-2xl p-4 group hover:-translate-y-1 transition-all duration-300"
                style={{ "--accent": s.accent } as React.CSSProperties}
              >
                {/* SVG silhouette */}
                <div className="h-20 flex items-center justify-center mb-3">
                  <svg viewBox="0 0 100 60" className="w-24 opacity-70" fill="none">
                    <path
                      d="M5 50 Q20 35 35 42 Q50 50 65 35 Q78 22 90 28"
                      stroke={s.accent}
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <ellipse cx="91" cy="27" rx="6" ry="3.5" fill={s.accent} opacity="0.8" />
                  </svg>
                </div>
                <div className="font-semibold text-parchment text-sm group-hover:text-white transition-colors mb-1">
                  {s.name}
                </div>
                <div
                  className="text-xs font-semibold"
                  style={{ color: DANGER_COLORS[s.danger] }}
                >
                  {s.danger}
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: s.accent }}>
                  Learn more <ChevronRight size={11} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div>
          <h2 className="font-display text-2xl font-bold text-parchment mb-6">
            {filtered.length} Article{filtered.length !== 1 ? "s" : ""}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((a) => {
              const Icon = TYPE_ICONS[a.type] || BookOpen;
              const iconColor = TYPE_COLORS[a.type] || "#DC2626";
              return (
                <div key={a.id} className="glass rounded-2xl p-5 group hover:border-white/10 transition-all cursor-pointer hover:-translate-y-0.5">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: `${iconColor}15`, color: iconColor }}
                    >
                      <Icon size={11} />
                      {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
                    </div>
                    {a.snake && (
                      <span className="text-smoke text-xs">{a.snake}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-parchment text-sm leading-snug mb-3 group-hover:text-white transition-colors">
                    {a.title}
                  </h3>
                  <div className="flex items-center justify-between text-smoke/60 text-xs">
                    <span>{a.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Eye size={10} />{a.views.toLocaleString()}</span>
                    </div>
                  </div>
                  {a.featured && (
                    <div className="mt-3 text-venom text-xs font-semibold flex items-center gap-1">
                      ★ Featured
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 glass rounded-3xl">
              <BookOpen size={40} className="text-smoke/30 mx-auto mb-4" />
              <p className="text-smoke">No articles match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
