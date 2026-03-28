import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder")

const FROM = "GetFlatbed <alerts@getflatbed.com>"

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) return
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to GetFlatbed ✈️",
      html: welcomeHtml(name),
    })
  } catch {
    // Silent fail
  }
}

export async function sendDealAlert(email: string, deal: {
  type: string
  origin: string
  destination: string
  airline: string
  price_original: number
  price_deal: number
  savings_pct: number
  dates_available: string
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `🔥 New Deal: ${deal.origin} → ${deal.destination} (${deal.savings_pct}% off)`,
      html: dealAlertHtml(deal),
    })
  } catch {
    // Silent fail
  }
}

export async function sendUpgradePrompt(email: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) return
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "You're missing out on exclusive flight deals ✈️",
      html: upgradePromptHtml(),
    })
  } catch {
    // Silent fail
  }
}

// ── HTML Templates ──────────────────────────────────────────────────────────

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Logo -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <span style="font-size:24px;font-weight:900;color:#f5c842;letter-spacing:-0.5px;">✈️ GetFlatbed</span>
        </td></tr>
        <!-- Content -->
        <tr><td style="background:#111;border:1px solid rgba(245,200,66,0.15);border-radius:16px;padding:40px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding-top:24px;text-align:center;color:#444;font-size:12px;">
          © 2026 GetFlatbed · <a href="https://getflatbed.vercel.app" style="color:#666;">getflatbed.vercel.app</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function welcomeHtml(name: string): string {
  return baseLayout(`
    <h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:#fff;">
      Welcome, ${name}! ✈️
    </h1>
    <p style="margin:0 0 24px;color:#888;font-size:16px;">
      You're now part of the GetFlatbed community — we hunt the best flight deals so you don't have to.
    </p>
    <div style="background:rgba(245,200,66,0.06);border:1px solid rgba(245,200,66,0.2);border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;color:#f5c842;font-weight:700;font-size:14px;">What you get:</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">⚡ Error fares — up to 95% off business class</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">🏆 Miles deals — top-value award redemptions</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">🔔 Flash sales — time-sensitive discounts</p>
      <p style="margin:0;color:#ccc;font-size:14px;">📱 Telegram alerts — instant notifications</p>
    </div>
    <a href="https://getflatbed.vercel.app/dashboard"
       style="display:inline-block;background:linear-gradient(135deg,#f5c842,#e6a817);color:#000;font-weight:900;font-size:16px;padding:14px 32px;border-radius:8px;text-decoration:none;">
      Go to Dashboard →
    </a>
  `)
}

function dealAlertHtml(deal: {
  type: string
  origin: string
  destination: string
  airline: string
  price_original: number
  price_deal: number
  savings_pct: number
  dates_available: string
}): string {
  const typeLabels: Record<string, string> = {
    error_fare: "⚡ Error Fare",
    miles: "🏆 Miles Deal",
    flash_sale: "🔔 Flash Sale",
    voucher: "💳 Voucher",
  }
  const label = typeLabels[deal.type] || "✈️ Deal"
  const price =
    deal.type === "miles"
      ? `${Number(deal.price_deal).toLocaleString()} pts`
      : `€${Number(deal.price_deal).toLocaleString()}`

  return baseLayout(`
    <p style="margin:0 0 16px;display:inline-block;background:rgba(245,200,66,0.1);border:1px solid rgba(245,200,66,0.3);color:#f5c842;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;">${label}</p>
    <h1 style="margin:0 0 8px;font-size:32px;font-weight:900;color:#fff;">
      ${deal.origin} → ${deal.destination}
    </h1>
    <p style="margin:0 0 24px;color:#888;font-size:16px;">${deal.airline} · Business Class</p>
    <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:8px;">
      <span style="font-size:40px;font-weight:900;color:#f5c842;">${price}</span>
      <span style="font-size:18px;color:#555;text-decoration:line-through;">€${Number(deal.price_original).toLocaleString()}</span>
    </div>
    <p style="margin:0 0 24px;color:#4ade80;font-size:18px;font-weight:700;">${deal.savings_pct}% savings</p>
    <p style="margin:0 0 24px;color:#666;font-size:14px;">📅 ${deal.dates_available}</p>
    <a href="https://getflatbed.vercel.app/deals"
       style="display:inline-block;background:linear-gradient(135deg,#f5c842,#e6a817);color:#000;font-weight:900;font-size:16px;padding:14px 32px;border-radius:8px;text-decoration:none;">
      View Deal →
    </a>
    <p style="margin:24px 0 0;color:#555;font-size:12px;">
      This deal may expire soon. Prices subject to change.
    </p>
  `)
}

function upgradePromptHtml(): string {
  return baseLayout(`
    <h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:#fff;">
      You're missing exclusive deals 🔒
    </h1>
    <p style="margin:0 0 24px;color:#888;font-size:16px;">
      Premium members are getting real-time alerts on error fares and exclusive business class deals.
    </p>
    <div style="background:rgba(245,200,66,0.06);border:1px solid rgba(245,200,66,0.2);border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;color:#f5c842;font-weight:700;font-size:16px;">Premium includes:</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">📱 Instant Telegram + email alerts</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">⚡ Access to all error fares (free users see 48h delay)</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">🏆 Exclusive miles redemption tips</p>
      <p style="margin:0;color:#f5c842;font-size:15px;font-weight:700;">Only €9/month</p>
    </div>
    <a href="https://getflatbed.vercel.app/pricing"
       style="display:inline-block;background:linear-gradient(135deg,#f5c842,#e6a817);color:#000;font-weight:900;font-size:16px;padding:14px 32px;border-radius:8px;text-decoration:none;">
      Upgrade to Premium →
    </a>
  `)
}
