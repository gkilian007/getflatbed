export async function sendTelegramMessage(
  chatId: string,
  message: string,
  buttons?: { text: string; url: string }[]
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return

  try {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }

    if (buttons && buttons.length > 0) {
      body.reply_markup = {
        inline_keyboard: buttons.map((btn) => [{ text: btn.text, url: btn.url }]),
      }
    }

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {
    // Silent fail — notifications are best-effort
  }
}

export function formatDealMessage(deal: {
  id: string
  type: string
  origin: string
  destination: string
  airline: string
  price_original: number
  price_deal: number
  savings_pct: number | null
  dates_available: string
  affiliate_url?: string | null
}): { text: string; buttons: { text: string; url: string }[] } {
  const emoji: Record<string, string> = {
    error_fare: "⚡",
    miles: "🏆",
    flash_sale: "🔔",
    voucher: "💳",
  }
  const typeLabel: Record<string, string> = {
    error_fare: "TARIFA ERROR",
    miles: "OFERTA MILLAS",
    flash_sale: "FLASH SALE",
    voucher: "UPGRADE/VOUCHER",
  }
  const e = emoji[deal.type] || "✈️"
  const label = typeLabel[deal.type] || "OFERTA"
  const price =
    deal.type === "miles"
      ? `<b>${Number(deal.price_deal).toLocaleString()} millas</b>`
      : `<b>€${Number(deal.price_deal).toLocaleString()}</b>`

  const savingsLine = deal.savings_pct ? ` (-${deal.savings_pct}%)` : ""

  const text = `${e} <b>${label}: ${deal.origin} → ${deal.destination}</b>

✈️ ${deal.airline} · Business Class
💰 <s>€${Number(deal.price_original).toLocaleString()}</s> → ${price}${savingsLine}
📅 ${deal.dates_available}

⏰ ¡Reserva antes de que expire!`

  const buttons: { text: string; url: string }[] = []

  if (deal.affiliate_url) {
    buttons.push({ text: "✈️ Reservar ahora", url: deal.affiliate_url })
  }

  buttons.push({
    text: "📋 Ver detalles",
    url: `https://getflatbed.com/deals/${deal.id}`,
  })

  return { text, buttons }
}
