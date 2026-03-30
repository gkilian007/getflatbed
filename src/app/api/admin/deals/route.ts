import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendTelegramMessage, formatDealMessage } from "@/lib/telegram"
import { sendDealAlert } from "@/lib/email"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key")
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const {
    type,
    origin,
    destination,
    airline,
    price_original,
    price_deal,
    savings_pct,
    dates_available,
    is_premium_only,
    affiliate_url,
  } = body

  // Insert the deal
  const { data: deal, error } = await supabase
    .from("deals")
    .insert({
      type,
      origin,
      destination,
      airline,
      price_original,
      price_deal,
      savings_pct,
      dates_available,
      is_premium_only: is_premium_only ?? false,
      affiliate_url,
      status: "active",
    })
    .select()
    .single()

  if (error || !deal) {
    return NextResponse.json({ error: error?.message || "Insert failed" }, { status: 500 })
  }

  // Notify all premium users
  const { data: premiumUsers } = await supabase
    .from("profiles")
    .select("email, telegram_chat_id")
    .eq("plan", "premium")

  if (premiumUsers) {
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
  }

  return NextResponse.json({ ok: true, deal, notified: premiumUsers?.length ?? 0 })
}
