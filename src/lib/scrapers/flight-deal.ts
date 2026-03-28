import Parser from "rss-parser"
import type { ScrapedDeal } from "./types"
import { getAveragePrice, calculateSavings } from "./price-reference"

const FEED_URL = "https://www.theflightdeal.com/feed/"

const RELEVANT_ORIGINS = ["MAD", "BCN", "AGP", "BOG", "MEX", "EZE", "MIA", "LIM", "SCL", "GRU"]

const AIRLINE_MAP: Record<string, string> = {
  iberia: "Iberia",
  "air europa": "Air Europa",
  "british airways": "British Airways",
  lufthansa: "Lufthansa",
  "turkish airlines": "Turkish Airlines",
  emirates: "Emirates",
  "qatar airways": "Qatar Airways",
  qatar: "Qatar Airways",
  united: "United Airlines",
  american: "American Airlines",
  delta: "Delta",
  klm: "KLM",
  "air france": "Air France",
  tap: "TAP Air Portugal",
  finnair: "Finnair",
  swiss: "SWISS",
  singapore: "Singapore Airlines",
  ana: "ANA",
  cathay: "Cathay Pacific",
  "air canada": "Air Canada",
  latam: "LATAM",
}

const CITY_TO_IATA: Record<string, string> = {
  madrid: "MAD",
  barcelona: "BCN",
  malaga: "AGP",
  "new york": "JFK",
  nyc: "JFK",
  jfk: "JFK",
  ewr: "EWR",
  miami: "MIA",
  "sao paulo": "GRU",
  "são paulo": "GRU",
  tokyo: "NRT",
  dubai: "DXB",
  "los angeles": "LAX",
  bogota: "BOG",
  bogotá: "BOG",
  lima: "LIM",
  "buenos aires": "EZE",
  bangkok: "BKK",
  singapore: "SIN",
  "hong kong": "HKG",
  london: "LHR",
  paris: "CDG",
  seoul: "ICN",
  toronto: "YYZ",
  chicago: "ORD",
  santiago: "SCL",
  "mexico city": "MEX",
  amsterdam: "AMS",
  frankfurt: "FRA",
  zurich: "ZRH",
  rome: "FCO",
  milan: "MXP",
}

function cityToIata(city: string): string | null {
  return CITY_TO_IATA[city.toLowerCase().trim()] || null
}

function detectAirline(text: string): string {
  const lower = text.toLowerCase()
  for (const [key, value] of Object.entries(AIRLINE_MAP)) {
    if (lower.includes(key)) return value
  }
  return "Unknown Airline"
}

function parsePrice(text: string): number | null {
  const match = text.match(/[£$€](\d[\d,]+)/i)
  if (match) return parseInt(match[1].replace(/,/g, ""), 10)
  return null
}

function isBusinessClass(text: string): boolean {
  const lower = text.toLowerCase()
  return (
    lower.includes("business") ||
    lower.includes("business class") ||
    lower.includes("biz class") ||
    lower.includes("j class") ||
    lower.includes("first class")
  )
}

function parseRouteFromTitle(title: string): { origin: string | null; destination: string | null } {
  // The Flight Deal format: "From City: to City, Business Class from $XXX"
  // Or: "City to City Business Class from $XXX"

  const fromMatch = title.match(/from\s+([^:,]+)[,:]\s+(?:to\s+)?(.+?)(?:\s+Business|\s+from\s+\$|\s*$)/i)
  if (fromMatch) {
    return {
      origin: cityToIata(fromMatch[1].trim()),
      destination: cityToIata(fromMatch[2].trim()),
    }
  }

  const toMatch = title.match(/^(.+?)\s+to\s+(.+?)(?:\s+Business|\s+from\s+|\s*$)/i)
  if (toMatch) {
    return {
      origin: cityToIata(toMatch[1].trim()),
      destination: cityToIata(toMatch[2].trim()),
    }
  }

  return { origin: null, destination: null }
}

export async function scrapeFlightDeal(): Promise<ScrapedDeal[]> {
  const parser = new Parser({ timeout: 10000 })
  const deals: ScrapedDeal[] = []

  try {
    const feed = await parser.parseURL(FEED_URL)
    console.log(`[FlightDeal] Fetched ${feed.items.length} items`)

    for (const item of feed.items) {
      const title = item.title || ""
      const description = item.contentSnippet || item.content || ""
      const link = item.link || ""
      const fullText = title + " " + description

      // Only business class deals
      if (!isBusinessClass(fullText)) continue

      const { origin, destination } = parseRouteFromTitle(title)

      const isRelevant =
        RELEVANT_ORIGINS.includes(origin || "") || RELEVANT_ORIGINS.includes(destination || "")
      if (!isRelevant) continue

      const dealPrice = parsePrice(title) || parsePrice(description)
      const airline = detectAirline(fullText)

      const resolvedOrigin = origin || "MAD"
      const resolvedDestination = destination || "JFK"

      const avgPrice = getAveragePrice(resolvedOrigin, resolvedDestination)
      const savings = avgPrice && dealPrice ? calculateSavings(avgPrice, dealPrice) : null

      if (dealPrice && savings !== null && savings < 20) continue

      deals.push({
        type: "flash_sale",
        origin: resolvedOrigin,
        destination: resolvedDestination,
        airline,
        price_original: avgPrice,
        price_deal: dealPrice,
        savings_pct: savings,
        dates_available: "Ver oferta para fechas disponibles",
        affiliate_url: link || null,
        source: "theflightdeal",
        is_premium_only: false,
      })
    }

    console.log(`[FlightDeal] Found ${deals.length} relevant deals`)
  } catch (err) {
    console.error("[FlightDeal] Error:", err)
  }

  return deals
}
