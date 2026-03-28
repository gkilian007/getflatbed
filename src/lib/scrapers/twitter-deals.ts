import type { ScrapedDeal } from "./types"

// Twitter/X scraping is unreliable without official API.
// This module attempts a best-effort scrape via public Nitter mirrors.
// If unavailable, it logs and returns empty array gracefully.

const ACCOUNTS = ["TheFlightDeal", "SecretFlying", "airabordar", "FlyingSecret"]

// Public Nitter instances (may be unreliable)
const NITTER_INSTANCES = [
  "https://nitter.privacyredirect.com",
  "https://nitter.net",
]

export async function scrapeTwitterDeals(): Promise<ScrapedDeal[]> {
  console.log("[Twitter] Twitter scraper requires API setup — skipping")
  console.log(`[Twitter] Accounts to monitor when API is configured: ${ACCOUNTS.join(", ")}`)

  // Best-effort: try to fetch one Nitter page to check availability
  for (const instance of NITTER_INSTANCES) {
    try {
      const res = await fetch(`${instance}/${ACCOUNTS[0]}`, {
        signal: AbortSignal.timeout(5000),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; GetFlatbedBot/1.0)" },
      })
      if (res.ok) {
        console.log(`[Twitter] Nitter instance ${instance} is reachable but full parsing not yet implemented`)
        // Full parsing would require HTML scraping of tweet content
        // This would need proper HTML parsing with cheerio or similar
        // For now, return empty to avoid unreliable data
        break
      }
    } catch {
      // Instance unreachable, try next
    }
  }

  return []
}
