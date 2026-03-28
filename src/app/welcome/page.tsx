"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const AIRPORTS = [
  { iata: "MAD", city: "Madrid", flag: "🇪🇸" },
  { iata: "BCN", city: "Barcelona", flag: "🇪🇸" },
  { iata: "AGP", city: "Málaga", flag: "🇪🇸" },
  { iata: "MEX", city: "México D.F.", flag: "🇲🇽" },
  { iata: "BOG", city: "Bogotá", flag: "🇨🇴" },
  { iata: "EZE", city: "Buenos Aires", flag: "🇦🇷" },
  { iata: "MIA", city: "Miami", flag: "🇺🇸" },
  { iata: "LIM", city: "Lima", flag: "🇵🇪" },
];

const DESTINATIONS = [
  { id: "NYC", name: "Nueva York", emoji: "🗽", tagline: "La ciudad que nunca duerme" },
  { id: "TYO", name: "Tokyo", emoji: "🗼", tagline: "Tradición y futuro" },
  { id: "DXB", name: "Dubai", emoji: "🏙️", tagline: "Lujo sin límites" },
  { id: "BKK", name: "Bangkok", emoji: "🌴", tagline: "El paraíso asiático" },
  { id: "MIA", name: "Miami", emoji: "🏖️", tagline: "Sol, playa y negocios" },
  { id: "MLE", name: "Maldivas", emoji: "🌊", tagline: "El sueño tropical" },
  { id: "DPS", name: "Bali", emoji: "🏔️", tagline: "Paz y aventura" },
  { id: "LHR", name: "Londres", emoji: "🇬🇧", tagline: "La capital del mundo" },
  { id: "CDG", name: "París", emoji: "🇫🇷", tagline: "La ciudad del amor" },
  { id: "SIN", name: "Singapur", emoji: "🏯", tagline: "Asia en su máxima expresión" },
  { id: "GRU", name: "São Paulo", emoji: "🇧🇷", tagline: "La potencia latina" },
  { id: "EZE", name: "Buenos Aires", emoji: "🇦🇷", tagline: "Tango y pasión" },
];

const DEAL_TYPES = [
  { id: "error_fare", icon: "⚡", label: "Tarifas error", desc: "Errores de precio de aerolíneas. Hasta 90% dto." },
  { id: "miles", icon: "🏆", label: "Ofertas con millas", desc: "Canjes con valor excepcional" },
  { id: "flash_sale", icon: "🔔", label: "Flash sales", desc: "Promociones relámpago" },
  { id: "voucher", icon: "💳", label: "Upgrades y vouchers", desc: "Trucos para subir de clase" },
];

function WelcomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPremium = searchParams.get("premium") === "true";

  const [step, setStep] = useState(1);
  const [selectedAirports, setSelectedAirports] = useState<string[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [customAirport, setCustomAirport] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedDealTypes, setSelectedDealTypes] = useState<string[]>(
    DEAL_TYPES.map((d) => d.id)
  );
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
      else setCheckingAuth(false);
    });
  }, []);

  const toggleAirport = (iata: string) => {
    setSelectedAirports((prev) => {
      if (prev.includes(iata)) return prev.filter((a) => a !== iata);
      if (prev.length >= 3) return prev;
      return [...prev, iata];
    });
  };

  const toggleDestination = (id: string) => {
    setSelectedDestinations((prev) => {
      if (prev.includes(id)) return prev.filter((d) => d !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const toggleDealType = (id: string) => {
    setSelectedDealTypes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const airports = [...selectedAirports];
    if (customAirport.trim()) airports.push(customAirport.trim().toUpperCase().slice(0, 3));

    await supabase
      .from("profiles")
      .update({
        origin_airports: airports,
        dest_preferences: selectedDestinations,
      })
      .eq("id", user.id);

    if (airports.length > 0 && selectedDestinations.length > 0) {
      const alertInserts = [];
      for (const origin of airports) {
        for (const destination of selectedDestinations) {
          alertInserts.push({
            user_id: user.id,
            origin,
            destination,
            deal_types: selectedDealTypes,
            channels: telegramEnabled ? ["email", "telegram"] : ["email"],
            active: true,
          });
        }
      }
      await supabase.from("alerts").insert(alertInserts);
    }

    router.push("/dashboard");
  };

  if (checkingAuth) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm">Cargando...</div>
      </div>
    );
  }

  const progressPct = (step / 4) * 100;

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-6">
          {isPremium && (
            <div className="inline-flex items-center gap-2 gradient-gold text-black text-sm font-bold px-4 py-2 rounded-full mb-4">
              🎉 ¡Premium activado! Ahora configura tus alertas
            </div>
          )}
          <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">
            Paso {step} de 4
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full mb-10" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #F5C842, #f0a500)",
            }}
          />
        </div>

        {/* ─── STEP 1: Origen ─── */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-black mb-2">¿Desde dónde vuelas?</h1>
            <p className="text-gray-500 text-sm mb-8">
              Selecciona hasta 3 aeropuertos de origen.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              {AIRPORTS.map((airport) => {
                const selected = selectedAirports.includes(airport.iata);
                return (
                  <button
                    key={airport.iata}
                    onClick={() => toggleAirport(airport.iata)}
                    className="text-left rounded-xl p-4 transition-all duration-200 border"
                    style={{
                      background: selected
                        ? "rgba(245,200,66,0.07)"
                        : "rgba(255,255,255,0.03)",
                      borderColor: selected
                        ? "rgba(245,200,66,0.55)"
                        : "rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="text-2xl mb-1.5">{airport.flag}</div>
                    <div className="font-bold text-sm leading-tight">{airport.city}</div>
                    <div
                      className="text-xs font-mono mt-0.5"
                      style={{ color: "#F5C842" }}
                    >
                      {airport.iata}
                    </div>
                  </button>
                );
              })}

              {/* Otro */}
              <button
                onClick={() => setShowCustom(!showCustom)}
                className="text-left rounded-xl p-4 transition-all duration-200 border"
                style={{
                  background: showCustom
                    ? "rgba(245,200,66,0.07)"
                    : "rgba(255,255,255,0.03)",
                  borderColor: showCustom
                    ? "rgba(245,200,66,0.55)"
                    : "rgba(255,255,255,0.07)",
                }}
              >
                <div className="text-2xl mb-1.5">✈️</div>
                <div className="font-bold text-sm leading-tight">Otro</div>
                <div className="text-xs text-gray-600 mt-0.5">Código IATA</div>
              </button>
            </div>

            {showCustom && (
              <input
                type="text"
                placeholder="Código IATA (ej. VLC)"
                maxLength={3}
                value={customAirport}
                onChange={(e) => setCustomAirport(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 mb-5 uppercase"
                autoFocus
              />
            )}

            <button
              onClick={() => setStep(2)}
              disabled={selectedAirports.length === 0 && !customAirport.trim()}
              className="w-full font-bold px-6 py-4 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #F5C842, #f0a500)", color: "#000" }}
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* ─── STEP 2: Destinos ─── */}
        {step === 2 && (
          <div>
            <h1 className="text-3xl font-black mb-2">
              ¿A dónde sueñas volar en business?
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Elige de 2 a 5 destinos que te gustaría visitar.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {DESTINATIONS.map((dest) => {
                const selected = selectedDestinations.includes(dest.id);
                return (
                  <button
                    key={dest.id}
                    onClick={() => toggleDestination(dest.id)}
                    className="text-left rounded-2xl p-5 transition-all duration-200 border relative"
                    style={{
                      background: selected
                        ? "linear-gradient(135deg, rgba(245,200,66,0.09) 0%, rgba(255,255,255,0.02) 100%)"
                        : "rgba(255,255,255,0.03)",
                      borderColor: selected
                        ? "rgba(245,200,66,0.55)"
                        : "rgba(255,255,255,0.07)",
                      transform: selected ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <div className="text-3xl mb-2">{dest.emoji}</div>
                    <div className="font-black text-sm leading-tight">{dest.name}</div>
                    <div className="text-gray-500 text-xs mt-1 leading-tight">
                      {dest.tagline}
                    </div>
                    {selected && (
                      <div
                        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #F5C842, #f0a500)" }}
                      >
                        <span className="text-black text-xs font-black leading-none">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-4 rounded-xl text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition text-sm font-semibold"
              >
                ← Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={selectedDestinations.length < 2}
                className="flex-1 font-bold px-6 py-4 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #F5C842, #f0a500)", color: "#000" }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Tipos de oferta ─── */}
        {step === 3 && (
          <div>
            <h1 className="text-3xl font-black mb-2">
              ¿Qué tipo de ofertas te interesan?
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Desactiva los tipos que no te interesen.
            </p>

            <div className="space-y-3 mb-8">
              {DEAL_TYPES.map((type) => {
                const active = selectedDealTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleDealType(type.id)}
                    className="w-full rounded-xl p-5 text-left flex items-center gap-4 transition-all duration-200 border"
                    style={{
                      background: active
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(255,255,255,0.01)",
                      borderColor: active
                        ? "rgba(245,200,66,0.35)"
                        : "rgba(255,255,255,0.06)",
                      opacity: active ? 1 : 0.5,
                    }}
                  >
                    <div className="text-2xl w-8 flex-shrink-0">{type.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{type.label}</div>
                      <div className="text-gray-500 text-xs mt-0.5 leading-snug">
                        {type.desc}
                      </div>
                    </div>
                    {/* Toggle pill */}
                    <div
                      className="w-11 h-6 rounded-full flex-shrink-0 flex items-center transition-all duration-200"
                      style={{
                        background: active
                          ? "linear-gradient(90deg, #F5C842, #f0a500)"
                          : "rgba(255,255,255,0.10)",
                        justifyContent: active ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full mx-1"
                        style={{ background: active ? "#000" : "#555" }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-4 rounded-xl text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition text-sm font-semibold"
              >
                ← Atrás
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={selectedDealTypes.length === 0}
                className="flex-1 font-bold px-6 py-4 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #F5C842, #f0a500)", color: "#000" }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 4: Notificaciones ─── */}
        {step === 4 && (
          <div>
            <h1 className="text-3xl font-black mb-2">
              ¿Cómo quieres recibir alertas?
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Configura tus canales de notificación.
            </p>

            <div className="space-y-4 mb-8">
              {/* Email — always on */}
              <div
                className="rounded-xl p-5 flex items-center gap-4 border"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(245,200,66,0.35)",
                }}
              >
                <div className="text-2xl w-8 flex-shrink-0">📧</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">Email</div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    Alertas instantáneas a tu correo — siempre activo
                  </div>
                </div>
                <div
                  className="w-11 h-6 rounded-full flex items-center justify-end flex-shrink-0 opacity-60"
                  style={{ background: "linear-gradient(90deg, #F5C842, #f0a500)" }}
                >
                  <div className="w-4 h-4 rounded-full bg-black mx-1" />
                </div>
              </div>

              {/* Telegram */}
              <button
                onClick={() => setTelegramEnabled(!telegramEnabled)}
                className="w-full rounded-xl p-5 text-left flex items-center gap-4 transition-all duration-200 border"
                style={{
                  background: telegramEnabled
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.02)",
                  borderColor: telegramEnabled
                    ? "rgba(245,200,66,0.35)"
                    : "rgba(255,255,255,0.07)",
                }}
              >
                <div className="text-2xl w-8 flex-shrink-0">📱</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">Telegram</div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    Alertas al instante vía{" "}
                    <span style={{ color: "#F5C842" }}>@Getflatbedbot</span>
                  </div>
                </div>
                <div
                  className="w-11 h-6 rounded-full flex-shrink-0 flex items-center transition-all duration-200"
                  style={{
                    background: telegramEnabled
                      ? "linear-gradient(90deg, #F5C842, #f0a500)"
                      : "rgba(255,255,255,0.10)",
                    justifyContent: telegramEnabled ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full mx-1"
                    style={{ background: telegramEnabled ? "#000" : "#555" }}
                  />
                </div>
              </button>

              {telegramEnabled && (
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    background: "rgba(245,200,66,0.04)",
                    borderColor: "rgba(245,200,66,0.20)",
                  }}
                >
                  <p className="text-sm font-bold mb-1" style={{ color: "#F5C842" }}>
                    Cómo conectar Telegram
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Busca{" "}
                    <span className="font-mono" style={{ color: "#F5C842" }}>
                      @Getflatbedbot
                    </span>{" "}
                    en Telegram y envía{" "}
                    <span className="font-mono" style={{ color: "#F5C842" }}>
                      /start
                    </span>
                    . Podrás completar la conexión desde tu dashboard.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-4 rounded-xl text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition text-sm font-semibold"
              >
                ← Atrás
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex-1 font-bold px-6 py-4 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #F5C842, #f0a500)", color: "#000" }}
              >
                {loading ? "Activando..." : "🎯 Activar mis alertas"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-gray-500 text-sm">Cargando...</div>
        </div>
      }
    >
      <WelcomeInner />
    </Suspense>
  );
}
