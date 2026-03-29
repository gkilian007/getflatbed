// Shared parsing utilities for all scrapers

const AIRLINE_KEYWORDS: Record<string, string> = {
  iberia: "Iberia",
  "air europa": "Air Europa",
  "british airways": "British Airways",
  lufthansa: "Lufthansa",
  "turkish airlines": "Turkish Airlines",
  emirates: "Emirates",
  "qatar airways": "Qatar Airways",
  qatar: "Qatar Airways",
  "united airlines": "United Airlines",
  united: "United Airlines",
  "american airlines": "American Airlines",
  american: "American Airlines",
  delta: "Delta",
  klm: "KLM",
  "air france": "Air France",
  "tap air portugal": "TAP Air Portugal",
  tap: "TAP Air Portugal",
  finnair: "Finnair",
  swiss: "SWISS",
  "singapore airlines": "Singapore Airlines",
  "ana ": "ANA",
  "japan airlines": "Japan Airlines",
  jal: "Japan Airlines",
  cathay: "Cathay Pacific",
  "air canada": "Air Canada",
  latam: "LATAM",
  "aeromexico": "Aeromexico",
  "avianca": "Avianca",
  "copa airlines": "Copa Airlines",
  "etihad": "Etihad Airways",
  "virgin atlantic": "Virgin Atlantic",
  "alaska airlines": "Alaska Airlines",
  "jetblue": "JetBlue",
  "air india": "Air India",
  "china eastern": "China Eastern",
  "eva air": "EVA Air",
  "thai airways": "Thai Airways",
  "royal jordanian": "Royal Jordanian",
  "saudia": "Saudia",
}

const CITY_TO_IATA: Record<string, string> = {
  madrid: "MAD",
  barcelona: "BCN",
  malaga: "AGP",
  "new york": "JFK",
  "new york city": "JFK",
  nyc: "JFK",
  jfk: "JFK",
  ewr: "EWR",
  miami: "MIA",
  "sao paulo": "GRU",
  "são paulo": "GRU",
  tokyo: "NRT",
  dubai: "DXB",
  "los angeles": "LAX",
  bogota: "BOG",
  bogotá: "BOG",
  lima: "LIM",
  "buenos aires": "EZE",
  bangkok: "BKK",
  singapore: "SIN",
  "hong kong": "HKG",
  london: "LHR",
  paris: "CDG",
  seoul: "ICN",
  toronto: "YYZ",
  chicago: "ORD",
  santiago: "SCL",
  "mexico city": "MEX",
  mexico: "MEX",
  amsterdam: "AMS",
  frankfurt: "FRA",
  zurich: "ZRH",
  rome: "FCO",
  milan: "MXP",
  istanbul: "IST",
  doha: "DOH",
  sydney: "SYD",
  "kuala lumpur": "KUL",
  jakarta: "CGK",
  beijing: "PEK",
  shanghai: "PVG",
  mumbai: "BOM",
  delhi: "DEL",
  johannesburg: "JNB",
  nairobi: "NBO",
  cairo: "CAI",
  casablanca: "CMN",
  lisbon: "LIS",
  vienna: "VIE",
  brussels: "BRU",
  geneva: "GVA",
  munich: "MUC",
  "san francisco": "SFO",
  "washington": "IAD",
  "boston": "BOS",
  "houston": "IAH",
  "dallas": "DFW",
  "atlanta": "ATL",
  "seattle": "SEA",
  "denver": "DEN",
  "phoenix": "PHX",
  "minneapolis": "MSP",
  "montreal": "YUL",
  "vancouver": "YVR",
  "buenos": "EZE",
  "bogot": "BOG",
}

function cityToIata(city: string): string | null {
  const normalized = city.toLowerCase().trim()
  // Exact match first
  if (CITY_TO_IATA[normalized]) return CITY_TO_IATA[normalized]
  // Partial match
  for (const [key, val] of Object.entries(CITY_TO_IATA)) {
    if (normalized.startsWith(key) || key.startsWith(normalized)) return val
  }
  // Check if it's already a 3-letter IATA code
  if (/^[A-Z]{3}$/.test(city.trim().toUpperCase())) return city.trim().toUpperCase()
  return null
}

