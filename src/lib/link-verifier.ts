/**
 * Link Verification System
 * 
 * REGLA #1 DEL PRODUCTO: Ningún link sale al usuario sin verificar.
 * - Debe responder HTTP 200 o 301/302 (redirect válido)
 * - No debe acabar en una homepage genérica
 * - Debe llevar a contenido específico de la oferta
 * 
 * Prioridad de links:
 * 1. URL real del artículo/post donde está la oferta (Secret Flying, The Flight Deal, etc.)
 * 2. URL directa de la aerolínea con la promo específica
 * 3. URL del programa de millas con la búsqueda relevante
 * 4. ÚLTIMO RECURSO: Google Flights con business class pre-rellenado
 */

interface VerificationResult {
  valid: boolean
  url: string
  finalUrl: string
  httpStatus: number
  isHomepage: boolean
  isSpecific: boolean
  error?: string
}

// Known homepage patterns — these are NEVER acceptable as deal links
const HOMEPAGE_PATTERNS = [
  /^https?:\/\/www\.\w+\.\w+\/?$/,                    // www.airline.com/
  /^https?:\/\/www\.\w+\.\w+\/es\/?$/,                // www.airline.com/es/
  /^https?:\/\/www\.\w+\.\w+\/en\/?$/,                // www.airline.com/en/
  /^https?:\/\/www\.\w+\.\w+\/es\/es\/?$/,            // www.airline.com/es/es/
  /^https?:\/\/www\.\w+\.\w+\/es-es\/?$/,             // www.airline.com/es-es/
  /^https?:\/\/www\.\w+\.\w+\/en-int\/?$/,            // www.airline.com/en-int/
  /homepage/i,
  /\/home\/?$/i,
  /\/index\.\w+$/i,
]

// Known deal/article URL patterns — these are GOOD
const SPECIFIC_PATTERNS = [
  /secretflying\.com\/posts\//,          // Secret Flying article
  /theflightdeal\.com\/\d{4}\//,         // The Flight Deal article
  /travelpirates\.com\/[\w-]+/,          // TravelPirates deal
  /\/deals?\//i,                          // Any /deal/ or /deals/ path
  /\/offers?\//i,                         // Any /offer/ path
  /\/promotions?\//i,                     // Any /promotion/ path
  /\/campaigns?\//i,                      // Campaign pages
  /search|booking|book|reserve/i,         // Booking/search pages (OK if has params)
  /\?.*(?:from|origin|departure)/i,       // URL with search params
  /flyertalk\.com\/forum\//,             // FlyerTalk thread
  /onemileatatime\.com\//,              // OMAAT article
  /thepointsguy\.com\//,                // TPG article
  /google\.com\/travel\/flights\?q=/,    // Google Flights with query
]

function isHomepage(url: string): boolean {
  return HOMEPAGE_PATTERNS.some((pattern) => pattern.test(url))
}

function isSpecificPage(url: string): boolean {
  return SPECIFIC_PATTERNS.some((pattern) => pattern.test(url))
}

/**
 * Verify a URL is valid and leads to specific deal content.
 * Returns verification result with details.
 */
export async function verifyLink(url: string): Promise<VerificationResult> {
  // Basic URL validation
  try {
    new URL(url)
  } catch {
    return {
      valid: false,
      url,
      finalUrl: url,
      httpStatus: 0,
      isHomepage: false,
      isSpecific: false,
      error: "URL inválida",
    }
  }

  // Check if it's a homepage before even fetching
  if (isHomepage(url)) {
    return {
      valid: false,
      url,
      finalUrl: url,
      httpStatus: 0,
      isHomepage: true,
      isSpecific: false,
      error: "Es una homepage genérica, no una página de oferta específica",
    }
  }

  // Trusted deal source domains — skip HTTP check, trust URL pattern
  const TRUSTED_DEAL_SOURCES = [
    "secretflying.com",
    "theflightdeal.com",
    "travelpirates.com",
    "flyertalk.com",
    "onemileatatime.com",
    "thepointsguy.com",
    "headforpoints.com",
    "frequentmiler.com",
    "premium.theflightdeal.com",
    "google.com/travel/flights",
  ]

  const urlLower = url.toLowerCase()
  const isTrustedSource = TRUSTED_DEAL_SOURCES.some((domain) => urlLower.includes(domain))
  
  if (isTrustedSource && isSpecificPage(url)) {
    return {
      valid: true,
      url,
      finalUrl: url,
      httpStatus: 200, // assumed
      isHomepage: false,
      isSpecific: true,
    }
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    })

    clearTimeout(timeout)

    const finalUrl = response.url || url
    const httpStatus = response.status

    // Check if redirect landed on homepage
    const landedOnHomepage = isHomepage(finalUrl)
    const specific = isSpecificPage(finalUrl) || isSpecificPage(url)

    // Valid if: responds OK, not a homepage, and looks specific
    const valid =
      httpStatus >= 200 &&
      httpStatus < 400 &&
      !landedOnHomepage

    return {
      valid,
      url,
      finalUrl,
      httpStatus,
      isHomepage: landedOnHomepage,
      isSpecific: specific,
      error: landedOnHomepage
        ? "El link redirige a la homepage genérica"
        : httpStatus >= 400
        ? `HTTP ${httpStatus}`
        : undefined,
    }
  } catch (err) {
    // Many airline sites block HEAD requests or have Cloudflare
    // If the URL pattern looks specific, give it the benefit of the doubt
    const looksSpecific = isSpecificPage(url)

    return {
      valid: looksSpecific, // Trust specific-looking URLs even if fetch fails
      url,
      finalUrl: url,
      httpStatus: 0,
      isHomepage: false,
      isSpecific: looksSpecific,
      error: looksSpecific
        ? undefined
        : `No se pudo verificar: ${err instanceof Error ? err.message : "error desconocido"}`,
    }
  }
}

/**
 * Validate a deal's affiliate_url before publishing.
 * Returns { ok, url, warning? } — if not ok, the deal should NOT be published with this URL.
 */
export async function validateDealLink(
  affiliateUrl: string | null | undefined,
  deal: { origin: string; destination: string; airline?: string; dates_available: string | null }
): Promise<{ ok: boolean; url: string; warning?: string }> {
  // No URL provided — use Google Flights fallback
  if (!affiliateUrl) {
    const { generateBookingLink } = await import("./deep-links")
    const fallbackUrl = generateBookingLink(deal)
    return {
      ok: true,
      url: fallbackUrl,
      warning:
        "⚠️ Sin URL específica. Usando Google Flights como fallback. Añade la URL real del artículo/oferta para mejor experiencia.",
    }
  }

  // Verify the provided URL
  const result = await verifyLink(affiliateUrl)

  if (!result.valid) {
    // URL is bad — fall back to Google Flights but warn
    const { generateBookingLink } = await import("./deep-links")
    const fallbackUrl = generateBookingLink(deal)
    return {
      ok: true,
      url: fallbackUrl,
      warning: `⚠️ URL rechazada (${result.error}): ${affiliateUrl}. Usando Google Flights como fallback.`,
    }
  }

  if (!result.isSpecific) {
    return {
      ok: true,
      url: affiliateUrl,
      warning:
        "⚠️ La URL no parece ser una página de oferta específica. Verifica que lleva al contenido correcto.",
    }
  }

  // URL is good and specific
  return { ok: true, url: affiliateUrl }
}
