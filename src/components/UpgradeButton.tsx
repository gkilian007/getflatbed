"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UpgradeButtonProps {
  priceId: string;
}

export default function UpgradeButton({ priceId }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === "Unauthorized") {
        router.push("/login");
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="gradient-gold text-black font-black px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-60 whitespace-nowrap"
    >
      {loading ? "Cargando..." : "Mejorar — €9/mes →"}
    </button>
  );
}
