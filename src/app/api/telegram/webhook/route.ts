import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendTelegramMessage, formatDealMessage } from "@/lib/telegram"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId = String(message.chat.id)
    const text: string = message.text || ""

    if (text.startsWith("/start")) {
      await sendTelegramMessage(
        chatId,
        `✈️ <b>Welcome to GetFlatbed!</b>

I'll send you instant alerts for the best flight deals — error fares, miles, and flash sales.

<b>To connect your account:</b>
1. Go to your dashboard → Alerts
2. Click "Connect Telegram"
3. Send the code here: <code>/connect YOUR_CODE</code>

Other commands:
• /deals — see latest 3 active deals
• /stop — disable notifications`
      )
      return NextResponse.json({ ok: true })
    }

    if (text.startsWith("/connect ")) {
      const code = text.split(" ")[1]?.trim()
      if (!code) {
        await sendTelegramMessage(chatId, "❌ Usage: /connect YOUR_CODE")
        return NextResponse.json({ ok: true })
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("telegram_connect_code", code)
        .gt("telegram_connect_code_expires_at", new Date().toISOString())
        .single()

      if (!profile) {
        await sendTelegramMessage(
          chatId,
          "❌ Invalid or expired code. Please generate a new one from your dashboard."
        )
        return NextResponse.json({ ok: true })
      }

      await supabase
        .from("profiles")
        .update({
          telegram_chat_id: chatId,
          telegram_connect_code: null,
          telegram_connect_code_expires_at: null,
        })
        .eq("id", profile.id)

      await sendTelegramMessage(
        chatId,
        "✅ <b>Account connected!</b>\n\nYou'll now receive instant deal alerts here. 🎉"
      )
      return NextResponse.json({ ok: true })
    }

    if (text.startsWith("/deals")) {
      const { data: deals } = await supabase
        .from("deals")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3)

      if (!deals || deals.length === 0) {
        await sendTelegramMessage(chatId, "No active deals right now. Check back soon! ✈️")
        return NextResponse.json({ ok: true })
      }

      for (const deal of deals) {
        await sendTelegramMessage(chatId, formatDealMessage(deal))
      }
      return NextResponse.json({ ok: true })
    }

    if (text.startsWith("/stop")) {
      await supabase
        .from("profiles")
        .update({ telegram_chat_id: null })
        .eq("telegram_chat_id", chatId)

      await sendTelegramMessage(
        chatId,
        "🔕 Notifications disabled. Send /start anytime to reconnect."
      )
      return NextResponse.json({ ok: true })
    }

    // Default reply
    await sendTelegramMessage(
      chatId,
      "Commands: /deals · /connect CODE · /stop"
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
