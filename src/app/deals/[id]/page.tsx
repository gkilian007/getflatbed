import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { getFlightDuration } from "@/lib/flight-durations"
import { AVG_BUSINESS_PRICES } from "@/lib/scrapers/price-reference"
import { CopyLinkButton } from "@/components/CopyLinkButton"

interface Deal {
  id: string
  type: string
  origin: string
  destination: string
  airline: string
  price_original: number | null
  price_deal: number | null
  savings_pct: number | null
  dates_available: string | null
  is_premium_only: boolean
  status: string
  created_at: string
  affiliate_url: string | null
  source: string | null
}

// Spanish city names for display
const IATA_TO_CITY: Record<string, string> = {
  MAD: "Madrid",
  BCN: "Barcelona",
  AGP: "Málaga",
  JFK: "Nueva York",
  EWR: "Nueva York",
  MIA: "Miami",
  GRU: "São Paulo",
  NRT: "Tokio",
  DXB: "Dubái",
  LAX: "Los Ángeles",
  BOG: "Bogotá",
  LIM: "Lima",
  EZE: "Buenos Aires",
  BKK: "Bangkok",
  SIN: "Singapur",
  HKG: "Hong Kong",
  LHR: "Londres",
  CDG: "París",
  ICN: "Seúl",
  YYZ: "Toronto",
  ORD: "Chicago",
  SCL: "Santiago",
  MEX: "Ciudad de México",
  AMS: "Ámsterdam",
  FRA: "Fráncfort",
  ZRH: "Zúrich",
  FCO: "Roma",
  MXP: "Milán",
  IST: "Estambul",
  DOH: "Doha",
  SYD: "Sídney",
  KUL: "Kuala Lumpur",
  PEK: "Pekín",
  PVG: "Shanghái",
  BOM: "Bombay",
  DEL: "Nueva Delhi",
  VIE: "Viena",
  BRU: "Bruselas",
  GVA: "Ginebra",
  MUC: "Múnich",
  LIS: "Lisboa",
  IAD: "Washington D.C.",
  SFO: "San Francisco",
  BOS: "Boston",
  IAH: "Houston",
  DFW: "Dallas",
  ATL: "Atlanta",
  SEA: "Seattle",
}

const DEAL_TYPE_LABELS: Record<string, string> = {
  error_fare: "⚡ Tarifa error",
  miles: "🏆 Oferta con millas",
  flash_sale: "🔔 Flash sale",
  voucher: "💳 Bono",
}

const DEAL_TYPE_COLORS: Record<string, string> = {
  error_fare: "text-red-400 bg-red-400/10 border-red-400/20",
  miles: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  flash_sale: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  voucher: "text-green-400 bg-green-400/10 border-green-400/20",
}

function cityName(iata: string): string {
  return IATA_TO_CITY[iata] || iata
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return "hace menos de 1 hora"
  if (hours < 24) return `hace ${hours} hora${hours !== 1 ? "s" : ""}`
  const days = Math.floor(hours / 24)
  return `hace ${days} día${days !== 1 ? "s" : ""}`
}

