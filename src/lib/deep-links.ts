/**
 * Generate verified deep links to Google Flights with route, dates and business class pre-filled.
 * Google Flights is the ONLY reliable deep link that works across all airlines.
 * Airline-specific deep links are unreliable (404s, broken params, JS-only buscadores).
 */

const MONTHS: Record<string, string> = {
  ene: "01", enero: "01", jan: "01", january: "01",
  feb: "02", febrero: "02", february: "02",
  mar: "03", marzo: "03", march: "03",
  abr: "04", abril: "04", apr: "04", april: "04",
  may: "05", mayo: "05",
  jun: "06", junio: "06", june: "06",
  jul: "07", julio: "07", july: "07",
  ago: "08", agosto: "08", aug: "08", august: "08",
  sep: "09", septiembre: "09", september: "09",
  oct: "10", octubre: "10", october: "10",
  nov: "11", noviembre: "11", november: "11",
  dic: "12", diciembre: "12", dec: "12", december: "12",
}

/**
 * Parse dates from the dates_available string.
 * Returns approximate departure/return dates for the deep link.
 */
function parseDatesFromAvailable(datesAvailable: string): { departDate: string; returnDate: string } {
  const lower = datesAvailable.toLowerCase()
  let startMonth = "09" // default September
  let year = "2026"

  // Find first month mention
  for (const [key, num] of Object.entries(MONTHS)) {
    if (lower.includes(key)) {
      startMonth = num
      break
    }
  }

  // Find year
  const yearMatch = lower.match(/20\d{2}/)
  if (yearMatch) year = yearMatch[0]

  const departDate = `${year}-${startMonth}-15`
  // Return date: 2 weeks later
  const depart = new Date(departDate)
  const ret = new Date(depart.getTime() + 14 * 24 * 60 * 60 * 1000)
  const returnDate = ret.toISOString().split("T")[0]

  return { departDate, returnDate }
}

/**
 * Generate a Google Flights deep link with route, dates and business class pre-filled.
 * This is the ONLY reliable universal deep link — verified to work.
 *
 * Format: https://www.google.com/travel/flights?q=Business+class+flights+from+MAD+to+NRT+on+2026-09-15+through+2026-09-29&curr=EUR
 */
export function generateBookingLink(deal: {
  origin: string
  destination: string
  airline?: string
  dates_available: string | null
}): string {
  const { departDate, returnDate } = parseDatesFromAvailable(deal.dates_available || "Sep 2026")

  const q = `Business class flights from ${deal.origin} to ${deal.destination} on ${departDate} through ${returnDate}`

  return `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}&curr=EUR`
}

/**
 * Verify that a URL looks like a valid booking link.
 * Returns true if it's a Google Flights link or a known airline booking domain.
 */
export function isValidBookingLink(url: string): boolean {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()

    // Google Flights — always valid
    if (host.includes("google.com") && parsed.pathname.includes("flights")) return true

    // Known airline booking domains
    const validDomains = [
      "booking.qatarairways.com",
      "book.etihad.com",
      "www.emirates.com",
      "www.iberia.com",
      "www.turkishairlines.com",
      "www.thaiairways.com",
      "www.lufthansa.com",
      "www.aireuropa.com",
      "www.britishairways.com",
      "www.delta.com",
      "www.aa.com",
      "www.united.com",
      "wwws.airfrance.es",
      "www.klm.es",
      "www.singaporeair.com",
      "www.ana.co.jp",
      "www.jal.co.jp",
    ]

    return validDomains.some((d) => host.includes(d.replace("www.", "")))
  } catch {
    return false
  }
}
