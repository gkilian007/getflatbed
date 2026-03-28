"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Error Fares",
  "Miles & Points",
  "Upgrades",
  "Credit Cards",
  "Routes",
  "Beginners",
];

const CATEGORY_MAP: Record<string, string> = {
  "error-fares": "Error Fares",
  "miles-points": "Miles & Points",
  upgrades: "Upgrades",
  "credit-cards": "Credit Cards",
  routes: "Routes",
  beginners: "Beginners",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Error Fares": "bg-red-500/20 text-red-400",
  "Miles & Points": "bg-blue-500/20 text-blue-400",
  "Credit Cards": "bg-purple-500/20 text-purple-400",
  Upgrades: "bg-green-500/20 text-green-400",
  Routes: "bg-orange-500/20 text-orange-400",
  Beginners: "bg-yellow-500/20 text-yellow-400",
};

const CATEGORY_ICONS: Record<string, string> = {
  "Error Fares": "⚡",
  "Miles & Points": "🏆",
  Upgrades: "🔼",
  "Credit Cards": "💳",
  Routes: "🗺️",
  Beginners: "🛋️",
};

interface Guide {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  isPremium: boolean;
  categoryLabel?: string;
}

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    fetch("/api/guides")
      .then((r) => r.json())
      .then(setGuides)
      .catch(() => setGuides([]));
  }, []);

  const formatted = guides.map((g) => ({
    ...g,
    categoryLabel: CATEGORY_MAP[g.category] ?? g.category,
  }));

  const filtered =
    activeCategory === "All"
      ? formatted
      : formatted.filter((g) => g.categoryLabel === activeCategory);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="pt-20">
      {/* HEADER */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
            Guides
          </span>
          <h1 className="text-5xl md:text-6xl font-black mt-4 mb-4 leading-tight">
            The Business Class
            <br />
            <span className="gold">Playbook</span>
          </h1>
          <p className="text-xl text-gray-400">
            Everything you need to fly flatbed for less
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeCategory === cat
                  ? "gradient-gold text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Articles grid */}
          <div className="flex-1">
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((article) => (
                <Link
                  key={article.slug}
                  href={`/guides/${article.slug}`}
                  className="deal-card rounded-2xl p-6 card-glow block group"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        CATEGORY_COLORS[article.categoryLabel!] ??
                        "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {article.categoryLabel}
                    </span>
                    <span className="text-2xl flex-shrink-0">
                      {CATEGORY_ICONS[article.categoryLabel!] ?? "📖"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-3 group-hover:text-yellow-400 transition leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{article.readTime}</span>
                    <span>{formatDate(article.date)}</span>
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && guides.length > 0 && (
              <div className="text-center py-20 text-gray-600">
                <div className="text-5xl mb-4">📚</div>
                <p>No guides in this category yet.</p>
                <p className="text-sm mt-2">More coming soon!</p>
              </div>
            )}

            {guides.length === 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="deal-card rounded-2xl p-6 animate-pulse"
                  >
                    <div className="h-4 bg-white/5 rounded mb-4 w-24" />
                    <div className="h-5 bg-white/5 rounded mb-2" />
                    <div className="h-5 bg-white/5 rounded mb-4 w-3/4" />
                    <div className="h-3 bg-white/5 rounded mb-1" />
                    <div className="h-3 bg-white/5 rounded w-5/6" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div
              className="rounded-2xl p-6 border border-yellow-500/30 mb-6"
              style={{ background: "rgba(245,200,66,0.04)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-yellow-400 pulse" />
                <span className="text-xs font-bold text-yellow-500 uppercase tracking-wide">
                  Active deal now
                </span>
              </div>
              <h4 className="font-bold mb-1">Madrid → New York</h4>
              <p className="text-xs text-gray-500 mb-3">
                Iberia Business · nonstop
              </p>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-black text-green-400">€290</span>
                <span className="text-sm text-gray-600 line-through mb-1">
                  €3,180
                </span>
                <span className="text-xs text-yellow-500 font-bold mb-1">
                  91% off
                </span>
              </div>
              <Link
                href="/deals"
                className="block text-center gradient-gold text-black font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition"
              >
                See all deals →
              </Link>
            </div>

            <div className="deal-card rounded-2xl p-6">
              <div className="text-3xl mb-3">🛋️</div>
              <h4 className="font-bold mb-2">Never miss a deal</h4>
              <p className="text-sm text-gray-500 mb-4">
                Get instant alerts when business class fares drop to insane
                prices.
              </p>
              <Link
                href="/register"
                className="block text-center gradient-gold text-black font-bold py-3 rounded-xl text-sm hover:opacity-90 transition"
              >
                Get free alerts →
              </Link>
              <p className="text-xs text-gray-600 text-center mt-3">
                Free forever · No spam
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
