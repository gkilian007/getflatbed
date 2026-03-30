import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { runAllScrapers, isDuplicateDeal } from "@/lib/scrapers"
import { sendTelegramMessage, formatDealMessage } from "@/lib/telegram"
import { sendDealAlert } from "@/lib/email"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // Auth: accept x-admin-key header or CRON_SECRET query param (for Vercel Cron)
  const adminKey = req.headers.get("x-admin-key")
  const cronSecret = req.nextUrl.searchParams.get("key")

  const validAdminKey = adminKey === process.env.ADMIN_KEY
  const validCronSecret = cronSecret === process.env.CRON_SECRET || cronSecret === process.env.ADMIN_KEY

  if (!validAdminKey && !validCronSecret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  console.log("[CronScrape] Starting deal scrape run...")
  const startTime = Date.now()

  const summary = {
    found: 0,
    new: 0,
    skipped: 0,
    errors: [] as string[],
    sources: {} as Record<string, number>,
    duration_ms: 0,
  }

  try {
    // Run all scrapers
    const { deals, errors, sources } = await runAllScrapers()
    summary.found = deals.length
    summary.errors.push(...errors)
    summary.sources = sources

    if (deals.length === 0) {
      console.log("[CronScrape] No deals found")
      summary.duration_ms = Date.now() - startTime
      return NextResponse.json(summary)
    }

    // Get all premium users for notifications
    const { data: premiumUsers } = await supabase
      .from("profiles")
      .select("email, telegram_chat_id")
      .eq("plan", "premium")

    // Process each deal
    for (const scrapedDeal of deals) {
      try {
        // Check for duplicate in last 48h
        const isDuplicate = await isDuplicateDeal(supabase, scrapedDeal)
        if (isDuplicate) {
          console.log(
            `[CronScrape] Skipping duplicate: ${scrapedDeal.origin}-${scrapedDeal.destination} (${scrapedDeal.airline})`
          )
          summary.skipped++
          continue
        }

        // Insert into DB
        const { data: deal, error: insertError } = await supabase
          .from("deals")
          .insert({
            type: scrapedDeal.type,
            origin: scrapedDeal.origin,
            destination: scrapedDeal.destination,
            airline: scrapedDeal.airline,
            price_original: scrapedDeal.price_original,
            price_deal: scrapedDeal.price_deal,
            savings_pct: scrapedDeal.savings_pct,
            dates_available: scrapedDeal.dates_available,
            affiliate_url: scrapedDeal.affiliate_url,
            is_premium_only: scrapedDeal.is_premium_only,
            source: scrapedDeal.source,
            status: "active",
          })
          .select()
          .single()

        if (insertError || !deal) {
          const msg = `Insert failed for ${scrapedDeal.origin}-${scrapedDeal.destination}: ${insertError?.message}`
          console.error("[CronScrape]", msg)
          summary.errors.push(msg)
          continue
        }

        console.log(
          `[CronScrape] New deal inserted: ${deal.origin} → ${deal.destination} (${deal.airline}) via ${scrapedDeal.source}`
        )
        summary.new++

        // Notify premium users
        if (premiumUsers && premiumUsers.length > 0) {
          const { text, buttons } = formatDealMessage(deal)
          const notifications = premiumUsers.map(async (user) => {
            const promises: Promise<void>[] = []
            if (user.telegram_chat_id) {
              promises.push(sendTelegramMessage(user.telegram_chat_id, text, buttons))
            }
            if (user.email) {
              promises.push(sendDealAlert(user.email, deal))
            }
            return Promise.all(promises)
          })
          await Promise.all(notifications)
          console.log(`[CronScrape] Notified ${premiumUsers.length} premium users`)
        }
      } catch (dealErr) {
        const msg = `Error processing deal ${scrapedDeal.origin}-${scrapedDeal.destination}: ${(dealErr as Error).message}`
        console.error("[CronScrape]", msg)
        summary.errors.push(msg)
      }
    }
  } catch (err) {
    const msg = `Fatal scraper error: ${(err as Error).message}`
    console.error("[CronScrape]", msg)
    summary.errors.push(msg)
  }

  summary.duration_ms = Date.now() - startTime
  console.log("[CronScrape] Done:", summary)

  return NextResponse.json(summary)
}
