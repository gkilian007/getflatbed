"use client";

import { useState } from "react";
import Link from "next/link";
import DealCard from "@/components/DealCard";

interface FeaturedDeal {
  id: string;
  type: string;
  origin: string;
  destination: string;
  airline: string;
  price_original: number | null;
  price_deal: number | null;
  savings_pct: number | null;
  dates_available: string | null;
  affiliate_url: string | null;
}

interface HomeClientProps {
  featuredDeals: FeaturedDeal[];
  activeCount: number;
}

const IATA_TO_CITY: Record<string, string> = {
  MAD: "Madrid", BCN: "Barcelona", AGP: "Málaga",
  JFK: "Nueva York", EWR: "Nueva York", MIA: "Miami",
  GRU: "São Paulo", NRT: "Tokio", DXB: "Dubái",
  LAX: "Los Ángeles", BOG: "Bogotá", LIM: "Lima",
  EZE: "Buenos Aires", BKK: "Bangkok", SIN: "Singapur",
  HKG: "Hong Kong", LHR: "Londres", CDG: "París",
  ICN: "Seúl", YYZ: "Toronto", ORD: "Chicago",
  SCL: "Santiago", MEX: "Ciudad de México", IST: "Estambul",
  DOH: "Doha", SYD: "Sídney",
};

const TYPE_LABELS: Record<string, string> = {
  error_fare: "⚡ Tarifa error",
  miles: "🏆 Oferta con millas",
  flash_sale: "🔔 Flash sale",
  voucher: "💳 Bono",
};

const TYPE_TO_CARD: Record<string, "error-fare" | "miles-deal" | "flash-sale" | "card-hack"> = {
  error_fare: "error-fare",
  miles: "miles-deal",
  flash_sale: "flash-sale",
  voucher: "card-hack",
};

function cityName(iata: string): string {
  return IATA_TO_CITY[iata] || iata;
}

