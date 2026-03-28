"use client";

import { useState } from "react";
import Link from "next/link";
import PricingToggle from "@/components/PricingToggle";

const pricingFaqs = [
  {
    question: "¿Puedo cancelar en cualquier momento?",
    answer:
      "Sí, sin problemas. Cancela tu suscripción Premium en cualquier momento desde los ajustes de tu cuenta. No se te cobrará más tras la cancelación y mantendrás el acceso Premium hasta el final de tu período de facturación.",
  },
  {
    question: "¿Hay contrato o compromiso mínimo?",
    answer:
      "Sin contrato, sin compromiso mínimo. Somos mes a mes (o año a año si eliges el plan anual). Puedes degradar al plan Explorador gratuito en cualquier momento.",
  },
  {
    question: "¿Qué métodos de pago aceptáis?",
    answer:
      "Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, American Express) a través de Stripe. Los suscriptores anuales también pueden pagar por transferencia bancaria. Próximamente añadiremos PayPal y Bizum.",
  },
  {
    question: "¿Hay descuentos para empresas o grupos?",
    answer:
      "¡Sí! Las empresas con 3 o más empleados obtienen un 20% de descuento en suscripciones Premium anuales. Contáctanos en hello@getflatbed.com para un presupuesto grupal. También ofrecemos tarifas especiales para agencias de viajes y gestores de viajes corporativos.",
  },
];

const features = [
  {
    name: "Ofertas por semana",
    explorer: "2 ofertas (retraso 48h)",
    premium: "Todas en tiempo real",
  },
  { name: "Newsletter por email", explorer: "Resumen semanal", premium: "Resumen diario" },
  {
    name: "Canal de Telegram",
    explorer: false,
    premium: "✅ Alertas instantáneas",
  },
  {
    name: "Alertas de tarifa error",
    explorer: false,
    premium: "✅ Notificación inmediata",
  },
  {
    name: "Guía de millas y puntos",
    explorer: "Básica (10 páginas)",
    premium: "Completa (50+ páginas)",
  },
  { name: "Guía de upgrades", explorer: false, premium: "✅ Playbook completo" },
  {
    name: "Alertas personalizadas",
    explorer: false,
    premium: "✅ Filtros destino + precio",
  },
  { name: "Soporte", explorer: false, premium: "✅ Soporte prioritario" },
  {
    name: "Garantía de devolución",
    explorer: "—",
    premium: "✅ Reembolso total 7 días",
  },
];

