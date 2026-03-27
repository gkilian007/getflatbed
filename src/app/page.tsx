"use client";

import { useState } from "react";
import Link from "next/link";
import DealCard from "@/components/DealCard";

export default function HomePage() {
  const [heroEmail, setHeroEmail] = useState("");
  const [ctaEmail, setCtaEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent, setter: (v: string) => void) => {
    e.preventDefault();
    setter("");
    setShowModal(true);
  };

  const sampleDeals = [
    {
      type: "error-fare" as const,
      typeBadge: "⚡ Error fare",
      from: "Madrid",
      to: "New York",
      airline: "Iberia Business · JFK nonstop",
      originalPrice: "€3,180",
      dealPrice: "€290",
      savings: "91% off",
      dates: "Jun–Sep 2025",
      duration: "Lasted 3h",
      status: "✅ Ticketed",
      timestamp: "48h ago",
    },
    {
      type: "miles-deal" as const,
      typeBadge: "🏆 Miles deal",
      from: "Barcelona",
      to: "Tokyo",
      airline: "Turkish Airlines Business · IST connection",
      originalPrice: "€5,400",
      dealPrice: "45K pts",
      savings: "≈€450 value",
      dates: "Oct–Nov 2025",
      duration: "48h window",
      status: "✅ Available now",
      timestamp: "3 days ago",
    },
    {
      type: "flash-sale" as const,
      typeBadge: "🔔 Flash sale",
      from: "Madrid",
      to: "Miami",
      airline: "Air Europa Business · nonstop",
      originalPrice: "€2,100",
      dealPrice: "€480",
      savings: "77% off",
      dates: "Feb–Apr 2026",
      duration: "Lasted 6h",
      status: "✅ Ticketed",
      timestamp: "5 days ago",
    },
    {
      type: "card-hack" as const,
      typeBadge: "💳 Card hack",
      from: "Madrid",
      to: "Dubai",
      airline: "Emirates Business · A380 upper deck",
      originalPrice: "€3,800",
      dealPrice: "60K pts",
      savings: "≈€380 value",
      dates: "Any date",
      duration: "Open window",
      status: "✅ Strategy guide",
      timestamp: "1 week ago",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, #F5C842, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-sm text-yellow-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-yellow-400 pulse" />
          Join 200+ early members — limited spots
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] max-w-5xl mb-6">
          Stop paying full price
          <br />
          for <span className="gold">Business Class</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-4">
          We find error fares, secret deals, and points hacks so you can fly
          flatbed
          <br className="hidden md:block" /> for{" "}
          <strong className="text-white">up to 90% less</strong> than the listed
          price.
        </p>

        <p className="text-sm text-gray-600 mb-10">
          Madrid → NYC Business. Listed: €3,200 · Found by members:{" "}
          <span className="text-green-400 font-semibold">€340</span>
        </p>

        {/* CTA form */}
        <form
          onSubmit={(e) => handleSubmit(e, setHeroEmail)}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto mb-6"
        >
          <input
            type="email"
            placeholder="your@email.com"
            required
            value={heroEmail}
            onChange={(e) => setHeroEmail(e.target.value)}
            className="flex-1 px-5 py-4 rounded-xl text-base"
          />
          <button
            type="submit"
            className="gradient-gold text-black font-black px-7 py-4 rounded-xl hover:opacity-90 transition whitespace-nowrap"
          >
            Get alerts free →
          </button>
        </form>
        <p className="text-xs text-gray-600">
          Free forever · No credit card · Unsubscribe anytime
        </p>

        {/* Floating couch emoji */}
        <div className="mt-16 float text-6xl select-none">🛋️</div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg w-full">
          <div>
            <div className="text-3xl font-black gold">87%</div>
            <div className="text-xs text-gray-500 mt-1">
              avg. savings
              <br />
              vs. retail price
            </div>
          </div>
          <div className="border-x border-white/10">
            <div className="text-3xl font-black gold">3–5</div>
            <div className="text-xs text-gray-500 mt-1">
              deals per
              <br />
              week
            </div>
          </div>
          <div>
            <div className="text-3xl font-black gold">24h</div>
            <div className="text-xs text-gray-500 mt-1">
              alert window
              <br />
              before sold out
            </div>
          </div>
        </div>
      </section>

      {/* TRUST LOGOS */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest text-gray-600 uppercase mb-8">
            Deals found on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              "Iberia",
              "Emirates",
              "Turkish Airlines",
              "Air Europa",
              "Lufthansa",
            ].map((airline) => (
              <span
                key={airline}
                className="text-sm font-bold text-gray-600 hover:text-gray-400 transition"
              >
                {airline}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — MINI */}
      <section id="how" className="py-28 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">
              Smarter than any travel agent
            </h2>
            <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
              We monitor hundreds of sources 24/7 so you never miss a deal
              again.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="deal-card rounded-2xl p-8 card-glow">
              <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center text-black text-xl font-black mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">We hunt error fares</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Airlines make pricing mistakes. We detect them in seconds —
                before they disappear. A €4,000 flight turning into €290 is
                real, and it happens weekly.
              </p>
            </div>

            <div className="deal-card rounded-2xl p-8 card-glow">
              <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center text-black text-xl font-black mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Points & miles hacks</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Turkish Miles&amp;Smiles. Flying Blue. Avios. We tell you
                exactly which program to use and how to get the points —
                sometimes almost for free with the right credit card.
              </p>
            </div>

            <div className="deal-card rounded-2xl p-8 card-glow">
              <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center text-black text-xl font-black mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Upgrades & vouchers</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Last-minute upgrades, companion certificates, and bid auctions.
                We teach you to play the game airlines don&apos;t want you to
                know about.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/how-it-works"
              className="text-sm text-yellow-500 hover:text-yellow-400 transition font-semibold"
            >
              Learn more about how we find deals →
            </Link>
          </div>
        </div>
      </section>

      {/* SAMPLE DEALS */}
      <section id="deals" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              Recent deals
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">
              Real deals. Real savings.
            </h2>
            <p className="text-gray-400 mt-4">
              These are the kinds of deals our members get. Premium subscribers
              get notified first.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {sampleDeals.map((deal, i) => (
              <DealCard key={i} {...deal} />
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-gray-600 mb-6">
              ⚠️ Deals are time-sensitive. Premium members get notified within
              minutes.
            </p>
            <Link
              href="/deals"
              className="gradient-gold text-black font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition inline-block"
            >
              See all deals →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            What early members say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="deal-card rounded-2xl p-6">
              <div className="flex gap-1 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                &quot;I booked Madrid → Bangkok in business for €280. My
                colleague paid €3,400 for the same flight. I literally cried
                laughing.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-black font-bold text-sm">
                  AM
                </div>
                <div>
                  <div className="text-sm font-semibold">Alejandro M.</div>
                  <div className="text-xs text-gray-600">
                    Consultant, Madrid
                  </div>
                </div>
              </div>
            </div>

            <div className="deal-card rounded-2xl p-6">
              <div className="flex gap-1 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                &quot;The points guide alone was worth it. Used Turkish miles
                for Emirates First Class. This stuff is real — you just need to
                know where to look.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-black font-bold text-sm">
                  SR
                </div>
                <div>
                  <div className="text-sm font-semibold">Sara R.</div>
                  <div className="text-xs text-gray-600">
                    Entrepreneur, Barcelona
                  </div>
                </div>
              </div>
            </div>

            <div className="deal-card rounded-2xl p-6">
              <div className="flex gap-1 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                &quot;I travel 10 times a year for work. GetFlatbed saved me
                over €12,000 this year alone. My company still pays economy. I
                fly business.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-black font-bold text-sm">
                  JL
                </div>
                <div>
                  <div className="text-sm font-semibold">Jorge L.</div>
                  <div className="text-xs text-gray-600">
                    Sales Director, Valencia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING MINI */}
      <section id="pricing" className="py-28 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">
              One deal pays for years
            </h2>
            <p className="text-gray-400 mt-4">
              The average member saves €1,200 on their first booking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free tier */}
            <div className="deal-card rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-1">Explorer</h3>
              <p className="text-gray-500 text-sm mb-4">For casual travelers</p>
              <div className="text-4xl font-black mb-6">
                Free{" "}
                <span className="text-lg font-normal text-gray-500">
                  forever
                </span>
              </div>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex gap-2">✓ 2 deals per week (delayed 48h)</li>
                <li className="flex gap-2">✓ Weekly newsletter</li>
                <li className="flex gap-2">✓ Points basics guide</li>
                <li className="flex gap-2 text-gray-600">
                  ✗ Real-time alerts
                </li>
                <li className="flex gap-2 text-gray-600">
                  ✗ Error fare notifications
                </li>
                <li className="flex gap-2 text-gray-600">
                  ✗ Telegram deal channel
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center border border-white/20 text-white font-bold py-3.5 rounded-xl hover:bg-white/5 transition"
              >
                Join free
              </Link>
            </div>

            {/* Premium tier */}
            <div
              className="rounded-2xl p-8 border-2 border-yellow-500/60 glow"
              style={{ background: "rgba(245,200,66,0.04)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold">Premium</h3>
                <span className="text-xs font-bold gradient-gold text-black px-2 py-0.5 rounded-full">
                  Most popular
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                For serious deal hunters
              </p>
              <div className="text-4xl font-black mb-1">
                €9{" "}
                <span className="text-lg font-normal text-gray-500">
                  /month
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-6">
                or €79/year · Save 26%
              </p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex gap-2">
                  <span className="gold">✓</span> All deals in real-time
                </li>
                <li className="flex gap-2">
                  <span className="gold">✓</span> Error fare instant alerts
                </li>
                <li className="flex gap-2">
                  <span className="gold">✓</span> Private Telegram channel
                </li>
                <li className="flex gap-2">
                  <span className="gold">✓</span> Full points & miles playbook
                </li>
                <li className="flex gap-2">
                  <span className="gold">✓</span> Upgrade & voucher strategies
                </li>
                <li className="flex gap-2">
                  <span className="gold">✓</span> Priority support
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center gradient-gold text-black font-black py-3.5 rounded-xl hover:opacity-90 transition"
              >
                Start free trial →
              </Link>
              <p className="text-xs text-center text-gray-600 mt-3">
                7-day free trial · Cancel anytime
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="text-sm text-yellow-500 hover:text-yellow-400 transition font-semibold"
            >
              See full pricing details →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 px-6 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-6">✈️</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Your next flight
            <br />
            <span className="gold">doesn&apos;t have to cost a fortune</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join hundreds of smart travelers who fly business for less than most
            people pay for economy.
          </p>

          <form
            onSubmit={(e) => handleSubmit(e, setCtaEmail)}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              value={ctaEmail}
              onChange={(e) => setCtaEmail(e.target.value)}
              className="flex-1 px-5 py-4 rounded-xl text-base"
            />
            <button
              type="submit"
              className="gradient-gold text-black font-black px-7 py-4 rounded-xl hover:opacity-90 transition"
            >
              Get alerts →
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-4">
            Free forever · Unsubscribe anytime · No spam, ever
          </p>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="deal-card rounded-2xl p-10 text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4">🛋️</div>
            <h3 className="text-2xl font-black mb-2">You&apos;re in!</h3>
            <p className="text-gray-400 mb-6">
              Check your inbox — first deals coming this week. Welcome to the
              flatbed club.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="gradient-gold text-black font-bold px-6 py-3 rounded-xl w-full hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
