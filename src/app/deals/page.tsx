"use client";

import { useState } from "react";
import Link from "next/link";
import DealCard from "@/components/DealCard";

const allDeals = [
  {
    type: "error-fare" as const,
    typeBadge: "⚡ Error fare",
    from: "MAD",
    to: "JFK",
    airline: "Iberia Business · nonstop",
    originalPrice: "€3,180",
    dealPrice: "€290",
    savings: "91% off",
    dates: "Jun–Sep 2026",
    duration: "Lasted ~4h",
    status: "✅ Verified",
    timestamp: "48h ago",
    isLocked: false,
  },
  {
    type: "miles-deal" as const,
    typeBadge: "🏆 Miles deal",
    from: "BCN",
    to: "NRT",
    airline: "Turkish Business · IST stopover",
    originalPrice: "€5,400",
    dealPrice: "45K pts",
    savings: "≈92% off",
    dates: "Oct–Nov 2026",
    duration: "48h window",
    status: "✅ Verified",
    timestamp: "3 days ago",
    isLocked: false,
  },
  {
    type: "flash-sale" as const,
    typeBadge: "🔔 Flash sale",
    from: "MAD",
    to: "MIA",
    airline: "Air Europa Business · nonstop",
    originalPrice: "€2,100",
    dealPrice: "€480",
    savings: "77% off",
    dates: "Feb–Apr 2026",
    duration: "Lasted ~6h",
    status: "✅ Ticketed",
    timestamp: "5 days ago",
    isLocked: false,
  },
  {
    type: "card-hack" as const,
    typeBadge: "💳 Card hack",
    from: "MAD",
    to: "DXB",
    airline: "Emirates Business · A380",
    originalPrice: "€3,800",
    dealPrice: "60K pts",
    savings: "≈84% off",
    dates: "Any date",
    duration: "Open window",
    status: "✅ Verified",
    timestamp: "1 week ago",
    isLocked: false,
  },
  {
    type: "error-fare" as const,
    typeBadge: "⚡ Error fare",
    from: "BCN",
    to: "SIN",
    airline: "Singapore Airlines Business",
    originalPrice: "€4,200",
    dealPrice: "€310",
    savings: "93% off",
    dates: "Mar–May 2026",
    duration: "Lasted ~3h",
    status: "⚡ Act fast",
    timestamp: "2h ago",
    isLocked: true,
  },
  {
    type: "miles-deal" as const,
    typeBadge: "🏆 Miles deal",
    from: "MAD",
    to: "LAX",
    airline: "Iberia Business · oneworld",
    originalPrice: "€3,600",
    dealPrice: "38K Avios",
    savings: "≈89% off",
    dates: "Jun–Aug 2026",
    duration: "48h window",
    status: "✅ Verified",
    timestamp: "6h ago",
    isLocked: true,
  },
  {
    type: "flash-sale" as const,
    typeBadge: "🔔 Flash sale",
    from: "MAD",
    to: "BKK",
    airline: "Qatar Airways Business",
    originalPrice: "€4,100",
    dealPrice: "€520",
    savings: "87% off",
    dates: "Apr–Jun 2026",
    duration: "Lasted ~5h",
    status: "⚡ Act fast",
    timestamp: "30m ago",
    isLocked: true,
  },
  {
    type: "error-fare" as const,
    typeBadge: "⚡ Error fare",
    from: "BCN",
    to: "JFK",
    airline: "American Airlines Business",
    originalPrice: "€2,900",
    dealPrice: "€195",
    savings: "93% off",
    dates: "May–Jul 2026",
    duration: "Lasted ~2h",
    status: "⚡ Act fast",
    timestamp: "15m ago",
    isLocked: true,
  },
];

const filterTypes = ["All", "Error fare", "Miles deal", "Flash sale", "Card hack"];
const filterOrigins = ["All", "Madrid (MAD)", "Barcelona (BCN)", "Bogotá (BOG)", "CDMX (MEX)", "Buenos Aires (EZE)", "Miami (MIA)"];
const filterDestinations = ["All", "USA", "Asia", "Europe", "Latam", "Middle East"];
const savingsOptions = ["Any", "50%+", "70%+", "80%+", "90%+"];

export default function DealsPage() {
  const [filterType, setFilterType] = useState("All");
  const [filterOrigin, setFilterOrigin] = useState("All");
  const [filterDest, setFilterDest] = useState("All");
  const [minSavings, setMinSavings] = useState("Any");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSubmitted, setLoginSubmitted] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitted(true);
    setLoginEmail("");
  };

  const visibleDeals = allDeals.slice(0, 4);
  const lockedDeals = allDeals.slice(4);

  return (
    <div className="pt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="deal-card rounded-2xl p-6 sticky top-24">
              <h3 className="font-bold text-sm mb-6">Filter deals</h3>

              {/* Type filter */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                  Deal type
                </label>
                <div className="space-y-2">
                  {filterTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition ${
                        filterType === t
                          ? "gradient-gold text-black font-bold"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Origin filter */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                  Origin
                </label>
                <select
                  value={filterOrigin}
                  onChange={(e) => setFilterOrigin(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                >
                  {filterOrigins.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination filter */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                  Destination
                </label>
                <select
                  value={filterDest}
                  onChange={(e) => setFilterDest(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                >
                  {filterDestinations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Savings filter */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                  Minimum savings
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {savingsOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setMinSavings(s)}
                      className={`text-xs px-3 py-2 rounded-lg transition ${
                        minSavings === s
                          ? "gradient-gold text-black font-bold"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black">Current Deals</h1>
                <p className="text-gray-500 text-sm mt-1">
                  24 active deals across all routes
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-yellow-400 pulse" />
                Updated 3 minutes ago
              </div>
            </div>

            {/* Visible deals grid */}
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              {visibleDeals.map((deal, i) => (
                <DealCard key={i} {...deal} />
              ))}
            </div>

            {/* Locked deals with login wall */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-5 opacity-40 pointer-events-none select-none">
                {lockedDeals.map((deal, i) => (
                  <DealCard key={i} {...deal} />
                ))}
              </div>

              {/* Login wall overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl"
                style={{ background: "rgba(10,10,15,0.85)" }}
              >
                <div className="text-center max-w-sm px-6">
                  <div className="text-5xl mb-4">🔒</div>
                  <h3 className="text-2xl font-black mb-2">
                    Unlock all 24 deals
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Join free to see all current deals. Premium members get
                    instant alerts the moment a deal drops.
                  </p>
                  {loginSubmitted ? (
                    <p className="text-green-400 font-bold">
                      You&apos;re in! Check your inbox.
                    </p>
                  ) : (
                    <>
                      <form
                        onSubmit={handleLoginSubmit}
                        className="flex flex-col gap-3 mb-4"
                      >
                        <input
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="px-4 py-3 rounded-xl text-sm w-full"
                        />
                        <button
                          type="submit"
                          className="gradient-gold text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
                        >
                          Join free — Unlock all deals
                        </button>
                      </form>
                      <p className="text-xs text-gray-600">
                        Already a member?{" "}
                        <Link
                          href="/login"
                          className="text-yellow-500 hover:text-yellow-400"
                        >
                          Log in
                        </Link>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
