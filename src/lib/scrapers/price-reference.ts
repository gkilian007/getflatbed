// Average business class round-trip prices in EUR for reference
export const AVG_BUSINESS_PRICES: Record<string, number> = {
  "MAD-JFK": 3200,
  "MAD-MIA": 2800,
  "MAD-GRU": 4200,
  "BCN-NRT": 5400,
  "MAD-DXB": 3800,
  "BCN-LAX": 3600,
  "MAD-BOG": 3500,
  "MAD-LIM": 3800,
  "MAD-EZE": 4000,
  "MAD-BKK": 4500,
  "BCN-JFK": 3300,
  "MAD-LHR": 800,
  "MAD-CDG": 700,
  "MAD-SIN": 4800,
  "BCN-DXB": 3600,
  "MAD-MEX": 3200,
  "MAD-SCL": 4100,
  "MAD-NRT": 5200,
  "BCN-MIA": 2900,
  "BCN-GRU": 4300,
  "MAD-LAX": 3700,
  "MAD-ORD": 3400,
  "BCN-BOG": 3600,
  "MAD-YYZ": 3300,
  "MAD-HKG": 5000,
  "BCN-SIN": 4900,
  "MAD-ICN": 5300,
  "BCN-BKK": 4600,
}

export function getAveragePrice(origin: string, destination: string): number | null {
  return (
    AVG_BUSINESS_PRICES[`${origin}-${destination}`] ||
    AVG_BUSINESS_PRICES[`${destination}-${origin}`] ||
    null
  )
}

export function calculateSavings(originalPrice: number, dealPrice: number): number {
  return Math.round(((originalPrice - dealPrice) / originalPrice) * 100)
}
