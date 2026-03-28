export interface ScrapedDeal {
  type: "error_fare" | "miles" | "flash_sale" | "voucher"
  origin: string
  destination: string
  airline: string
  price_original: number | null
  price_deal: number | null
  savings_pct: number | null
  dates_available: string | null
  affiliate_url: string | null
  source: string
  is_premium_only: boolean
}
