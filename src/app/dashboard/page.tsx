import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MONTHLY_PRICE_ID = "price_1TFqrXGi2m9cbdSO9ETjNyvd";

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

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
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
    .limit(3);

  const isPremium = profile?.plan === "premium";
  const displayName = profile?.name || user.email?.split("@")[0] || "Viajero";

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
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
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                isPremium
                  ? "gradient-gold text-black border-transparent"
                  : "bg-white/5 text-gray-400 border-white/10"
              }`}
            >
              {isPremium ? "✈️ Premium" : "Explorador"}
            </span>
          </div>
        </div>

        {/* Upgrade CTA (free users only) */}
        {!isPremium && (
          <div
            className="rounded-2xl border border-yellow-500/30 p-6 mb-10 glow"
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
            { label: "Ofertas activas", value: "24", icon: "🎯" },
            { label: "Tus alertas", value: isPremium ? "En directo" : "Retraso 48h", icon: "🔔" },
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

        {/* Latest Deals */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">Últimas Ofertas</h2>
            <Link
              href="/deals"
              className="text-yellow-500 hover:text-yellow-400 text-sm font-semibold"
            >
              Ver todas →
            </Link>
          </div>

          {deals && deals.length > 0 ? (
            <div className="space-y-4">
              {deals.map((deal) => {
                const isBlurred = deal.is_premium_only && !isPremium;
                return (
                  <div
                    key={deal.id}
                    className={`deal-card rounded-xl p-5 transition ${isBlurred ? "relative" : ""}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className={isBlurred ? "blur-sm select-none" : ""}>
                        <div className="flex items-center gap-2 mb-2">
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
                        </div>
                        <div className="font-black text-lg">
                          {deal.origin} → {deal.destination}
                        </div>
                        <div className="text-gray-400 text-sm">{deal.airline}</div>
                      </div>
                      <div className={`text-right ${isBlurred ? "blur-sm select-none" : ""}`}>
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
                      <div className={`text-xs text-gray-500 mt-2 ${isBlurred ? "blur-sm select-none" : ""}`}>
                        📅 {deal.dates_available}
                      </div>
                    )}
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
              })}
            </div>
          ) : (
            <div className="deal-card rounded-xl p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">✈️</div>
              <p>No hay ofertas activas ahora mismo. ¡Vuelve pronto!</p>
            </div>
          )}
        </div>

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

// Client components for interactive parts
import UpgradeButton from "@/components/UpgradeButton";
import SignOutButton from "@/components/SignOutButton";
