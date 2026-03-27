"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  "All",
  "Error Fares",
  "Miles & Points",
  "Credit Cards",
  "Upgrades",
  "Routes",
  "Beginners",
];

const articles = [
  {
    category: "Error Fares",
    title: "What Is an Error Fare and How to Exploit It",
    excerpt:
      "Airlines make pricing mistakes every week. Here's exactly how to spot them, book before they disappear, and protect your ticket.",
    readTime: "8 min read",
    date: "Mar 15, 2026",
    slug: "what-is-an-error-fare",
    icon: "⚡",
  },
  {
    category: "Miles & Points",
    title: "Top 5 Miles Programs for Business Class from Spain",
    excerpt:
      "Not all loyalty programs are created equal. These five give Spanish travelers the best redemption value for business class seats.",
    readTime: "12 min read",
    date: "Mar 10, 2026",
    slug: "top-5-miles-programs-spain",
    icon: "🏆",
  },
  {
    category: "Miles & Points",
    title: "Turkish Miles&Smiles: The Complete Guide",
    excerpt:
      "The most underused program in Europe. How to earn points, which partners to book, and why 45,000 miles can get you to New York in business.",
    readTime: "15 min read",
    date: "Mar 5, 2026",
    slug: "turkish-miles-smiles-guide",
    icon: "✈️",
  },
  {
    category: "Upgrades",
    title: "How to Get a Business Class Upgrade at the Airport",
    excerpt:
      "Last-minute upgrade counters, bid auctions, status tricks, and what to say at check-in to maximize your chances.",
    readTime: "6 min read",
    date: "Feb 28, 2026",
    slug: "airport-upgrade-guide",
    icon: "🔼",
  },
  {
    category: "Credit Cards",
    title: "Best Credit Cards for Miles in Spain (2026)",
    excerpt:
      "Sign-up bonuses, earning rates, transfer partners — the definitive ranking of Spanish market credit cards for points collectors.",
    readTime: "10 min read",
    date: "Feb 20, 2026",
    slug: "best-credit-cards-miles-spain-2026",
    icon: "💳",
  },
  {
    category: "Routes",
    title: "Madrid to New York in Business for Under €400",
    excerpt:
      "A step-by-step guide to booking MAD→JFK business class for a fraction of the price, using both error fares and Avios strategies.",
    readTime: "9 min read",
    date: "Feb 12, 2026",
    slug: "madrid-new-york-business-under-400",
    icon: "🗺️",
  },
  {
    category: "Upgrades",
    title: "Companion Certificates: What They Are and How to Use Them",
    excerpt:
      "Many premium credit cards include a free business class ticket. Here's which cards offer them and how to maximize this underused benefit.",
    readTime: "7 min read",
    date: "Feb 5, 2026",
    slug: "companion-certificates-guide",
    icon: "🎫",
  },
  {
    category: "Miles & Points",
    title: "How to Use Flying Blue for Business Class with Delta",
    excerpt:
      "Air France/KLM's Flying Blue is one of the best-kept secrets for booking Delta One business class at a fraction of the cash price.",
    readTime: "11 min read",
    date: "Jan 28, 2026",
    slug: "flying-blue-delta-business-guide",
    icon: "🔵",
  },
];

const categoryColors: Record<string, string> = {
  "Error Fares": "bg-red-500/20 text-red-400",
  "Miles & Points": "bg-blue-500/20 text-blue-400",
  "Credit Cards": "bg-purple-500/20 text-purple-400",
  Upgrades: "bg-green-500/20 text-green-400",
  Routes: "bg-orange-500/20 text-orange-400",
  Beginners: "bg-yellow-500/20 text-yellow-400",
};

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

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
          {categories.map((cat) => (
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
              {filteredArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/guides/${article.slug}`}
                  className="deal-card rounded-2xl p-6 card-glow block group"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        categoryColors[article.category] ||
                        "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {article.category}
                    </span>
                    <span className="text-2xl flex-shrink-0">{article.icon}</span>
                  </div>
                  <h3 className="text-base font-bold mb-3 group-hover:text-yellow-400 transition leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{article.readTime}</span>
                    <span>{article.date}</span>
                  </div>
                </Link>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-20 text-gray-600">
                <div className="text-5xl mb-4">📚</div>
                <p>No guides in this category yet.</p>
                <p className="text-sm mt-2">More coming soon!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            {/* Featured deal */}
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

            {/* Subscribe CTA */}
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
