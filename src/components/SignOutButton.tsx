"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="mt-6 w-full border border-white/10 text-gray-500 font-semibold py-3 rounded-xl hover:bg-white/5 hover:text-white transition text-sm"
    >
      Sign out
    </button>
  );
}
