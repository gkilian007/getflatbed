import type { ScrapedDeal } from "./types"
import { scrapeSecretFlying } from "./secret-flying"
import { scrapeFlightDeal } from "./flight-deal"
import { scrapeTwitterDeals } from "./twitter-deals"
import { scrapeAmadeusDeals } from "./amadeus"

export type { ScrapedDeal }

export interface ScrapeResult {
  deals: ScrapedDeal[]
  errors: string[]
  sources: Record<string, number>
}

// Run all scrapers and combine results
export async function runAllScrapers(): Promise<ScrapeResult> {
  const errors: string[] = []
  const sources: Record<string, number> = {}

  const results = await Promise.allSettled([
    scrapeSecretFlying(),
    scrapeFlightDeal(),
    scrapeTwitterDeals(),
    scrapeAmadeusDeals(),
  ])

  const scraperNames = ["secretflying", "theflightdeal", "twitter", "amadeus"]
  const allDeals: ScrapedDeal[] = []

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const name = scraperNames[i]

    if (result.status === "fulfilled") {
      const deals = result.value
      sources[name] = deals.length
      allDeals.push(...deals)
      console.log(`[Scraper] ${name}: ${deals.length} deals`)
    } else {
      errors.push(`${name}: ${result.reason?.message || "Unknown error"}`)
      sources[name] = 0
      console.error(`[Scraper] ${name} failed:`, result.reason)
    }
  }

  // Deduplicate: same origin+destination+airline within scraped batch
  const seen = new Set<string>()
  const deduplicated = allDeals.filter((deal) => {
    const key = `${deal.origin}-${deal.destination}-${deal.airline}`.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  console.log(`[Scraper] Total: ${allDeals.length} raw → ${deduplicated.length} after dedup`)

  return { deals: deduplicated, errors, sources }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = { from: (table: string) => any }

// Check if a deal already exists in the DB (same origin+destination+airline within 48h)
export async function isDuplicateDeal(
  supabase: AnySupabaseClient,
  deal: ScrapedDeal
): Promise<boolean> {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from("deals")
    .select("id")
    .eq("origin", deal.origin)
    .eq("destination", deal.destination)
    .ilike("airline", deal.airline)
    .gte("created_at", cutoff)
    .limit(1)

  if (error) {
    console.error("[Scraper] Duplicate check error:", error.message)
    return false
  }

  return (data?.length || 0) > 0
}
