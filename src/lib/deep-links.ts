/**
 * Generate deep links to airline booking pages with route, dates and business class pre-filled.
 * Falls back to Google Flights if no specific airline pattern exists.
 */

// Map of airline name patterns → deep link generators
type DeepLinkGenerator = (params: {
  origin: string
  destination: string
  departDate: string  // YYYY-MM-DD
  returnDate: string  // YYYY-MM-DD
}) => string

const airlineDeepLinks: Record<string, DeepLinkGenerator> = {
  etihad: ({ origin, destination, departDate, returnDate }) =>
    `https://www.etihad.com/en/fly-etihad/search-and-book?adult=1&departDate=${departDate}&from=${origin}&returnDate=${returnDate}&to=${destination}&travelClass=business`,

  qatar: ({ origin, destination, departDate, returnDate }) =>
    `https://booking.qatarairways.com/nsp/views/showBooking.action?from=${origin}&to=${destination}&departing=${departDate}&returning=${returnDate}&bookingClass=B&adult=1`,

  iberia: ({ origin, destination, departDate, returnDate }) =>
    `https://www.iberia.com/es/vuelos/?market=ES&language=es&origin=${origin}&destination=${destination}&outbound=${departDate}&inbound=${returnDate}&adults=1&cabinClass=B`,

  turkish: ({ origin, destination, departDate, returnDate }) =>
    `https://www.turkishairlines.com/en-int/flights/booking/?origin=${origin}&destination=${destination}&departureDate=${departDate.replace(/-/g, "")}&returnDate=${returnDate.replace(/-/g, "")}&adult=1&cabin=business`,

  thai: ({ origin, destination, departDate, returnDate }) =>
    `https://www.thaiairways.com/en/booking/flight-search.page?from=${origin}&to=${destination}&departDate=${departDate}&returnDate=${returnDate}&adult=1&cabin=C`,

  lufthansa: ({ origin, destination, departDate, returnDate }) =>
    `https://www.lufthansa.com/es/es/flight-search?adult=1&cabinClass=business&origin=${origin}&destination=${destination}&departureDate=${departDate}&returnDate=${returnDate}`,

  "air france": ({ origin, destination, departDate, returnDate }) =>
    `https://wwws.airfrance.es/search/open-dates?pax=1:0:0:0:0:0:0:0&cabinClass=BUSINESS&activeConnection=0&origin=${origin}&destination=${destination}&outboundDate=${departDate}&inboundDate=${returnDate}`,

  klm: ({ origin, destination, departDate, returnDate }) =>
    `https://www.klm.es/search/open-dates?pax=1:0:0:0:0:0:0:0&cabinClass=BUSINESS&origin=${origin}&destination=${destination}&outboundDate=${departDate}&inboundDate=${returnDate}`,

  emirates: ({ origin, destination, departDate, returnDate }) =>
    `https://www.emirates.com/es/spanish/book/flights/?origin=${origin}&destination=${destination}&departing=${departDate}&returning=${returnDate}&adult=1&class=business`,

  "singapore airlines": ({ origin, destination, departDate, returnDate }) =>
    `https://www.singaporeair.com/en_UK/plan-and-book/booking/?from=${origin}&to=${destination}&departDate=${departDate}&returnDate=${returnDate}&cabinClass=J&adult=1`,

  ana: ({ origin, destination, departDate, returnDate }) =>
    `https://www.ana.co.jp/en/jp/book-plan/search/flight/?from=${origin}&to=${destination}&departDate=${departDate}&returnDate=${returnDate}&cabinClass=C&adult=1`,

  jal: ({ origin, destination, departDate, returnDate }) =>
    `https://www.jal.co.jp/en/int/fare/?from=${origin}&to=${destination}&departDate=${departDate}&returnDate=${returnDate}&class=C&adult=1`,

  "air europa": ({ origin, destination, departDate, returnDate }) =>
    `https://www.aireuropa.com/es/es/vuelos?origin=${origin}&destination=${destination}&departureDate=${departDate}&returnDate=${returnDate}&adults=1&cabinClass=business`,

  vueling: ({ origin, destination, departDate }) =>
    `https://tickets.vueling.com/ScheduleSelect.aspx?culture=es-ES&origin=${origin}&destination=${destination}&outbound=${departDate}&adt=1`,

  "british airways": ({ origin, destination, departDate, returnDate }) =>
    `https://www.britishairways.com/travel/book/public/es_es?from=${origin}&to=${destination}&depDate=${departDate}&retDate=${returnDate}&cabin=M&adult=1&cls=J`,

  delta: ({ origin, destination, departDate, returnDate }) =>
    `https://www.delta.com/flight-search/search?tripType=roundTrip&origin=${origin}&destination=${destination}&departureDate=${departDate}&returnDate=${returnDate}&paxCount=1&cabinType=business`,

  "american airlines": ({ origin, destination, departDate, returnDate }) =>
    `https://www.aa.com/booking/find-flights?origin=${origin}&destination=${destination}&departDate=${departDate}&returnDate=${returnDate}&adult=1&cabin=business`,

  "united airlines": ({ origin, destination, departDate, returnDate }) =>
    `https://www.united.com/en/us/fsr/choose-flights?f=${origin}&t=${destination}&d=${departDate}&r=${returnDate}&tt=1&sc=7&px=1&taxng=1&idx=1`,
}

/**
 * Try to match an airline name to a known deep link generator.
 */
function findAirlineGenerator(airline: string): DeepLinkGenerator | null {
  const lower = airline.toLowerCase()
  for (const [key, generator] of Object.entries(airlineDeepLinks)) {
    if (lower.includes(key)) {
      return generator
    }
  }
  return null
}

/**
 * Google Flights fallback — always works, pre-fills route + business class.
 */
function googleFlightsFallback(origin: string, destination: string, _departDate: string, _returnDate: string): string {
  const q = encodeURIComponent(`${origin} to ${destination} business class`)
  void _departDate; void _returnDate
  return `https://www.google.com/travel/flights?q=${q}`
}

/**
 * Parse dates from the dates_available string.
 * Extracts approximate departure/return dates for deep linking.
 */
function parseDatesFromAvailable(datesAvailable: string): { departDate: string; returnDate: string } {
  // Map Spanish month names to numbers
  const months: Record<string, string> = {
    ene: "01", enero: "01", jan: "01",
    feb: "02", febrero: "02",
    mar: "03", marzo: "03",
    abr: "04", abril: "04", apr: "04",
    may: "05", mayo: "05",
    jun: "06", junio: "06",
    jul: "07", julio: "07",
    ago: "08", agosto: "08", aug: "08",
    sep: "09", septiembre: "09",
    oct: "10", octubre: "10",
    nov: "11", noviembre: "11",
    dic: "12", diciembre: "12", dec: "12",
  }

  const lower = datesAvailable.toLowerCase()
  let startMonth = "09" // default September
  let year = "2026"

  // Find first month mention
  for (const [key, num] of Object.entries(months)) {
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
 * Generate a booking deep link for a deal.
 * Tries airline-specific link first, falls back to Google Flights.
 */
export function generateBookingLink(deal: {
  origin: string
  destination: string
  airline: string
  dates_available: string | null
}): string {
  const { departDate, returnDate } = parseDatesFromAvailable(deal.dates_available || "Sep 2026")
  const params = {
    origin: deal.origin,
    destination: deal.destination,
    departDate,
    returnDate,
  }

  const generator = findAirlineGenerator(deal.airline)
  if (generator) {
    return generator(params)
  }

  return googleFlightsFallback(deal.origin, deal.destination, departDate, returnDate)
}