export function extractPrice(text: string): number | null {
  // "desde €1.200" or "desde $1,200"
  const desdeMatch = text.match(/desde\s+[€$£](\d[\d.,]+)/i)
  if (desdeMatch) {
    const raw = desdeMatch[1].replace(/\./g, "").replace(/,/g, "")
    const n = parseInt(raw, 10)
    if (!isNaN(n) && n > 0) return n
  }

  // "from $1,234" or "from €890"
  const fromMatch = text.match(/from\s+[€$£](\d[\d,]+)/i)
  if (fromMatch) {
    const n = parseInt(fromMatch[1].replace(/,/g, ""), 10)
    if (!isNaN(n) && n > 0) return n
  }

  // "$1,234" or "€890" or "£200"
  const symbolMatch = text.match(/[€$£](\d[\d,.]+)/i)
  if (symbolMatch) {
    const raw = symbolMatch[1]
    let n: number
    if (raw.includes(".") && raw.includes(",")) {
      if (raw.lastIndexOf(".") > raw.lastIndexOf(",")) {
        // US format: 1,234.56
        n = parseInt(raw.replace(/,/g, ""), 10)
      } else {
        // EU format: 1.234,56
        n = parseInt(raw.replace(/\./g, "").replace(/,.*$/, ""), 10)
      }
    } else if (raw.includes(".") && !raw.includes(",")) {
      const parts = raw.split(".")
      if (parts[1]?.length === 3) {
        // EU thousands: €1.200 → 1200
        n = parseInt(raw.replace(/\./g, ""), 10)
      } else {
        n = Math.round(parseFloat(raw))
      }
    } else {
      n = parseInt(raw.replace(/,/g, ""), 10)
    }
    if (!isNaN(n) && n > 0) return n
  }

  // "1,234 USD" or "890 EUR"
  const amountMatch = text.match(/(\d[\d,]+)\s*(USD|EUR|GBP)/i)
  if (amountMatch) {
    const n = parseInt(amountMatch[1].replace(/,/g, ""), 10)
    if (!isNaN(n) && n > 0) return n
  }

  return null
}

export function extractRoute(
  text: string
): { origin: string; destination: string } | null {
  // IATA code patterns: "MAD-JFK" or "MAD → JFK" or "MAD to JFK"
  const iataHyphen = text.match(/\b([A-Z]{3})\s*[-–→]\s*([A-Z]{3})\b/)
  if (iataHyphen) {
    return { origin: iataHyphen[1], destination: iataHyphen[2] }
  }

  // "from City to City" or "City to City Business/First/from $"
  const toMatch = text.match(
    /(?:from\s+)?([A-Za-zÀ-ÿ\s]{3,25}?)\s+to\s+([A-Za-zÀ-ÿ\s]{3,25}?)(?:\s+(?:Business|First|from|\$|€|£|in\s)|\s*$)/i
  )
  if (toMatch) {
    const origin = cityToIata(toMatch[1].trim())
    const dest = cityToIata(toMatch[2].trim())
    if (origin && dest && origin !== dest) return { origin, destination: dest }
  }

  // "City → City" or "City – City"
  const arrowMatch = text.match(
    /([A-Za-zÀ-ÿ\s]{3,25}?)\s*[→—–]\s*([A-Za-zÀ-ÿ\s]{3,25}?)(?:\s+(?:Business|First|from|\$|€|£)|\s*$)/i
  )
  if (arrowMatch) {
    const origin = cityToIata(arrowMatch[1].trim())
    const dest = cityToIata(arrowMatch[2].trim())
    if (origin && dest && origin !== dest) return { origin, destination: dest }
  }

  return null
}

export function extractAirline(text: string): string | null {
  const lower = text.toLowerCase()
  for (const [key, value] of Object.entries(AIRLINE_KEYWORDS)) {
    if (lower.includes(key)) return value
  }
  return null
}

export function isBusinessClass(text: string): boolean {
  const lower = text.toLowerCase()
  return (
    lower.includes("business class") ||
    lower.includes("business-class") ||
    lower.includes("businessclass") ||
    lower.includes("primera clase") ||
    lower.includes("first class") ||
    lower.includes("premium cabin") ||
    lower.includes("lie-flat") ||
    lower.includes("lieflat") ||
    lower.includes("flatbed") ||
    lower.includes("flat bed") ||
    lower.includes("j class") ||
    lower.includes("club world") ||
    lower.includes("club suite") ||
    lower.includes("premium economy") ||
    lower.includes("biz class") ||
    lower.includes(" business ") ||
    lower.includes(" business,") ||
    lower.includes(":business") ||
    lower.includes("executive class")
  )
}