function getBookingSteps(deal: Deal): string[] {
  const origin = cityName(deal.origin)
  const dest = cityName(deal.destination)
  const airline = deal.airline
  const dates = deal.dates_available || "fechas flexibles"

  switch (deal.type) {
    case "error_fare":
      return [
        `Ve directamente a ${airline}.com`,
        `Busca vuelos Business Class en la ruta ${origin} → ${dest}`,
        `Selecciona fechas: ${dates}`,
        "Completa la reserva sin demora — las tarifas error caducan en horas",
        "Guarda el número de confirmación inmediatamente",
      ]
    case "miles":
      return [
        `Accede a tu cuenta del programa de fidelización de ${airline}`,
        `Busca disponibilidad de canje en ${origin} → ${dest}`,
        `Selecciona fechas: ${dates}`,
        `Canjea ${deal.price_deal ? Number(deal.price_deal).toLocaleString() : "X"} millas/puntos`,
        "Las plazas en Business con millas son limitadas — actúa pronto",
      ]
    case "flash_sale":
      return [
        `Ve a ${airline}.com y busca la promoción activa`,
        `Selecciona la ruta ${origin} → ${dest} en Business Class`,
        `Busca fechas: ${dates}`,
        "Verifica que el precio incluye todos los cargos y tasas",
        "Completa la reserva — las flash sales duran poco tiempo",
      ]
    case "voucher":
      return [
        `Consulta el programa de ${airline} para esta oferta`,
        `Aplica el código/voucher al buscar ${origin} → ${dest}`,
        `Selecciona la tarifa Business Class para ${dates}`,
        "Verifica las condiciones del voucher antes de confirmar",
      ]
    default:
      return [
        `Busca en ${airline}.com la ruta ${origin} → ${dest}`,
        `Selecciona clase Business para ${dates}`,
        "Reserva lo antes posible",
      ]
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: deal } = await supabase
    .from("deals")
    .select("*")
    .eq("id", id)
    .single()

  if (!deal) {
    return { title: "Oferta no encontrada | GetFlatbed" }
  }

  const origin = cityName(deal.origin)
  const dest = cityName(deal.destination)
  const price = deal.price_deal
    ? deal.type === "miles"
      ? `${Number(deal.price_deal).toLocaleString()} millas`
      : `€${Number(deal.price_deal).toLocaleString()}`
    : ""

  const title = price
    ? `Business Class ${origin} → ${dest} desde ${price} | GetFlatbed`
    : `Oferta Business Class ${origin} → ${dest} | GetFlatbed`

  const description = `${DEAL_TYPE_LABELS[deal.type] || deal.type}: ${origin} → ${dest} en Business Class con ${deal.airline}${price ? ` desde ${price}` : ""}${deal.savings_pct ? `. Ahorro del ${deal.savings_pct}%` : ""}. Instrucciones de reserva paso a paso.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  }
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: deal } = await supabase
    .from("deals")
    .select("*")
    .eq("id", id)
    .single()

  if (!deal) {
    notFound()
  }

  // Related deals: same origin or destination, active, not this deal
  const { data: related } = await supabase
    .from("deals")
    .select("id, type, origin, destination, airline, price_deal, savings_pct")
    .eq("status", "active")
    .neq("id", deal.id)
    .or(`origin.eq.${deal.origin},destination.eq.${deal.destination}`)
    .limit(3)

  const origin = cityName(deal.origin)
  const dest = cityName(deal.destination)
  const duration = getFlightDuration(deal.origin, deal.destination)
  const avgPrice =
    AVG_BUSINESS_PRICES[`${deal.origin}-${deal.destination}`] ||
    AVG_BUSINESS_PRICES[`${deal.destination}-${deal.origin}`] ||
    null

  const bookingSteps = getBookingSteps(deal)
  const isActive = deal.status === "active"

  const priceDisplay =
    deal.type === "miles"
      ? deal.price_deal
        ? `${Number(deal.price_deal).toLocaleString()} millas`
        : "—"
      : deal.price_deal
      ? `€${Number(deal.price_deal).toLocaleString()}`
      : "—"

  const shareUrl = `https://getflatbed.com/deals/${deal.id}`
  const shareText = `Business Class ${origin} → ${dest} desde ${priceDisplay} con ${deal.airline} — encontrado en GetFlatbed`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`

  return (
    <div className="pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-300 transition">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/deals" className="hover:text-gray-300 transition">
            Ofertas
          </Link>
          <span>/</span>
          <span className="text-gray-400">
            {deal.origin} → {deal.destination}
          </span>
        </nav>

        {/* HEADER */}
        <div className="deal-card rounded-2xl p-8 mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full border ${
                DEAL_TYPE_COLORS[deal.type] || "text-gray-400 bg-white/5 border-white/10"
              }`}
            >
              {DEAL_TYPE_LABELS[deal.type] || deal.type}
            </span>
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full border ${
                isActive
                  ? "text-green-400 bg-green-400/10 border-green-400/20"
                  : "text-gray-400 bg-white/5 border-white/10"
              }`}
            >
              {isActive ? "Activo" : "Expirado"}
            </span>
            {deal.is_premium_only && (
              <span className="text-sm font-bold px-3 py-1 rounded-full gradient-gold text-black">
                Premium
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-2">
            {origin}{" "}
            <span className="text-gray-400">→</span>{" "}
            {dest}
          </h1>
          <p className="text-xl text-gray-400 mb-1">{deal.airline}</p>
          <p className="text-sm text-gray-600">
            Publicado {timeAgo(deal.created_at)}
          </p>
        </div>

        {/* PRICE SECTION */}
        <div className="deal-card rounded-2xl p-8 mb-6">
          <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-6">
            Precio
          </h2>
          <div className="flex flex-wrap items-end gap-6">
            <div>
              {deal.price_original && (
                <div className="text-gray-500 text-lg line-through mb-1">
                  €{Number(deal.price_original).toLocaleString()}
                </div>
              )}
              <div className="text-5xl font-black text-green-400">
                {priceDisplay}
              </div>
            </div>
            {deal.savings_pct && (
              <div
                className="text-2xl font-black px-4 py-2 rounded-xl"
                style={{
                  color: "#F5C842",
                  background: "rgba(245,200,66,0.12)",
                  border: "1px solid rgba(245,200,66,0.25)",
                }}
              >
                {deal.savings_pct}% dto.
              </div>
            )}
          </div>
          {avgPrice && deal.price_deal && deal.type !== "miles" && (
            <p className="text-sm text-gray-500 mt-4">
              El precio medio en Business para esta ruta es{" "}
              <span className="text-gray-300 font-semibold">
                €{Number(avgPrice).toLocaleString()}
              </span>
            </p>
          )}
        </div>

        {/* CÓMO RESERVAR */}
        <div
          className="rounded-2xl p-8 mb-6"
          style={{
            background: "rgba(245,200,66,0.04)",
            border: "1px solid rgba(245,200,66,0.2)",
          }}
        >
          <h2 className="text-xl font-black mb-6" style={{ color: "#F5C842" }}>
            Cómo reservar
          </h2>
          <ol className="space-y-4 mb-6">
            {bookingSteps.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-black"
                  style={{ background: "#F5C842" }}
                >
                  {i + 1}
                </span>
                <span className="text-gray-300 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>

          {deal.affiliate_url && (
            <a
              href={deal.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center gradient-gold text-black font-black py-4 rounded-xl hover:opacity-90 transition text-lg"
            >
              Reservar ahora →
            </a>
          )}
        </div>

        {/* RUTA */}
        <div className="deal-card rounded-2xl p-8 mb-6">
          <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-6">
            Información del vuelo
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-black">{deal.origin}</div>
              <div className="text-sm text-gray-400">{origin}</div>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 border-t border-dashed border-gray-600" />
              <span className="text-2xl">✈️</span>
              <div className="flex-1 border-t border-dashed border-gray-600" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-black">{deal.destination}</div>
              <div className="text-sm text-gray-400">{dest}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Aerolínea</div>
              <div className="font-semibold">{deal.airline}</div>
            </div>
            {duration && (
              <div>
                <div className="text-gray-500 mb-1">Duración típica</div>
                <div className="font-semibold">{duration}</div>
              </div>
            )}
            {deal.dates_available && (
              <div>
                <div className="text-gray-500 mb-1">Fechas disponibles</div>
                <div className="font-semibold">{deal.dates_available}</div>
              </div>
            )}
            <div>
              <div className="text-gray-500 mb-1">Clase</div>
              <div className="font-semibold">Business Class</div>
            </div>
          </div>
        </div>

        {/* POR QUÉ ES BUENA OFERTA */}
        {(avgPrice || deal.savings_pct) && (
          <div className="deal-card rounded-2xl p-8 mb-6">
            <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-6">
              ¿Por qué es buena oferta?
            </h2>
            <div className="space-y-4 text-sm text-gray-300">
              {avgPrice && deal.price_deal && deal.type !== "miles" && (
                <p>
                  El precio medio en Business para la ruta{" "}
                  <strong className="text-white">
                    {origin} → {dest}
                  </strong>{" "}
                  es de{" "}
                  <strong className="text-white">
                    €{Number(avgPrice).toLocaleString()}
                  </strong>
                  . Esta oferta está a{" "}
                  <strong style={{ color: "#F5C842" }}>
                    €{Number(deal.price_deal).toLocaleString()}
                  </strong>
                  {deal.savings_pct
                    ? `, un ${deal.savings_pct}% más barato`
                    : ""}{" "}
                  de lo habitual.
                </p>
              )}
              {deal.type === "error_fare" && (
                <p>
                  Las tarifas error ocurren cuando las aerolíneas publican
                  precios incorrectos por fallos técnicos o humanos. Suelen
                  durar entre 1 y 12 horas antes de ser corregidas. Una vez
                  confirmada la reserva, la mayoría de las aerolíneas la
                  respetan.
                </p>
              )}
              {deal.type === "flash_sale" && (
                <p>
                  Las flash sales son promociones de tiempo limitado que las
                  aerolíneas lanzan para llenar plazas o liquidar inventario.
                  Son legítimas y la aerolínea suele honrarlas, pero caducan
                  rápido.
                </p>
              )}
              {deal.type === "miles" && (
                <p>
                  Canjear millas en Business Class puede ofrecer un valor
                  excepcional — especialmente cuando la disponibilidad es alta
                  y el ratio de millas por euro es favorable. Esta oferta
                  representa una de las mejores ventanas de disponibilidad
                  recientes.
                </p>
              )}
            </div>
          </div>
        )}

        {/* COMPARTIR */}
        <div className="deal-card rounded-2xl p-8 mb-6">
          <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">
            Comparte esta oferta
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition"
              style={{
                background: "rgba(37,211,102,0.12)",
                border: "1px solid rgba(37,211,102,0.25)",
                color: "#25D366",
              }}
            >
              WhatsApp
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300"
            >
              Twitter / X
            </a>
            <CopyLinkButton url={shareUrl} />
          </div>
        </div>

        {/* OFERTAS RELACIONADAS */}
        {related && related.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-black mb-4">Ofertas relacionadas</h2>
            <div className="grid gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/deals/${r.id}`}
                  className="deal-card rounded-xl p-5 flex justify-between items-center hover:border-yellow-500/30 transition"
                >
                  <div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border mr-2 ${
                        DEAL_TYPE_COLORS[r.type] || "text-gray-400 bg-white/5 border-white/10"
                      }`}
                    >
                      {DEAL_TYPE_LABELS[r.type] || r.type}
                    </span>
                    <span className="font-bold">
                      {cityName(r.origin)} → {cityName(r.destination)}
                    </span>
                    <div className="text-sm text-gray-400 mt-0.5">{r.airline}</div>
                  </div>
                  <div className="text-right">
                    {r.price_deal && (
                      <div className="font-black text-green-400">
                        {r.type === "miles"
                          ? `${Number(r.price_deal).toLocaleString()}pts`
                          : `€${Number(r.price_deal).toLocaleString()}`}
                      </div>
                    )}
                    {r.savings_pct && (
                      <div className="text-xs font-bold" style={{ color: "#F5C842" }}>
                        {r.savings_pct}% dto.
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link
                href="/deals"
                className="text-sm font-semibold text-yellow-500 hover:text-yellow-400 transition"
              >
                Ver todas las ofertas →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

