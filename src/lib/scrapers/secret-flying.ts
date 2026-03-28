import Parser from "rss-parser"
import type { ScrapedDeal } from "./types"
import { getAveragePrice, calculateSavings } from "./price-reference"

const FEED_URL = "https://www.secretflying.com/posts/category/cabin-class/business/feed/"

// IATA codes we care about (Spanish/Latam origins)
const RELEVANT_ORIGINS = ["MAD", "BCN", "AGP", "BOG", "MEX", "EZE", "MIA", "LIM", "SCL", "GRU"]

// Airline name normalization
const AIRLINE_MAP: Record<string, string> = {
  iberia: "Iberia",
  "air europa": "Air Europa",
  "british airways": "British Airways",
  lufthansa: "Lufthansa",
  "turkish airlines": "Turkish Airlines",
  emirates: "Emirates",
  qatar: "Qatar Airways",
  "qatar airways": "Qatar Airways",
  united: "United Airlines",
  american: "American Airlines",
  delta: "Delta",
  klm: "KLM",
  "air france": "Air France",
  "tap air portugal": "TAP Air Portugal",
  tap: "TAP Air Portugal",
  finnair: "Finnair",
  swiss: "SWISS",
  "singapore airlines": "Singapore Airlines",
  singapore: "Singapore Airlines",
  "ana ": "ANA",
  "japan airlines": "Japan Airlines",
  jal: "Japan Airlines",
  cathay: "Cathay Pacific",
  "air canada": "Air Canada",
  latam: "LATAM",
}

// City to IATA code mapping
const CITY_TO_IATA: Record<string, string> = {
  madrid: "MAD",
  barcelona: "BCN",
  malaga: "AGP",
  "new york": "JFK",
  "new york city": "JFK",
  nyc: "JFK",
  jfk: "JFK",
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
  mexico: "MEX",
  "mexico city": "MEX",
}

function cityToIata(city: string): string | null {
  const normalized = city.toLowerCase().trim()
  return CITY_TO_IATA[normalized] || null
}

function detectAirline(text: string): string {
  const lower = text.toLowerCase()
  for (const [key, value] of Object.entries(AIRLINE_MAP)) {
    if (lower.includes(key)) return value
  }
  return "Unknown Airline"
}

function parsePrice(text: string): number | null {
  // Match patterns like "$290", "€380", "£200", "from $290"
  const match = text.match(/[£$€](\d[\d,]+)/i)
  if (match) {
    return parseInt(match[1].replace(/,/g, ""), 10)
  }
  return null
}

function parseRouteFromTitle(title: string): { origin: string | null; destination: string | null } {
  // Pattern: "City to City from $XXX" or "City – City Business Class"
  const toMatch = title.match(/^(.+?)\s+to\s+(.+?)(?:\s+from\s+|\s+–|\s+-|$)/i)
  if (toMatch) {
    return {
      origin: cityToIata(toMatch[1].trim()),
      destination: cityToIata(toMatch[2].trim()),
    }
  }

  // Pattern with em dash: "City – City"
  const dashMatch = title.match(/^(.+?)\s*[–—-]\s*(.+?)(?:\s+from\s+|\s+Business|$)/i)
  if (dashMatch) {
    return {
      origin: cityToIata(dashMatch[1].trim()),
      destination: cityToIata(dashMatch[2].trim()),
    }
  }

  return { origin: null, destination: null }
}

function isRelevantDeal(origin: string | null, destination: string | null): boolean {
  if (!origin && !destination) return false
  return (
    RELEVANT_ORIGINS.includes(origin || "") || RELEVANT_ORIGINS.includes(destination || "")
  )
}

export async function scrapeSecretFlying(): Promise<ScrapedDeal[]> {
  const parser = new Parser({ timeout: 10000 })
  const deals: ScrapedDeal[] = []

  try {
    const feed = await parser.parseURL(FEED_URL)
    console.log(`[SecretFlying] Fetched ${feed.items.length} items`)

    for (const item of feed.items) {
      const title = item.title || ""
      const description = item.contentSnippet || item.content || ""
      const link = item.link || ""

      const { origin, destination } = parseRouteFromTitle(title)

      if (!isRelevantDeal(origin, destination)) continue

      const dealPrice = parsePrice(title) || parsePrice(description)
      const airline = detectAirline(title + " " + description)

      const resolvedOrigin = origin || "MAD"
      const resolvedDestination = destination || "JFK"

      const avgPrice = getAveragePrice(resolvedOrigin, resolvedDestination)
      const savings = avgPrice && dealPrice ? calculateSavings(avgPrice, dealPrice) : null

      // Only include if savings are significant (>30%) or we can confirm it's a deal
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
        source: "secretflying",
        is_premium_only: false,
      })
    }

    console.log(`[SecretFlying] Found ${deals.length} relevant deals`)
  } catch (err) {
    console.error("[SecretFlying] Error:", err)
  }

  return deals
}
