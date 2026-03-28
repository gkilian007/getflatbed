import Link from "next/link";

export interface DealCardProps {
  type: "error-fare" | "miles-deal" | "flash-sale" | "card-hack";
  typeBadge: string;
  from: string;
  to: string;
  airline: string;
  originalPrice: string;
  dealPrice: string;
  savings: string;
  dates: string;
  duration: string;
  status: string;
  isLocked?: boolean;
  timestamp: string;
  affiliateUrl?: string;
  forYou?: boolean;
}

function getBadgeStyle(type: DealCardProps["type"]) {
  switch (type) {
    case "error-fare":
      return "bg-red-500/20 text-red-400";
    case "miles-deal":
      return "bg-blue-500/20 text-blue-400";
    case "flash-sale":
      return "bg-purple-500/20 text-purple-400";
    case "card-hack":
      return "bg-green-500/20 text-green-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

export default function DealCard({
  type,
  typeBadge,
  from,
  to,
  airline,
  originalPrice,
  dealPrice,
  savings,
  dates,
  duration,
  status,
  isLocked = false,
  timestamp,
  affiliateUrl,
  forYou = false,
}: DealCardProps) {
  return (
    <div className="deal-card rounded-2xl p-6 card-glow relative overflow-hidden">
      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3"
          style={{ background: "rgba(10,10,15,0.7)" }}>
          <div className="text-3xl">🔒</div>
          <p className="text-sm font-bold text-white">Solo Premium</p>
          <Link
            href="/register"
            className="gradient-gold text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition"
          >
            Desbloquear ofertas →
          </Link>
        </div>
      )}

      <div className={isLocked ? "blur-sm pointer-events-none select-none" : ""}>
        {/* Header row */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${getBadgeStyle(type)}`}
              >
                {typeBadge}
              </span>
              <span className="text-xs text-gray-600">{timestamp}</span>
            </div>
            <h3 className="text-lg font-bold">
              {from} → {to}
            </h3>
            <p className="text-xs text-gray-500">{airline}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600 line-through">
              {originalPrice}
            </div>
            <div className="text-2xl font-black text-green-400">{dealPrice}</div>
            <div className="text-xs text-yellow-500 font-semibold">{savings}</div>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
          <span>🗓️ {dates}</span>
          <span>🕐 {duration}</span>
          <span>{status}</span>
        </div>

        {/* CTA */}
        {affiliateUrl ? (
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center gradient-gold text-black font-bold py-3 rounded-xl hover:opacity-90 transition text-sm"
          >
            Reservar esta oferta →
          </a>
        ) : (
          <a
            href={`https://www.google.com/travel/flights?q=${encodeURIComponent(from + ' to ' + to + ' business class')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center border border-white/20 text-white font-bold py-3 rounded-xl hover:bg-white/5 transition text-sm"
          >
            Buscar vuelos →
          </a>
        )}
      </div>

      {/* For You badge */}
      {forYou && (
        <div className="absolute top-4 right-4 z-5 gradient-gold text-black text-xs font-bold px-2 py-1 rounded-full">
          Para ti
        </div>
      )}
    </div>
  );
}