export default function PricingPage() {
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const monthlyPrice = period === "monthly" ? "€9" : "€6,58";
  const annualTotal = "€79";
  const periodLabel = period === "monthly" ? "/mes" : "/mes (facturado €79/año)";

  return (
    <div className="pt-20">
      {/* HEADER */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
            Precios
          </span>
          <h1 className="text-5xl md:text-6xl font-black mt-4 mb-6 leading-tight">
            El precio de un café al día,
            <br />
            <span className="gold">un vuelo en business</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10">
            El primer deal que encuentres cubre de sobra el año entero. A
            €9/mes, la matemática es obvia.
          </p>

          {/* Toggle */}
          <PricingToggle period={period} onChange={setPeriod} />
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Explorer */}
            <div className="deal-card rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-1">Explorador</h3>
              <p className="text-gray-500 text-sm mb-6">Para viajeros ocasionales</p>
              <div className="text-5xl font-black mb-2">
                Gratis{" "}
                <span className="text-xl font-normal text-gray-500">
                  siempre
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-8">
                Sin tarjeta de crédito
              </p>
              <ul className="space-y-3 text-sm text-gray-400 mb-10">
                <li className="flex gap-2 items-start">
                  <span className="text-white mt-0.5">✓</span>
                  <span>2 ofertas por semana (retraso 48h)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-white mt-0.5">✓</span>
                  <span>Newsletter semanal por email</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-white mt-0.5">✓</span>
                  <span>Guía básica de millas y puntos</span>
                </li>
                <li className="flex gap-2 items-start text-gray-600">
                  <span className="mt-0.5">✗</span>
                  <span>Alertas en tiempo real</span>
                </li>
                <li className="flex gap-2 items-start text-gray-600">
                  <span className="mt-0.5">✗</span>
                  <span>Notificaciones de tarifa error</span>
                </li>
                <li className="flex gap-2 items-start text-gray-600">
                  <span className="mt-0.5">✗</span>
                  <span>Canal Telegram de ofertas</span>
                </li>
                <li className="flex gap-2 items-start text-gray-600">
                  <span className="mt-0.5">✗</span>
                  <span>Alertas personalizadas</span>
                </li>
                <li className="flex gap-2 items-start text-gray-600">
                  <span className="mt-0.5">✗</span>
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center border border-white/20 text-white font-bold py-4 rounded-xl hover:bg-white/5 transition"
              >
                Empezar con Explorador
              </Link>
            </div>

            {/* Premium */}
            <div
              className="rounded-2xl p-8 border-2 border-yellow-500/60 glow relative"
              style={{ background: "rgba(245,200,66,0.04)" }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="text-xs font-bold gradient-gold text-black px-4 py-1.5 rounded-full">
                  Más popular
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">Premium</h3>
              <p className="text-gray-400 text-sm mb-6">
                Para cazadores de ofertas serios
              </p>
              <div className="text-5xl font-black mb-1">
                {monthlyPrice}{" "}
                <span className="text-xl font-normal text-gray-500">
                  {periodLabel}
                </span>
              </div>
              {period === "annual" && (
                <p className="text-xs text-green-400 font-semibold mb-2">
                  Ahorras €29/año vs mensual
                </p>
              )}
              <p className="text-xs text-gray-600 mb-8">
                {period === "annual"
                  ? `Facturado ${annualTotal} anualmente`
                  : "o €79/año — ahorra 26%"}
              </p>
              <ul className="space-y-3 text-sm text-gray-300 mb-10">
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Todas las ofertas en tiempo real</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Alertas instantáneas de tarifa error</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Canal privado de Telegram</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Playbook completo de millas y puntos (50+ páginas)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Estrategias de upgrades y bonos</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Alertas personalizadas (destino + presupuesto)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Soporte por email prioritario</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Garantía de devolución 7 días</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center gradient-gold text-black font-black py-4 rounded-xl hover:opacity-90 transition"
              >
                Empieza gratis 7 días →
              </Link>
              <p className="text-xs text-center text-gray-600 mt-3">
                Sin tarjeta para el periodo de prueba
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE COMPARISON TABLE */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">
            Comparativa completa de funciones
          </h2>
          <div className="deal-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 px-6 py-4 text-sm font-bold">
              <div className="text-gray-400">Función</div>
              <div className="text-center text-gray-400">Explorador</div>
              <div className="text-center text-yellow-500">Premium</div>
            </div>
            {features.map((feature, i) => (
              <div
                key={i}
                className="grid grid-cols-3 px-6 py-4 text-sm border-t border-white/5 hover:bg-white/5 transition"
              >
                <div className="text-gray-300">{feature.name}</div>
                <div className="text-center text-gray-500">
                  {feature.explorer === false ? (
                    <span className="text-gray-700">✗</span>
                  ) : (
                    feature.explorer
                  )}
                </div>
                <div className="text-center text-gray-300 font-semibold">
                  {feature.premium}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="rounded-2xl p-10 border border-yellow-500/20 mb-16"
            style={{ background: "rgba(245,200,66,0.04)" }}
          >
            <div className="text-5xl font-black gold mb-2">€290 típico</div>
            <p className="text-gray-400">
              Precio típico de un error fare MAD→JFK en business
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Basado en ahorros reportados por miembros, enero–marzo 2026
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                initials: "CR",
                name: "Carlos R.",
                city: "Madrid",
                quote:
                  "Pagué 3 años de Premium con una tarifa error a Singapur. Business class por €320. Increíble.",
              },
              {
                initials: "LM",
                name: "Laura M.",
                city: "Barcelona",
                quote:
                  "Usé millas Turkish para reservar Emirates First Class. Mis amigos pensaban que había ganado un concurso. Solo leí la guía.",
              },
              {
                initials: "DA",
                name: "Diego A.",
                city: "Buenos Aires",
                quote:
                  "El primer mes reservé BCN→NYC en Iberia Business por €290. La suscripción se paga sola en minutos.",
              },
            ].map((t) => (
              <div key={t.name} className="deal-card rounded-2xl p-6">
                <div className="flex gap-1 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-black font-bold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-600">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">
            Preguntas frecuentes sobre precios
          </h2>
          <div className="space-y-3">
            {pricingFaqs.map((faq, i) => (
              <div key={i} className="deal-card rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm">{faq.question}</span>
                  <span className="text-yellow-500 text-lg flex-shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">
            Empieza a ahorrar en business class hoy
          </h2>
          <p className="text-gray-400 mb-10">
            Prueba Premium gratis 7 días. Sin tarjeta de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="gradient-gold text-black font-black px-8 py-4 rounded-xl hover:opacity-90 transition"
            >
              Empieza gratis 7 días →
            </Link>
            <Link
              href="/register"
              className="border border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/5 transition"
            >
              O empieza con Explorador (gratis)
            </Link>
          </div>
          <p className="text-xs text-gray-600 mt-6">
            Cancela cuando quieras · Garantía de devolución 7 días · Sin spam
          </p>
        </div>
      </section>
    </div>
  );
}
