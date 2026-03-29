import { createClient } from "@/lib/supabase/server"
import HomeClient from "@/components/HomeClient"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredDeals } = await supabase
    .from("deals")
    .select(
      "id, type, origin, destination, airline, price_original, price_deal, savings_pct, dates_available, affiliate_url"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(4)

  const { count: activeCount } = await supabase
    .from("deals")
    .select("id", { count: "exact", head: true })
    .eq("status", "active")

  return (
    <HomeClient
      featuredDeals={featuredDeals || []}
      activeCount={activeCount || 0}
    />
  )
}
