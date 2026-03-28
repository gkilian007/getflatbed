export async function sendTelegramMessage(chatId: string, message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    })
  } catch {
    // Silent fail — notifications are best-effort
  }
}

export function formatDealMessage(deal: {
  type: string
  origin: string
  destination: string
  airline: string
  price_original: number
  price_deal: number
  savings_pct: number
  dates_available: string
}): string {
  const emoji: Record<string, string> = {
    error_fare: "⚡",
    miles: "🏆",
    flash_sale: "🔔",
    voucher: "💳",
  }
  const e = emoji[deal.type] || "✈️"
  const price =
    deal.type === "miles"
      ? `<b>${Number(deal.price_deal).toLocaleString()} pts</b>`
      : `<b>€${Number(deal.price_deal).toLocaleString()}</b>`

  return `${e} <b>NEW DEAL: ${deal.origin} → ${deal.destination}</b>
✈️ ${deal.airline} · Business Class
💰 <s>€${Number(deal.price_original).toLocaleString()}</s> → ${price} (${deal.savings_pct}% off)
📅 ${deal.dates_available}

🔗 Book now before it expires!`
}
