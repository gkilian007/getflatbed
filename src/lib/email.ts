import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder")

const FROM = process.env.RESEND_FROM_EMAIL
  ? `GetFlatbed <${process.env.RESEND_FROM_EMAIL}>`
  : "GetFlatbed <deals@getflatbed.com>"

const SITE_URL = "https://getflatbed.com"

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
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return
  try {
    const savingsText = deal.savings_pct ? `${deal.savings_pct}% dto.` : "oferta especial"
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `🔥 ${deal.origin} → ${deal.destination} en Business — ${savingsText}`,
      html: dealAlertHtml(deal),
    })
  } catch (err) {
    console.error("Email send failed:", err)
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
          © 2026 GetFlatbed · <a href="${SITE_URL}" style="color:#666;">getflatbed.com</a>
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
      ¡Bienvenido, ${name}! ✈️
    </h1>
    <p style="margin:0 0 24px;color:#888;font-size:16px;">
      Ya formas parte de GetFlatbed — buscamos las mejores ofertas de vuelos en business class para que tú no tengas que hacerlo.
    </p>
    <div style="background:rgba(245,200,66,0.06);border:1px solid rgba(245,200,66,0.2);border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;color:#f5c842;font-weight:700;font-size:14px;">Lo que recibirás:</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">⚡ Tarifas error — hasta 90% de descuento en business class</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">🏆 Ofertas con millas — canjes con valor excepcional</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">🔔 Flash sales — promociones relámpago de aerolíneas</p>
      <p style="margin:0;color:#ccc;font-size:14px;">📱 Alertas por Telegram — notificaciones al instante</p>
    </div>
    <a href="${SITE_URL}/dashboard"
       style="display:inline-block;background:linear-gradient(135deg,#f5c842,#e6a817);color:#000;font-weight:900;font-size:16px;padding:14px 32px;border-radius:8px;text-decoration:none;">
      Ir al Dashboard →
    </a>
  `)
}

function dealAlertHtml(deal: {
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
}): string {
  const typeLabels: Record<string, string> = {
    error_fare: "⚡ Tarifa Error",
    miles: "🏆 Oferta Millas",
    flash_sale: "🔔 Flash Sale",
    voucher: "💳 Upgrade/Voucher",
  }
  const label = typeLabels[deal.type] || "✈️ Oferta"
  const price =
    deal.type === "miles"
      ? `${Number(deal.price_deal).toLocaleString()} millas`
      : `€${Number(deal.price_deal).toLocaleString()}`
  const savingsLine = deal.savings_pct
    ? `<p style="margin:0 0 24px;color:#4ade80;font-size:18px;font-weight:700;">${deal.savings_pct}% de descuento</p>`
    : ""

  const ctaUrl = deal.affiliate_url || `${SITE_URL}/deals/${deal.id}`
  const ctaText = deal.affiliate_url ? "Reservar ahora →" : "Ver oferta →"

  return baseLayout(`
    <p style="margin:0 0 16px;display:inline-block;background:rgba(245,200,66,0.1);border:1px solid rgba(245,200,66,0.3);color:#f5c842;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;">${label}</p>
    <h1 style="margin:0 0 8px;font-size:32px;font-weight:900;color:#fff;">
      ${deal.origin} → ${deal.destination}
    </h1>
    <p style="margin:0 0 24px;color:#888;font-size:16px;">${deal.airline} · Business Class</p>
    <div style="margin-bottom:8px;">
      <span style="font-size:40px;font-weight:900;color:#f5c842;">${price}</span>
      <span style="font-size:18px;color:#555;text-decoration:line-through;margin-left:12px;">€${Number(deal.price_original).toLocaleString()}</span>
    </div>
    ${savingsLine}
    <p style="margin:0 0 24px;color:#666;font-size:14px;">📅 ${deal.dates_available}</p>
    <a href="${ctaUrl}"
       style="display:inline-block;background:linear-gradient(135deg,#f5c842,#e6a817);color:#000;font-weight:900;font-size:16px;padding:14px 32px;border-radius:8px;text-decoration:none;margin-bottom:12px;">
      ${ctaText}
    </a>
    <br/>
    <a href="${SITE_URL}/deals/${deal.id}"
       style="display:inline-block;color:#f5c842;font-size:14px;margin-top:12px;text-decoration:underline;">
      Ver detalles en GetFlatbed →
    </a>
    <p style="margin:24px 0 0;color:#555;font-size:12px;">
      Esta oferta puede expirar pronto. Precios sujetos a cambios.
    </p>
  `)
}

function upgradePromptHtml(): string {
  return baseLayout(`
    <h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:#fff;">
      Te estás perdiendo ofertas exclusivas 🔒
    </h1>
    <p style="margin:0 0 24px;color:#888;font-size:16px;">
      Los miembros Premium reciben alertas instantáneas de tarifas error y ofertas exclusivas de business class.
    </p>
    <div style="background:rgba(245,200,66,0.06);border:1px solid rgba(245,200,66,0.2);border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;color:#f5c842;font-weight:700;font-size:16px;">Premium incluye:</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">📱 Alertas instantáneas por Telegram + email</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">⚡ Acceso a todas las tarifas error (usuarios gratis ven 48h después)</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:14px;">🏆 Tips exclusivos de canje de millas</p>
      <p style="margin:0;color:#f5c842;font-size:15px;font-weight:700;">Solo €9/mes</p>
    </div>
    <a href="${SITE_URL}/pricing"
       style="display:inline-block;background:linear-gradient(135deg,#f5c842,#e6a817);color:#000;font-weight:900;font-size:16px;padding:14px 32px;border-radius:8px;text-decoration:none;">
      Hazte Premium →
    </a>
  `)
}
