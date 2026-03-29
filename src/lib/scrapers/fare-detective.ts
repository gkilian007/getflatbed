import Parser from "rss-parser"
import type { ScrapedDeal } from "./types"
import { extractPrice, extractRoute, extractAirline, isBusinessClass } from "./parser"
import { getAveragePrice, calculateSavings } from "./price-reference"

// Business-class focused feeds
const FEED_URLS = [
  "https://www.theflightdeal.com/category/business-class/feed/",
]

const RELEVANT_ORIGINS = ["MAD", "BCN", "AGP", "BOG", "MEX", "EZE", "MIA", "LIM", "SCL", "GRU"]

export async function scrapeFareDetective(): Promise<ScrapedDeal[]> {
  const parser = new Parser({ timeout: 15000 })
  const deals: ScrapedDeal[] = []

  for (const feedUrl of FEED_URLS) {
    try {
      const feed = await parser.parseURL(feedUrl)
      console.log(`[FareDetective] ${feedUrl}: ${feed.items.length} items`)

      for (const item of feed.items) {
        const title = item.title || ""
        const description = item.contentSnippet || item.content || ""
        const fullText = title + " " + description
        const link = item.link || ""

        if (!isBusinessClass(fullText)) continue

        const route = extractRoute(title) || extractRoute(description)
        if (!route) continue

        const isRelevant =
          RELEVANT_ORIGINS.includes(route.origin) || RELEVANT_ORIGINS.includes(route.destination)
        if (!isRelevant) continue

        const dealPrice = extractPrice(title) || extractPrice(description)
        const airline = extractAirline(fullText) || "Unknown Airline"

        const avgPrice = getAveragePrice(route.origin, route.destination)
        const savings = avgPrice && dealPrice ? calculateSavings(avgPrice, dealPrice) : null

        if (dealPrice && savings !== null && savings < 20) continue

        // Avoid duplicates within this batch
        const isDupe = deals.some(
          (d) =>
            d.origin === route.origin &&
            d.destination === route.destination &&
            d.airline === airline
        )
        if (isDupe) continue

        deals.push({
          type: "flash_sale",
          origin: route.origin,
          destination: route.destination,
          airline,
          price_original: avgPrice,
          price_deal: dealPrice,
          savings_pct: savings,
          dates_available: "Ver oferta para fechas disponibles",
          affiliate_url: link || null,
          source: "faredetective",
          is_premium_only: false,
        })
      }
    } catch (err) {
      console.error(`[FareDetective] Error fetching ${feedUrl}:`, err)
    }
  }

  console.log(`[FareDetective] Found ${deals.length} relevant deals`)
  return deals
}
