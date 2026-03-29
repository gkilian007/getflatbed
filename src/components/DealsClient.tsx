"use client";

import { useState } from "react";
import Link from "next/link";

interface Deal {
  id: string;
  type: string;
  origin: string;
  destination: string;
  airline: string;
  price_original: number | null;
  price_deal: number | null;
  savings_pct: number | null;
  dates_available: string | null;
  is_premium_only: boolean;
  status: string;
  created_at: string;
  affiliate_url: string | null;
}

interface DealsClientProps {
  deals: Deal[];
  isLoggedIn: boolean;
  isPremium: boolean;
  userOrigins?: string[];
  userDestinations?: string[];
}

const dealTypeLabels: Record<string, string> = {
  error_fare: "⚡ Tarifa error",
  miles: "🏆 Oferta con millas",
  flash_sale: "🔔 Flash sale",
  voucher: "💳 Bono",
};

const dealTypeColors: Record<string, string> = {
  error_fare: "text-red-400 bg-red-400/10 border-red-400/20",
  miles: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  flash_sale: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  voucher: "text-green-400 bg-green-400/10 border-green-400/20",
};

const filterTypeOptions = ["Todos", "Tarifa error", "Oferta con millas", "Flash sale"];
const filterOrigins = ["Todos", "MAD", "BCN", "BOG", "MEX", "EZE", "MIA"];
const savingsOptions = ["Cualquier", "50%+", "70%+", "80%+", "90%+"];

function getDealTypeFilter(deal: Deal, filter: string) {
  if (filter === "Todos") return true;
  const map: Record<string, string> = {
    "Tarifa error": "error_fare",
    "Oferta con millas": "miles",
    "Flash sale": "flash_sale",
  };
  return deal.type === map[filter];
}

function getSavingsFilter(deal: Deal, filter: string) {
  if (filter === "Cualquier") return true;
  const pct = deal.savings_pct || 0;
  const threshold = parseInt(filter);
  return pct >= threshold;
}

