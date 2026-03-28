import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UpgradeButton from "@/components/UpgradeButton";
import SignOutButton from "@/components/SignOutButton";

const MONTHLY_PRICE_ID = "price_1TFqrXGi2m9cbdSO9ETjNyvd";

const DESTINATION_INFO: Record<string, { name: string; emoji: string }> = {
  NYC: { name: "Nueva York", emoji: "🗽" },
  TYO: { name: "Tokyo", emoji: "🗼" },
  DXB: { name: "Dubai", emoji: "🏙️" },
  BKK: { name: "Bangkok", emoji: "🌴" },
  MIA: { name: "Miami", emoji: "🏖️" },
  MLE: { name: "Maldivas", emoji: "🌊" },
  DPS: { name: "Bali", emoji: "🏔️" },
  LHR: { name: "Londres", emoji: "🇬🇧" },
  CDG: { name: "París", emoji: "🇫🇷" },
  SIN: { name: "Singapur", emoji: "🏯" },
  GRU: { name: "São Paulo", emoji: "🇧🇷" },
  EZE: { name: "Buenos Aires", emoji: "🇦🇷" },
};

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
}

function DealRow({
  deal,
  isBlurred,
  isMatch,
}: {
  deal: Deal;
  isBlurred: boolean;
  isMatch: boolean;
}) {
  return (
    <div
      className={`deal-card rounded-xl p-5 transition relative`}
    >
      <div className={isBlurred ? "blur-sm select-none" : ""}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
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
          {isMatch && (
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="font-black text-lg">
              {deal.origin} → {deal.destination}
            </div>
            <div className="text-gray-400 text-sm">{deal.airline}</div>
          </div>
          <div className="text-right">
            {deal.price_original && (
              <div className="text-gray-500 text-sm line-through">
                €{Number(deal.price_original).toLocaleString()}
              </div>
            )}
            <div className="text-2xl font-black">
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
          <div className="text-xs text-gray-500 mt-2">📅 {deal.dates_available}</div>
        )}
      </div>
      {isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
          <div className="text-center">
            <div className="text-lg mb-1">🔒</div>
            <Link
              href="/pricing"
              className="text-xs gradient-gold text-black font-bold px-3 py-1.5 rounded-full"
            >
              Mejora para ver
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8);

  const { count: alertCount } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("active", true);

  const isPremium = profile?.plan === "premium";
  const displayName = profile?.name || user.email?.split("@")[0] || "Viajero";
  const hasPreferences =
    profile?.dest_preferences && profile.dest_preferences.length > 0;
  const originAirports: string[] = profile?.origin_airports || [];
  const destPreferences: string[] = profile?.dest_preferences || [];

  const allDeals: Deal[] = deals || [];

  const isDealMatch = (deal: Deal) => {
    if (!hasPreferences) return false;
    return (
      originAirports.includes(deal.origin) ||
      destPreferences.includes(deal.destination)
    );
  };

  const matchingDeals = allDeals.filter((d) => isDealMatch(d));
  const otherDeals = allDeals.filter((d) => !isDealMatch(d));

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black">
              Bienvenido, <span className="gold">{displayName}</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {isPremium
                ? "Tienes acceso completo a todas las ofertas y alertas."
                : "Estás en el plan gratuito. Mejora para desbloquear todas las ofertas."}
            </p>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full border self-start ${
              isPremium
                ? "gradient-gold text-black border-transparent"
                : "bg-white/5 text-gray-400 border-white/10"
            }`}
          >
            {isPremium ? "✈️ Premium" : "Explorador"}
          </span>
        </div>

        {/* Onboarding complete banner */}
        {hasPreferences && (
          <div
            className="rounded-2xl border p-5 mb-8 flex flex-wrap items-center justify-between gap-3"
            style={{
              background: "rgba(245,200,66,0.05)",
              borderColor: "rgba(245,200,66,0.25)",
            }}
          >
            <div>
              <p className="font-black text-sm" style={{ color: "#F5C842" }}>
                🎉 ¡Premium activado! Tus alertas están configuradas.
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                {alertCount || 0} alerta{alertCount !== 1 ? "s" : ""} activa
                {alertCount !== 1 ? "s" : ""} · {destPreferences.length} destino
                {destPreferences.length !== 1 ? "s" : ""} monitorizados
              </p>
            </div>
            <Link
              href="/dashboard/alerts"
              className="text-xs font-bold px-4 py-2 rounded-full border transition hover:bg-white/5"
              style={{ borderColor: "rgba(245,200,66,0.30)", color: "#F5C842" }}
            >
              Ver alertas →
            </Link>
          </div>
        )}

        {/* Upgrade CTA (free users only) */}
        {!isPremium && (
          <div
            className="rounded-2xl border border-yellow-500/30 p-6 mb-8 glow"
            style={{ background: "rgba(245,200,66,0.04)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-black text-lg mb-1">
                  Desbloquea todas las ofertas en tiempo real
                </h2>
                <p className="text-gray-400 text-sm">
                  Recibe alertas instantáneas por Telegram, tarifas error y acceso completo por €9/mes.
                </p>
              </div>
              <UpgradeButton priceId={MONTHLY_PRICE_ID} />
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Ofertas activas", value: String(allDeals.length || 24), icon: "🎯" },
            {
              label: "Tus alertas",
              value: hasPreferences ? String(alertCount || 0) : isPremium ? "En directo" : "Retraso 48h",
              icon: "🔔",
            },
            { label: "Ahorro medio", value: "88%", icon: "💰" },
            { label: "Tu plan", value: isPremium ? "Premium" : "Gratis", icon: "⭐" },
          ].map((stat) => (
            <div key={stat.label} className="deal-card rounded-xl p-4">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-black">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ─── PERSONALIZED CONTENT ─── */}
        {hasPreferences ? (
          <>
            {/* Mis destinos */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black">Mis destinos</h2>
                <Link
                  href="/welcome"
                  className="text-xs font-semibold hover:opacity-80 transition"
                  style={{ color: "#F5C842" }}
                >
                  Editar →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {destPreferences.map((destId) => {
                  const info = DESTINATION_INFO[destId];
                  return (
                    <div
                      key={destId}
                      className="deal-card rounded-xl p-4 text-center"
                    >
                      <div className="text-2xl mb-1.5">
                        {info?.emoji || "✈️"}
                      </div>
                      <div className="font-bold text-sm leading-tight">
                        {info?.name || destId}
                      </div>
                      <div className="text-xs mt-1.5 font-medium"
                        style={{ color: "#F5C842" }}>
                        Buscando ofertas...
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matching deals */}
            {matchingDeals.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black">
                    Ofertas activas para ti
                  </h2>
                  <span className="text-xs text-gray-500">
                    {matchingDeals.length} coincidencia
                    {matchingDeals.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-4">
                  {matchingDeals.map((deal) => (
                    <DealRow
                      key={deal.id}
                      deal={deal}
                      isBlurred={deal.is_premium_only && !isPremium}
                      isMatch={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other deals */}
            {otherDeals.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black">Todas las ofertas</h2>
                  <Link
                    href="/deals"
                    className="text-sm font-semibold hover:opacity-80 transition"
                    style={{ color: "#F5C842" }}
                  >
                    Ver todas →
                  </Link>
                </div>
                <div className="space-y-4">
                  {otherDeals.slice(0, 4).map((deal) => (
                    <DealRow
                      key={deal.id}
                      deal={deal}
                      isBlurred={deal.is_premium_only && !isPremium}
                      isMatch={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {matchingDeals.length === 0 && otherDeals.length === 0 && (
              <div className="deal-card rounded-xl p-8 text-center text-gray-500 mb-6">
                <div className="text-4xl mb-3">✈️</div>
                <p>No hay ofertas activas ahora mismo. ¡Vuelve pronto!</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* No preferences: CTA + latest deals */}
            {isPremium && (
              <div
                className="rounded-2xl border p-6 mb-8 flex flex-wrap items-center justify-between gap-4"
                style={{
                  background: "rgba(245,200,66,0.04)",
                  borderColor: "rgba(245,200,66,0.25)",
                }}
              >
                <div>
                  <h2 className="font-black text-lg mb-1">
                    Configura tus destinos
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Dinos a dónde quieres volar y te avisamos cuando aparezcan ofertas.
                  </p>
                </div>
                <Link
                  href="/welcome"
                  className="font-bold px-5 py-3 rounded-xl text-sm hover:opacity-90 transition"
                  style={{
                    background: "linear-gradient(135deg, #F5C842, #f0a500)",
                    color: "#000",
                  }}
                >
                  Configurar destinos →
                </Link>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black">Últimas Ofertas</h2>
                <Link
                  href="/deals"
                  className="text-sm font-semibold hover:opacity-80 transition"
                  style={{ color: "#F5C842" }}
                >
                  Ver todas →
                </Link>
              </div>
              {allDeals.length > 0 ? (
                <div className="space-y-4">
                  {allDeals.slice(0, 3).map((deal) => (
                    <DealRow
                      key={deal.id}
                      deal={deal}
                      isBlurred={deal.is_premium_only && !isPremium}
                      isMatch={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="deal-card rounded-xl p-8 text-center text-gray-500">
                  <div className="text-4xl mb-3">✈️</div>
                  <p>No hay ofertas activas ahora mismo. ¡Vuelve pronto!</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Account info */}
        <div className="deal-card rounded-2xl p-6 mt-8">
          <h2 className="font-black text-lg mb-4">Mi cuenta</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Plan</span>
              <span className={isPremium ? "gold font-bold" : "text-gray-400"}>
                {isPremium ? "Premium" : "Gratis"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Miembro desde</span>
              <span>{new Date(user.created_at).toLocaleDateString("es-ES")}</span>
            </div>
          </div>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
