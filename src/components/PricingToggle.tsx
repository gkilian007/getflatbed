"use client";

interface PricingToggleProps {
  period: "monthly" | "annual";
  onChange: (period: "monthly" | "annual") => void;
}

export default function PricingToggle({ period, onChange }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onChange("monthly")}
        className={`relative pb-2 text-sm font-semibold transition ${
          period === "monthly" ? "text-white" : "text-gray-500 hover:text-gray-300"
        }`}
      >
        Mensual
        {period === "monthly" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 gradient-gold rounded-full" />
        )}
      </button>

      <span className="text-gray-700">/</span>

      <button
        onClick={() => onChange("annual")}
        className={`relative pb-2 text-sm font-semibold transition flex items-center gap-2 ${
          period === "annual" ? "text-white" : "text-gray-500 hover:text-gray-300"
        }`}
      >
        Anual
        <span className="text-xs font-bold gradient-gold text-black px-2 py-0.5 rounded-full">
          Ahorra 26%
        </span>
        {period === "annual" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 gradient-gold rounded-full" />
        )}
      </button>
    </div>
  );
}
