import { createClient } from "@/lib/supabase/server";
import DealsClient from "@/components/DealsClient";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const isPremium = profile?.plan === "premium";

  return (
    <DealsClient
      deals={deals || []}
      isLoggedIn={!!user}
      isPremium={isPremium}
    />
  );
}
