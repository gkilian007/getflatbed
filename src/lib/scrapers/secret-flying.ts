import Parser from "rss-parser"
import type { ScrapedDeal } from "./types"
import { extractPrice, extractRoute, extractAirline, isBusinessClass } from "./parser"
import { getAveragePrice, calculateSavings } from "./price-reference"

const DIRECT_FEED_URL =
  "https://www.secretflying.com/posts/category/cabin-class/business/feed/"

// Alternative approach via RSS bridge (public instance)
const RSS_BRIDGE_URL =
  "https://rss-bridge.org/bridge01/?action=display&bridge=CssSelectorBridge&home_page=https%3A%2F%2Fwww.secretflying.com%2Fposts%2Fcategory%2Fcabin-class%2Fbusiness%2F&url_selector=h2+a&content_selector=.entry-content&format=Atom"

// Google cache URL
const GOOGLE_CACHE_URL =
  "https://webcache.googleusercontent.com/search?q=cache:secretflying.com/posts/category/cabin-class/business/"

const RELEVANT_ORIGINS = ["MAD", "BCN", "AGP", "BOG", "MEX", "EZE", "MIA", "LIM", "SCL", "GRU"]

function parseDealsFromItems(
  items: Parser.Item[],
  source: string
): ScrapedDeal[] {
  const deals: ScrapedDeal[] = []

  for (const item of items) {
    const title = item.title || ""
    const description = item.contentSnippet || item.content || ""
    const fullText = title + " " + description
    const link = item.link || ""

    if (!isBusinessClass(fullText)) continue

    const route = extractRoute(title) || extractRoute(description)
    if (!route) continue

    const isRelevant =
      RELEVANT_ORIGINS.includes(route.origin) ||
      RELEVANT_ORIGINS.includes(route.destination)
    if (!isRelevant) continue

    const dealPrice = extractPrice(title) || extractPrice(description)
    const airline = extractAirline(fullText) || "Unknown Airline"

    const avgPrice = getAveragePrice(route.origin, route.destination)
    const savings =
      avgPrice && dealPrice ? calculateSavings(avgPrice, dealPrice) : null

    if (dealPrice && savings !== null && savings < 20) continue

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
      source: `secretflying_${source}`,
      is_premium_only: false,
    })
  }

  return deals
}

export async function scrapeSecretFlying(): Promise<ScrapedDeal[]> {
  const parser = new Parser({ timeout: 12000 })

  // Try 1: Direct RSS feed
  try {
    const feed = await parser.parseURL(DIRECT_FEED_URL)
    if (feed.items && feed.items.length > 0) {
      console.log(
        `[SecretFlying] Direct RSS: ${feed.items.length} items`
      )
      const deals = parseDealsFromItems(feed.items, "rss")
      console.log(`[SecretFlying] Found ${deals.length} relevant deals via direct RSS`)
      return deals
    }
  } catch (err) {
    console.log(`[SecretFlying] Direct RSS blocked/failed: ${(err as Error).message}`)
  }

  // Try 2: RSS Bridge
  try {
    const feed = await parser.parseURL(RSS_BRIDGE_URL)
    if (feed.items && feed.items.length > 0) {
      console.log(
        `[SecretFlying] RSS Bridge: ${feed.items.length} items`
      )
      const deals = parseDealsFromItems(feed.items, "bridge")
      console.log(`[SecretFlying] Found ${deals.length} relevant deals via RSS bridge`)
      return deals
    }
  } catch (err) {
    console.log(`[SecretFlying] RSS Bridge failed: ${(err as Error).message}`)
  }

  // Try 3: Google Cache — scrape links from cached HTML
  try {
    const response = await fetch(GOOGLE_CACHE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
      signal: AbortSignal.timeout(12000),
    })

    if (response.ok) {
      const html = await response.text()
      // Extract deal titles and links from HTML
      const pattern = /<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi
      const syntheticItems: Parser.Item[] = []
      let matchResult: RegExpExecArray | null
      while ((matchResult = pattern.exec(html)) !== null) {
        syntheticItems.push({
          title: matchResult[2].trim(),
          link: matchResult[1],
          contentSnippet: matchResult[2].trim(),
        } as Parser.Item)
      }
      if (syntheticItems.length > 0) {
        console.log(`[SecretFlying] Google Cache: ${syntheticItems.length} items`)
        const deals = parseDealsFromItems(syntheticItems, "cache")
        console.log(`[SecretFlying] Found ${deals.length} relevant deals via cache`)
        return deals
      }
    }
  } catch (err) {
    console.log(`[SecretFlying] Google Cache failed: ${(err as Error).message}`)
  }

  console.log("[SecretFlying] All approaches failed, returning empty")
  return []
}
