import type { ScrapedDeal } from "./types"
import { getAveragePrice, calculateSavings } from "./price-reference"

// Routes to monitor in business class
const MONITORED_ROUTES = [
  { origin: "MAD", destination: "JFK" },
  { origin: "MAD", destination: "MIA" },
  { origin: "MAD", destination: "GRU" },
  { origin: "BCN", destination: "NRT" },
  { origin: "MAD", destination: "DXB" },
  { origin: "BCN", destination: "LAX" },
  { origin: "MAD", destination: "BOG" },
  { origin: "MAD", destination: "LIM" },
  { origin: "MAD", destination: "EZE" },
  { origin: "MAD", destination: "BKK" },
]

interface AmadeusToken {
  access_token: string
  expires_in: number
}

interface AmadeusOffer {
  price: { total: string; currency: string }
  itineraries: Array<{
    segments: Array<{
      carrierCode: string
      departure: { iataCode: string }
      arrival: { iataCode: string }
    }>
  }>
  travelerPricings: Array<{
    fareDetailsBySegment: Array<{ cabin: string }>
  }>
}

async function getAmadeusToken(clientId: string, clientSecret: string): Promise<string | null> {
  try {
    const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })
    if (!res.ok) return null
    const data: AmadeusToken = await res.json()
    return data.access_token
  } catch {
    return null
  }
}

async function searchFlights(
  token: string,
  origin: string,
  destination: string,
  date: string
): Promise<AmadeusOffer[]> {
  try {
    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: "1",
      travelClass: "BUSINESS",
      max: "5",
    })

    const res = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

function getNextMonthDate(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().split("T")[0]
}

export async function scrapeAmadeusDeals(): Promise<ScrapedDeal[]> {
  const clientId = process.env.AMADEUS_API_KEY
  const clientSecret = process.env.AMADEUS_API_SECRET

  if (!clientId || !clientSecret) {
    console.log("[Amadeus] Not configured — set AMADEUS_API_KEY and AMADEUS_API_SECRET to enable")
    return []
  }

  const token = await getAmadeusToken(clientId, clientSecret)
  if (!token) {
    console.error("[Amadeus] Failed to get access token")
    return []
  }

  const deals: ScrapedDeal[] = []
  const checkDate = getNextMonthDate()

  for (const route of MONITORED_ROUTES) {
    try {
      const offers = await searchFlights(token, route.origin, route.destination, checkDate)

      for (const offer of offers) {
        const priceStr = offer.price?.total
        if (!priceStr) continue

        const dealPrice = parseFloat(priceStr)
        const avgPrice = getAveragePrice(route.origin, route.destination)

        if (!avgPrice) continue

        // Only flag if price is < 50% of average
        const savings = calculateSavings(avgPrice, dealPrice)
        if (savings < 50) continue

        // Get airline from first segment
        const airline = offer.itineraries?.[0]?.segments?.[0]?.carrierCode || "Unknown"

        deals.push({
          type: "error_fare",
          origin: route.origin,
          destination: route.destination,
          airline,
          price_original: avgPrice,
          price_deal: Math.round(dealPrice),
          savings_pct: savings,
          dates_available: `Aproximadamente ${checkDate}`,
          affiliate_url: null,
          source: "amadeus",
          is_premium_only: true,
        })
      }
    } catch (err) {
      console.error(`[Amadeus] Error checking ${route.origin}-${route.destination}:`, err)
    }
  }

  console.log(`[Amadeus] Found ${deals.length} deals`)
  return deals
}