export default function DealsClient({
  deals,
  isLoggedIn,
  isPremium,
  userOrigins = [],
  userDestinations = [],
}: DealsClientProps) {
  const [filterType, setFilterType] = useState("Todos");
  const [filterOrigin, setFilterOrigin] = useState("Todos");
  const [minSavings, setMinSavings] = useState("Cualquier");
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSubmitted, setLoginSubmitted] = useState(false);

  const hasUserPrefs = userOrigins.length > 0 || userDestinations.length > 0;

  const isDealMatch = (deal: Deal) => {
    if (!hasUserPrefs) return false;
    return (
      userOrigins.includes(deal.origin) ||
      userDestinations.includes(deal.destination)
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitted(true);
    setLoginEmail("");
  };

  // Apply filters
  const filtered = deals.filter((d) => {
    if (!getDealTypeFilter(d, filterType)) return false;
    if (filterOrigin !== "Todos" && d.origin !== filterOrigin) return false;
    if (!getSavingsFilter(d, minSavings)) return false;
    if (showOnlyMine && !isDealMatch(d)) return false;
    return true;
  });

  // Sort: matching deals first, then by date
  const sorted = [...filtered].sort((a, b) => {
    const aMatch = isDealMatch(a) ? 1 : 0;
    const bMatch = isDealMatch(b) ? 1 : 0;
    if (bMatch !== aMatch) return bMatch - aMatch;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const showLoginWall = !isLoggedIn && sorted.length > 3;
  const visibleDeals = showLoginWall ? sorted.slice(0, 3) : sorted;
  const hiddenDeals = showLoginWall ? sorted.slice(3) : [];

  return (
    <div className="pt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="deal-card rounded-2xl p-6 sticky top-24">
              <h3 className="font-bold text-sm mb-6">Filtrar ofertas</h3>

              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                  Tipo de oferta
                </label>
                <div className="space-y-2">
                  {filterTypeOptions.map((t) => (
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

              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                  Origen
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

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                  Ahorro mínimo
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-black">Ofertas Actuales</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {sorted.length} oferta{sorted.length !== 1 ? "s" : ""} activa
                  {sorted.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-yellow-400 pulse" />
                Datos en directo
              </div>
            </div>

            {/* "Mis destinos" quick filter (premium users with prefs) */}
            {hasUserPrefs && isPremium && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <button
                  onClick={() => setShowOnlyMine(!showOnlyMine)}
                  className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                    showOnlyMine
                      ? "gradient-gold text-black border-transparent"
                      : "border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/5"
                  }`}
                >
                  ⭐ Mis destinos
                </button>
                {showOnlyMine && (
                  <button
                    onClick={() => setShowOnlyMine(false)}
                    className="text-xs text-gray-500 hover:text-gray-300 transition"
                  >
                    Ver todas
                  </button>
                )}
              </div>
            )}

            {sorted.length === 0 ? (
              <div className="deal-card rounded-xl p-12 text-center text-gray-500">
                <div className="text-4xl mb-3">✈️</div>
                <p>Ninguna oferta coincide con tus filtros. Prueba a ajustarlos.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  {visibleDeals.map((deal) => {
                    const needsUpgrade = deal.is_premium_only && !isPremium && isLoggedIn;
                    const isMatch = isDealMatch(deal);
                    return (
                      <div key={deal.id} className="deal-card rounded-2xl p-5 relative">
                        <div className={needsUpgrade ? "blur-sm select-none" : ""}>
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                dealTypeColors[deal.type] || "text-gray-400 bg-white/5 border-white/10"
                              }`}
                            >
                              {dealTypeLabels[deal.type] || deal.type}
                            </span>
                            {deal.is_premium_only && (
                              <span className="text-xs gradient-gold text-black font-bold px-2 py-0.5 rounded-full">
                                Premium
                              </span>
                            )}
                            {isMatch && isPremium && (
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  background: "rgba(245,200,66,0.15)",
                                  color: "#F5C842",
                                  border: "1px solid rgba(245,200,66,0.35)",
                                }}
                              >
                                ⭐ Para ti
                              </span>
                            )}
                          </div>
                          <Link href={`/deals/${deal.id}`} className="block hover:opacity-80 transition">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <div className="text-xl font-black">
                                  {deal.origin} → {deal.destination}
                                </div>
                                <div className="text-gray-400 text-sm">{deal.airline}</div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                {deal.price_original && (
                                  <div className="text-gray-500 text-xs line-through">
                                    €{Number(deal.price_original).toLocaleString()}
                                  </div>
                                )}
                                <div className="text-xl font-black">
                                  {deal.type === "miles"
                                    ? `${Number(deal.price_deal).toLocaleString()}pts`
                                    : `€${Number(deal.price_deal).toLocaleString()}`}
                                </div>
                                {deal.savings_pct && (
                                  <div className="text-green-400 text-sm font-bold">
                                    {deal.savings_pct}% dto.
                                  </div>
                                )}
                              </div>
                            </div>
                            {deal.dates_available && (
                              <div className="text-xs text-gray-500 mt-3">
                                📅 {deal.dates_available}
                              </div>
                            )}
                          </Link>

                          {/* CTA Buttons */}
                          <div className="mt-4 flex gap-2">
                            {deal.affiliate_url ? (
                              <a
                                href={deal.affiliate_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center gradient-gold text-black font-bold py-3 rounded-xl hover:opacity-90 transition text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Reservar →
                              </a>
                            ) : (
                              <Link
                                href={`/deals/${deal.id}`}
                                className="flex-1 text-center gradient-gold text-black font-bold py-3 rounded-xl hover:opacity-90 transition text-sm"
                              >
                                Cómo reservar →
                              </Link>
                            )}
                            <Link
                              href={`/deals/${deal.id}`}
                              className="px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-200 bg-white/5 hover:bg-white/10 transition"
                            >
                              Ver detalles
                            </Link>
                          </div>
                        </div>

                        {needsUpgrade && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
                            <div className="text-center px-4">
                              <div className="text-2xl mb-2">🔒</div>
                              <p className="text-xs text-gray-300 mb-3">Oferta Premium</p>
                              <Link
                                href="/pricing"
                                className="text-xs gradient-gold text-black font-bold px-4 py-2 rounded-full"
                              >
                                Mejora para desbloquear
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Login wall */}
                {showLoginWall && hiddenDeals.length > 0 && (
                  <div className="relative">
                    <div className="grid md:grid-cols-2 gap-5 opacity-40 pointer-events-none select-none">
                      {hiddenDeals.map((deal) => (
                        <div key={deal.id} className="deal-card rounded-2xl p-5">
                          <div className="text-lg font-black">
                            {deal.origin} → {deal.destination}
                          </div>
                          <div className="text-gray-400 text-sm">{deal.airline}</div>
                        </div>
                      ))}
                    </div>

                    <div
                      className="absolute inset-0 flex items-center justify-center rounded-2xl"
                      style={{ background: "rgba(10,10,15,0.85)" }}
                    >
                      <div className="text-center max-w-sm px-6">
                        <div className="text-5xl mb-4">🔒</div>
                        <h3 className="text-2xl font-black mb-2">
                          Desbloquea las {deals.length} ofertas
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                          Únete gratis para ver todas las ofertas actuales. Los miembros Premium reciben alertas instantáneas.
                        </p>
                        {loginSubmitted ? (
                          <p className="text-green-400 font-bold">
                            ¡Ya eres miembro! Revisa tu bandeja de entrada.
                          </p>
                        ) : (
                          <>
                            <form
                              onSubmit={handleLoginSubmit}
                              className="flex flex-col gap-3 mb-4"
                            >
                              <input
                                type="email"
                                placeholder="tu@email.com"
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="px-4 py-3 rounded-xl text-sm w-full"
                              />
                              <button
                                type="submit"
                                className="gradient-gold text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
                              >
                                Únete gratis — Ver todas las ofertas
                              </button>
                            </form>
                            <p className="text-xs text-gray-600">
                              ¿Ya tienes cuenta?{" "}
                              <Link
                                href="/login"
                                className="text-yellow-500 hover:text-yellow-400"
                              >
                                Iniciar sesión
                              </Link>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
