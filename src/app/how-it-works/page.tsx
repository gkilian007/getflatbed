"use client";

import { useState } from "react";

const faqs = [
  {
    question: "¿Son legales las tarifas error?",
    answer:
      "Sí, en la gran mayoría de los casos. Cuando una aerolínea publica una tarifa — aunque sea por error — y la reservas, tienes un contrato válido. La mayoría de las aerolíneas honran estas reservas para evitar daño reputacional. En casos excepcionales pueden cancelar y reembolsarte, pero eso es la excepción, no la norma. Solo alertamos de tarifas con alta probabilidad de ser honradas.",
  },
  {
    question: "¿Qué pasa si la aerolínea cancela mi billete?",
    answer:
      "Si una aerolínea cancela una reserva de tarifa error, está legalmente obligada a reembolsarte íntegramente. No perderás dinero. Dicho esto, recomendamos no reservar hoteles no reembolsables hasta que tu billete esté confirmado (normalmente 24-48h después de la reserva).",
  },
  {
    question: "¿Puedo fiarme de las ofertas con millas?",
    answer:
      "Absolutamente. Las ofertas con millas utilizan programas legítimos de viajero frecuente — Turkish Miles&Smiles, Flying Blue, Iberia Avios — para reservar asientos de business class a tasas de canje drásticamente reducidas. No son trucos ni atajos; son los programas funcionando como están diseñados, simplemente optimizados.",
  },
  {
    question: "¿Necesito una tarjeta de crédito específica?",
    answer:
      "No para la mayoría de las ofertas. Las tarifas error y las flash sales solo requieren una tarjeta de pago. Para las ofertas con millas, necesitas puntos en un programa concreto. Nuestras guías explican exactamente cómo acumular puntos rápidamente — a menudo a través de bonos de bienvenida de tarjetas que te dan 50.000+ puntos de inmediato.",
  },
  {
    question: "¿Las alertas son personalizadas?",
    answer:
      "Los miembros Premium pueden configurar aeropuertos de origen, destinos soñados y preferencias de tipo de oferta. Nuestro algoritmo prioriza entonces las ofertas relevantes. Los miembros Explorador reciben nuestro resumen semanal con las mejores ofertas de todas las rutas.",
  },
  {
    question: "¿Con qué rapidez hay que actuar?",
    answer:
      "Las tarifas error suelen durar 2–6 horas antes de que la aerolínea corrija el precio. Las flash sales pueden durar hasta 48 horas. Por eso los miembros Premium reciben alertas instantáneas por Telegram — para que puedas actuar en minutos, no en horas.",
  },
  {
    question: "¿Enviais spam?",
    answer:
      "Nunca. Solo enviamos alertas cuando hay una oferta genuina que merece tu atención. Los miembros Premium reciben alertas instantáneas (1-3 por semana de media). Los miembros Explorador reciben un resumen semanal. Puedes ajustar la frecuencia o darte de baja en cualquier momento con un clic.",
  },
  {
    question: "¿Puedo cancelar en cualquier momento?",
    answer:
      "Sí. Sin contratos, sin compromisos. Cancela tu suscripción Premium en cualquier momento desde los ajustes de tu cuenta y no se te cobrará más. También ofrecemos una garantía de devolución de 7 días en nuevas suscripciones Premium, sin preguntas.",
  },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
            Detrás de las cámaras
          </span>
          <h1 className="text-5xl md:text-6xl font-black mt-4 mb-6 leading-tight">
            Cómo encontramos ofertas
            <br />
            <span className="gold">que nadie más encuentra</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Mientras todos los demás reservan a precio completo, nuestro equipo monitoriza cientos
            de fuentes sin descanso — captando errores de precio, sweet spots de canje y ventas
            limitadas en el momento exacto en que aparecen.
          </p>
        </div>
      </section>

      {/* SOURCE 1: ERROR FARES */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-4xl mb-6 block">⚡</span>
              <span className="text-xs font-bold tracking-widest text-red-400 uppercase mb-3 block">
                Fuente 1
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Tarifas Error
              </h2>
              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>
                  <strong className="text-white">¿Qué es una tarifa error?</strong>{" "}
                  Las aerolíneas publican millones de tarifas al día en cientos de
                  sistemas de reservas. En ocasiones, un error humano, un fallo de
                  conversión de moneda o un bug del sistema crea un precio un
                  90%+ por debajo del valor real. Esas son las tarifas error.
                </p>
                <p>
                  <strong className="text-white">¿Por qué son legales?</strong> En
                  la mayoría de jurisdicciones, cuando una aerolínea publica y acepta
                  el pago de una tarifa, se forma un contrato. Las aerolíneas casi
                  siempre honran estas reservas para proteger su reputación de marca.
                </p>
                <p>
                  <strong className="text-white">
                    ¿Cuánto tiempo duran?
                  </strong>{" "}
                  Normalmente 2–6 horas. Una vez que la aerolínea se da cuenta, corrige el precio.
                  Por eso las alertas instantáneas son críticas — esperar hasta mañana significa
                  perderte la oferta por completo.
                </p>
                <p>
                  <strong className="text-white">Lo que hacemos:</strong> En el momento en
                  que detectamos una tarifa error, la verificamos manualmente, confirmamos
                  que la reserva funciona y enviamos una alerta instantánea a los miembros
                  Premium por Telegram y email simultáneamente.
                </p>
              </div>
            </div>
            <div className="deal-card rounded-2xl p-8">
              <div className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wide">
                Ejemplo de tarifa error
              </div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full inline-block mb-2">
                    ⚡ Tarifa error
                  </div>
                  <h3 className="text-xl font-bold">Madrid → Bangkok</h3>
                  <p className="text-xs text-gray-500">
                    Iberia Business · oneworld
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600 line-through">
                    €4.200
                  </div>
                  <div className="text-3xl font-black text-green-400">€280</div>
                  <div className="text-xs text-yellow-500 font-semibold">
                    93% dto.
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 bg-white/5 rounded-lg p-3">
                🕐 Alerta enviada a las 14:32 · Oferta expiró a las 17:15
                <br />
                ✅ 47 miembros reservaron a tiempo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCE 2: MILES & POINTS */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div
                className="deal-card rounded-2xl p-6 overflow-x-auto"
              >
                <div className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wide">
                  Comparativa de programas
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-600 border-b border-white/10">
                      <th className="text-left py-2">Programa</th>
                      <th className="text-left py-2">Mejor ruta</th>
                      <th className="text-right py-2">Puntos</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400 space-y-2">
                    {[
                      ["Turkish M&S", "MAD→NYC", "45K"],
                      ["Flying Blue", "MAD→JFK", "50K"],
                      ["Iberia Avios", "MAD→BOG", "34K"],
                      ["Emirates Skywards", "BCN→DXB", "55K"],
                      ["ANA Mileage", "BCN→NRT", "60K"],
                    ].map(([prog, route, pts]) => (
                      <tr
                        key={prog}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="py-2 font-semibold text-white">
                          {prog}
                        </td>
                        <td className="py-2">{route}</td>
                        <td className="py-2 text-right text-green-400 font-bold">
                          {pts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-4xl mb-6 block">🏆</span>
              <span className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3 block">
                Fuente 2
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Trucos con Millas y Puntos
              </h2>
              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>
                  <strong className="text-white">Las grandes alianzas:</strong>{" "}
                  Oneworld, SkyTeam y Star Alliance te permiten usar puntos de
                  una aerolínea para reservar asientos en aerolíneas asociadas — a menudo
                  a una fracción de la tasa de canje &quot;estándar&quot;.
                </p>
                <p>
                  <strong className="text-white">Los programas secretos:</strong>{" "}
                  Turkish Miles&amp;Smiles te permite volar en business en United,
                  Lufthansa o Singapore desde 45.000 puntos.
                  Flying Blue hace frecuentes promos con 50% de descuento en business class.
                </p>
                <p>
                  <strong className="text-white">
                    Cómo acumular sin volar:
                  </strong>{" "}
                  Los bonos de bienvenida de tarjetas de crédito en España pueden darte
                  50.000–80.000 puntos de golpe. Las transferencias de hoteles, los portales de
                  compras y los programas asociados completan tu saldo rápidamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCE 3: UPGRADES */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-4xl mb-6 block">🔼</span>
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3 block">
                Fuente 3
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Upgrades y Bonos
              </h2>
              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>
                  <strong className="text-white">
                    Certificados de acompañante:
                  </strong>{" "}
                  Muchas tarjetas premium incluyen un &quot;certificado de acompañante&quot;
                  — un billete de business class gratuito o muy descontado cuando compras uno
                  al precio completo. Te mostramos qué tarjetas lo ofrecen y con qué rutas combinarlos.
                </p>
                <p>
                  <strong className="text-white">Subastas de upgrade:</strong>{" "}
                  Aerolíneas como Iberia, British Airways y Lufthansa ofrecen
                  subastas de upgrade (via Plusgrade) donde los pasajeros de turista
                  pujan por asientos de business no vendidos. Las pujas ganadoras suelen ser
                  un 60–80% por debajo del precio del upgrade.
                </p>
                <p>
                  <strong className="text-white">
                    Mostrador de última hora:
                  </strong>{" "}
                  Dentro de las 48 horas antes de la salida, las aerolíneas a veces venden
                  asientos premium no vendidos con grandes descuentos. Monitorizamos estas
                  ventanas y te alertamos cuando una ruta relevante baja de precio.
                </p>
                <p>
                  <strong className="text-white">Status match:</strong> ¿Vuela en business
                  con un competidor? A menudo puedes emparejar tu estatus élite con otra aerolínea
                  — dándote prioridad de upgrade, acceso a sala VIP y millas bonus desde el primer día.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "🎫",
                  title: "Cert. Acompañante",
                  desc: "2 billetes business por el precio de 1",
                },
                {
                  icon: "🔨",
                  title: "Subasta Upgrade",
                  desc: "Puja por asientos vacíos",
                },
                {
                  icon: "⏱️",
                  title: "Última Hora",
                  desc: "48h antes de la salida",
                },
                {
                  icon: "⭐",
                  title: "Status Match",
                  desc: "Beneficios élite al instante",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="deal-card rounded-xl p-5 text-center"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="text-sm font-bold mb-1">{item.title}</div>
                  <div className="text-xs text-gray-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              Nuestro proceso
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3">
              Del descubrimiento a tu bandeja de entrada
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />
            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Monitorizamos más de 200 fuentes",
                  desc: "Seguimos webs de aerolíneas, sistemas GDS, agregadores de reservas y fuentes de la comunidad — las 24 horas del día, 7 días a la semana, 365 días al año. Ninguna oferta escapa a nuestra red.",
                  icon: "🔍",
                },
                {
                  step: "02",
                  title: "Verificación manual",
                  desc: "Cada oferta potencial es revisada por una persona antes de enviar ninguna alerta. Verificamos que la tarifa es realmente reservable, confirmamos que la ruta tiene sentido y estimamos cuánto durará.",
                  icon: "✅",
                },
                {
                  step: "03",
                  title: "Alerta instantánea enviada",
                  desc: "Los miembros Premium reciben un mensaje de Telegram y un email simultáneamente — normalmente en 5 minutos desde que nuestro equipo confirma la oferta. Los miembros Explorador reciben las mejores ofertas en su resumen semanal.",
                  icon: "⚡",
                },
                {
                  step: "04",
                  title: "Tú reservas directamente",
                  desc: "Enlazamos directamente a la web de la aerolínea. Sin intermediarios, sin comisiones de reserva. Tú reservas y pagas a la aerolínea directamente, manteniendo el control total y el servicio de atención al cliente.",
                  icon: "🛫",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <div className="relative z-10 w-12 h-12 gradient-gold rounded-full flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="deal-card rounded-2xl p-6 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{item.icon}</span>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3">
              Preguntas y respuestas
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
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

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            ¿Listo para volar en business por menos?
          </h2>
          <p className="text-gray-400 mb-10">
            Únete a cientos de viajeros inteligentes que ya pagan una fracción del precio.
          </p>
          {submitted ? (
            <p className="text-green-400 font-bold text-lg">
              ¡Ya eres miembro! Revisa tu bandeja de entrada pronto.
            </p>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-xl text-base"
                />
                <button
                  type="submit"
                  className="gradient-gold text-black font-black px-7 py-4 rounded-xl hover:opacity-90 transition"
                >
                  Recibe alertas gratis →
                </button>
              </form>
              <p className="text-xs text-gray-600 mt-4">
                Siempre gratis · Sin tarjeta · Cancela cuando quieras
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