export default function HomeClient({ featuredDeals, activeCount }: HomeClientProps) {
  const [heroEmail, setHeroEmail] = useState("");
  const [ctaEmail, setCtaEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent, email: string, setter: (v: string) => void) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setter("");
      setShowModal(true);
    } catch {
      setError("Algo salió mal. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const sampleDeals = [
    {
      type: "error-fare" as const,
      typeBadge: "⚡ Tarifa error",
      from: "Madrid",
      to: "Nueva York",
      airline: "Iberia Business · JFK directo",
      originalPrice: "€3.180",
      dealPrice: "€290",
      savings: "91% dto.",
      dates: "Jun–Sep 2025",
      duration: "Duró 3h",
      status: "✅ Emitido",
      timestamp: "hace 48h",
    },
    {
      type: "miles-deal" as const,
      typeBadge: "🏆 Oferta con millas",
      from: "Barcelona",
      to: "Tokio",
      airline: "Turkish Airlines Business · conexión IST",
      originalPrice: "€5.400",
      dealPrice: "45K pts",
      savings: "≈€450 de valor",
      dates: "Oct–Nov 2025",
      duration: "Ventana 48h",
      status: "✅ Disponible ahora",
      timestamp: "hace 3 días",
    },
    {
      type: "flash-sale" as const,
      typeBadge: "🔔 Flash sale",
      from: "Madrid",
      to: "Miami",
      airline: "Air Europa Business · directo",
      originalPrice: "€2.100",
      dealPrice: "€480",
      savings: "77% dto.",
      dates: "Feb–Abr 2026",
      duration: "Duró 6h",
      status: "✅ Emitido",
      timestamp: "hace 5 días",
    },
    {
      type: "card-hack" as const,
      typeBadge: "💳 Hack con tarjeta",
      from: "Madrid",
      to: "Dubái",
      airline: "Emirates Business · cubierta superior A380",
      originalPrice: "€3.800",
      dealPrice: "60K pts",
      savings: "≈€380 de valor",
      dates: "Cualquier fecha",
      duration: "Ventana abierta",
      status: "✅ Guía de estrategia",
      timestamp: "hace 1 semana",
    },
  ];

  const hasRealDeals = featuredDeals.length > 0;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, #F5C842, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-sm text-yellow-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-yellow-400 pulse" />
          {activeCount > 0
            ? `${activeCount} oferta${activeCount !== 1 ? "s" : ""} activa${activeCount !== 1 ? "s" : ""} ahora mismo`
            : "Únete a más de 200 miembros — plazas limitadas"}
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] max-w-5xl mb-6">
          Deja de pagar precio completo
          <br />
          por <span className="gold">Business Class</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-4">
          Encontramos tarifas error, ofertas secretas y trucos con millas para que vueles
          flatbed
          <br className="hidden md:block" /> hasta un{" "}
          <strong className="text-white">90% más barato</strong> que el precio de lista.
        </p>

        <p className="text-sm text-gray-600 mb-10">
          Madrid → NYC Business. Precio normal: €3.200 · Encontrado por miembros:{" "}
          <span className="text-green-400 font-semibold">€340</span>
        </p>

        {/* CTA form */}
        <form
          onSubmit={(e) => handleSubmit(e, heroEmail, setHeroEmail)}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto mb-6"
        >
          <input
            type="email"
            placeholder="tu@email.com"
            required
            value={heroEmail}
            onChange={(e) => setHeroEmail(e.target.value)}
            className="flex-1 px-5 py-4 rounded-xl text-base"
          />
          <button
            type="submit"
            className="gradient-gold text-black font-black px-7 py-4 rounded-xl hover:opacity-90 transition whitespace-nowrap"
          >
            Recibe alertas gratis →
          </button>
        </form>
        <p className="text-xs text-gray-600">
          Siempre gratis · Sin tarjeta · Cancela cuando quieras
        </p>

        {/* Floating couch emoji */}
        <div className="mt-16 float text-6xl select-none">🛋️</div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg w-full">
          <div>
            <div className="text-3xl font-black gold">87%</div>
            <div className="text-xs text-gray-500 mt-1">
              ahorro medio
              <br />
              vs. precio normal
            </div>
          </div>
          <div className="border-x border-white/10">
            <div className="text-3xl font-black gold">3–5</div>
            <div className="text-xs text-gray-500 mt-1">
              ofertas por
              <br />
              semana
            </div>
          </div>
          <div>
            <div className="text-3xl font-black gold">24h</div>
            <div className="text-xs text-gray-500 mt-1">
              ventana de alerta
              <br />
              antes de agotarse
            </div>
          </div>
        </div>
      </section>

      {/* TRUST LOGOS */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest text-gray-600 uppercase mb-8">
            Ofertas encontradas en
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              "Iberia",
              "Emirates",
              "Turkish Airlines",
              "Air Europa",
              "Lufthansa",
            ].map((airline) => (
              <span
                key={airline}
                className="text-sm font-bold text-gray-600 hover:text-gray-400 transition"
              >
                {airline}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — MINI */}
      <section id="how" className="py-28 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              Cómo funciona
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">
              Más listo que cualquier agencia de viajes
            </h2>
            <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
              Monitorizamos cientos de fuentes 24/7 para que nunca más te pierdas una oferta.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="deal-card rounded-2xl p-8 card-glow">
              <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center text-black text-xl font-black mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Cazamos tarifas error</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Las aerolíneas cometen errores de precio. Los detectamos en segundos —
                antes de que desaparezcan. Un vuelo de €4.000 que pasa a €290 es
                real, y ocurre cada semana.
              </p>
            </div>

            <div className="deal-card rounded-2xl p-8 card-glow">
              <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center text-black text-xl font-black mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Trucos con millas y puntos</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Turkish Miles&amp;Smiles. Flying Blue. Avios. Te decimos
                exactamente qué programa usar y cómo conseguir los puntos —
                a veces casi gratis con la tarjeta adecuada.
              </p>
            </div>

            <div className="deal-card rounded-2xl p-8 card-glow">
              <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center text-black text-xl font-black mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Upgrades y bonos</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Upgrades de última hora, certificados de acompañante y subastas de asientos.
                Te enseñamos a jugar el juego que las aerolíneas no quieren que conozcas.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/how-it-works"
              className="text-sm text-yellow-500 hover:text-yellow-400 transition font-semibold"
            >
              Saber más sobre cómo encontramos las ofertas →
            </Link>
          </div>
        </div>
      </section>

      {/* DEALS SECTION */}
      <section id="deals" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              {hasRealDeals ? "Últimas ofertas" : "Deals recientes"}
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">
              Ofertas reales. Ahorros reales.
            </h2>
            {hasRealDeals ? (
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-yellow-400 pulse inline-block" />
                <p className="text-yellow-400 font-semibold text-sm">
                  {activeCount} oferta{activeCount !== 1 ? "s" : ""} activa{activeCount !== 1 ? "s" : ""} ahora mismo
                </p>
              </div>
            ) : (
              <p className="text-gray-400 mt-4">
                Esto es lo que consiguen nuestros miembros. Los suscriptores Premium reciben las alertas primero.
              </p>
            )}
          </div>

          {hasRealDeals ? (
            <div className="grid md:grid-cols-2 gap-5">
              {featuredDeals.map((deal) => {
                const priceStr =
                  deal.type === "miles"
                    ? deal.price_deal
                      ? `${Number(deal.price_deal).toLocaleString()} millas`
                      : "—"
                    : deal.price_deal
                    ? `€${Number(deal.price_deal).toLocaleString()}`
                    : "—";
                const originalStr = deal.price_original
                  ? `€${Number(deal.price_original).toLocaleString()}`
                  : "";
                const savingsStr = deal.savings_pct ? `${deal.savings_pct}% dto.` : "";

                return (
                  <Link key={deal.id} href={`/deals/${deal.id}`} className="block">
                    <DealCard
                      type={TYPE_TO_CARD[deal.type] || "flash-sale"}
                      typeBadge={TYPE_LABELS[deal.type] || deal.type}
                      from={cityName(deal.origin)}
                      to={cityName(deal.destination)}
                      airline={deal.airline}
                      originalPrice={originalStr}
                      dealPrice={priceStr}
                      savings={savingsStr}
                      dates={deal.dates_available || "Fechas disponibles en la oferta"}
                      duration="Oferta activa"
                      status="✅ Activa ahora"
                      timestamp="Activa ahora"
                      affiliateUrl={deal.affiliate_url || undefined}
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {sampleDeals.map((deal, i) => (
                <DealCard key={i} {...deal} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            {!hasRealDeals && (
              <p className="text-xs text-gray-600 mb-6">
                ⚠️ Las ofertas son urgentes. Los miembros Premium reciben la alerta en minutos.
              </p>
            )}
            <Link
              href="/deals"
              className="gradient-gold text-black font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition inline-block"
            >
              {hasRealDeals && activeCount > featuredDeals.length
                ? `Ver las ${activeCount} ofertas activas →`
                : "Ver todos los deals →"}
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Lo que dicen los primeros miembros
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="deal-card rounded-2xl p-6">
              <div className="flex gap-1 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                &quot;Reservé Madrid → Bangkok en business por €280. Mi
                compañero pagó €3.400 por el mismo vuelo. Me puse a llorar de
                la risa.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-black font-bold text-sm">
                  AM
                </div>
                <div>
                  <div className="text-sm font-semibold">Alejandro M.</div>
                  <div className="text-xs text-gray-600">
                    Consultor, Madrid
                  </div>
                </div>
              </div>
            </div>

            <div className="deal-card rounded-2xl p-6">
              <div className="flex gap-1 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                &quot;La guía de puntos sola ya valió la pena. Usé millas Turkish
                para Emirates First Class. Esto es real — solo hay que saber
                dónde mirar.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-black font-bold text-sm">
                  SR
                </div>
                <div>
                  <div className="text-sm font-semibold">Sara R.</div>
                  <div className="text-xs text-gray-600">
                    Emprendedora, Barcelona
                  </div>
                </div>
              </div>
            </div>

            <div className="deal-card rounded-2xl p-6">
              <div className="flex gap-1 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                &quot;Viajo 10 veces al año por trabajo. GetFlatbed me ahorró
                más de €12.000 solo este año. Mi empresa paga turista. Yo
                vuelo business.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-black font-bold text-sm">
                  JL
                </div>
                <div>
                  <div className="text-sm font-semibold">Jorge L.</div>
                  <div className="text-xs text-gray-600">
                    Director Comercial, Valencia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING MINI */}
      <section id="pricing" className="py-28 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              Precios
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">
              Una oferta paga años de membresía
            </h2>
            <p className="text-gray-400 mt-4">
              El miembro medio ahorra €1.200 en su primera reserva.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free tier */}
            <div className="deal-card rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-1">Explorador</h3>
              <p className="text-gray-500 text-sm mb-4">Para viajeros ocasionales</p>
              <div className="text-4xl font-black mb-6">
                Gratis{" "}
                <span className="text-lg font-normal text-gray-500">
                  siempre
                </span>
              </div>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex gap-2">✓ 2 ofertas por semana (retraso 48h)</li>
                <li className="flex gap-2">✓ Newsletter semanal</li>
                <li className="flex gap-2">✓ Guía básica de puntos</li>
                <li className="flex gap-2 text-gray-600">
                  ✗ Alertas en tiempo real
                </li>
                <li className="flex gap-2 text-gray-600">
                  ✗ Notificaciones de tarifa error
                </li>
                <li className="flex gap-2 text-gray-600">
                  ✗ Canal Telegram de ofertas
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center border border-white/20 text-white font-bold py-3.5 rounded-xl hover:bg-white/5 transition"
              >
                Únete gratis
              </Link>
            </div>

            {/* Premium tier */}
            <div
              className="rounded-2xl p-8 border-2 border-yellow-500/60 glow"
              style={{ background: "rgba(245,200,66,0.04)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold">Premium</h3>
                <span className="text-xs font-bold gradient-gold text-black px-2 py-0.5 rounded-full">
                  Más popular
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Para cazadores de ofertas serios
              </p>
              <div className="text-4xl font-black mb-1">
                €9{" "}
                <span className="text-lg font-normal text-gray-500">
                  /mes
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-6">
                o €79/año · Ahorra 26%
              </p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex gap-2">
                  <span className="gold">✓</span> Todas las ofertas en tiempo real
                </li>
                <li className="flex gap-2">
                  <span className="gold">✓</span> Alertas instantáneas de tarifa error
                </li>
                <li className="flex gap-2">
                  <span className="gold">✓</span> Canal privado de Telegram
                </li>
                <li className="flex gap-2">
                  <span className="gold">✓</span> Guía completa de millas y puntos
                </li>
                <li className="flex gap-2">
                  <span className="gold">✓</span> Estrategias de upgrades y bonos
                </li>
                <li className="flex gap-2">
                  <span className="gold">✓</span> Soporte prioritario
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center gradient-gold text-black font-black py-3.5 rounded-xl hover:opacity-90 transition"
              >
                Empieza gratis 7 días →
              </Link>
              <p className="text-xs text-center text-gray-600 mt-3">
                7 días gratis · Cancela cuando quieras
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="text-sm text-yellow-500 hover:text-yellow-400 transition font-semibold"
            >
              Ver todos los detalles de precios →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 px-6 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-6">✈️</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Tu próximo vuelo
            <br />
            <span className="gold">no tiene por qué costar una fortuna</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Únete a cientos de viajeros inteligentes que vuelan en business por menos
            de lo que otros pagan en turista.
          </p>

          <form
            onSubmit={(e) => handleSubmit(e, ctaEmail, setCtaEmail)}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="tu@email.com"
              required
              value={ctaEmail}
              onChange={(e) => setCtaEmail(e.target.value)}
              className="flex-1 px-5 py-4 rounded-xl text-base"
            />
            <button
              type="submit"
              className="gradient-gold text-black font-black px-7 py-4 rounded-xl hover:opacity-90 transition"
            >
              Recibe alertas →
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-4">
            Siempre gratis · Cancela cuando quieras · Sin spam, nunca
          </p>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="deal-card rounded-2xl p-10 text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4">🛋️</div>
            <h3 className="text-2xl font-black mb-2">¡Ya eres miembro!</h3>
            <p className="text-gray-400 mb-6">
              Revisa tu bandeja de entrada — las primeras ofertas llegan esta semana. Bienvenido al club flatbed.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="gradient-gold text-black font-bold px-6 py-3 rounded-xl w-full hover:opacity-90 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
