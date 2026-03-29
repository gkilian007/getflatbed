import Parser from "rss-parser"
import type { ScrapedDeal } from "./types"
import { extractPrice, extractRoute, extractAirline, isBusinessClass } from "./parser"
import { getAveragePrice, calculateSavings } from "./price-reference"

const FEED_URLS = [
  `https://news.google.com/rss/search?q=%22business+class%22+%22error+fare%22&hl=es`,
  `https://news.google.com/rss/search?q=%22business+class%22+%22oferta%22+vuelo&hl=es`,
]

const RELEVANT_ORIGINS = ["MAD", "BCN", "AGP", "BOG", "MEX", "EZE", "MIA", "LIM", "SCL", "GRU"]

export async function scrapeGoogleAlerts(): Promise<ScrapedDeal[]> {
  const parser = new Parser({ timeout: 15000 })
  const deals: ScrapedDeal[] = []

  for (const feedUrl of FEED_URLS) {
    try {
      const feed = await parser.parseURL(feedUrl)
      console.log(`[GoogleAlerts] Fetched ${feed.items.length} items from Google News`)

      for (const item of feed.items) {
        const title = item.title || ""
        const description = item.contentSnippet || item.content || ""
        const fullText = title + " " + description
        const link = item.link || ""

        // Very strict filtering: must be business class AND have a price
        if (!isBusinessClass(fullText)) continue

        const dealPrice = extractPrice(fullText)
        if (!dealPrice) continue // No price = not a real deal listing

        const route = extractRoute(title) || extractRoute(description)
        if (!route) continue

        const isRelevant =
          RELEVANT_ORIGINS.includes(route.origin) || RELEVANT_ORIGINS.includes(route.destination)
        if (!isRelevant) continue

        const airline = extractAirline(fullText) || "Unknown Airline"
        const avgPrice = getAveragePrice(route.origin, route.destination)
        const savings = avgPrice && dealPrice ? calculateSavings(avgPrice, dealPrice) : null

        // Strict threshold: 30%+ savings required for news-sourced items
        if (savings !== null && savings < 30) continue

        const isDupe = deals.some(
          (d) => d.origin === route.origin && d.destination === route.destination
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
          source: "google_news",
          is_premium_only: false,
        })
      }
    } catch (err) {
      console.error(`[GoogleAlerts] Error:`, err)
    }
  }

  console.log(`[GoogleAlerts] Found ${deals.length} relevant deals`)
  return deals
}
