"use client";

import { useState } from "react";
import Link from "next/link";
import PricingToggle from "@/components/PricingToggle";

const pricingFaqs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, absolutely. Cancel your Premium subscription anytime from your account settings. You won't be charged again after cancellation, and you keep Premium access until the end of your billing period.",
  },
  {
    question: "Is there a contract or minimum commitment?",
    answer:
      "No contract, no minimum commitment. We're month-to-month (or year-to-year if you choose the annual plan). You can downgrade to Explorer free plan at any time.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express) via Stripe. Annual subscribers can also pay by bank transfer. We plan to add PayPal and Bizum soon.",
  },
  {
    question: "Are there discounts for companies or groups?",
    answer:
      "Yes! Companies with 3+ employees get 20% off annual Premium subscriptions. Contact us at hello@getflatbed.com for a group quote. We also offer special rates for travel agencies and corporate travel managers.",
  },
];

const features = [
  {
    name: "Deals per week",
    explorer: "2 deals (48h delayed)",
    premium: "All deals in real-time",
  },
  { name: "Email newsletter", explorer: "Weekly digest", premium: "Daily digest" },
  {
    name: "Telegram channel",
    explorer: false,
    premium: "✅ Instant alerts",
  },
  {
    name: "Error fare alerts",
    explorer: false,
    premium: "✅ Immediate notification",
  },
  {
    name: "Miles & points guide",
    explorer: "Basic (10 pages)",
    premium: "Complete (50+ pages)",
  },
  { name: "Upgrade guide", explorer: false, premium: "✅ Full playbook" },
  {
    name: "Personalized alerts",
    explorer: false,
    premium: "✅ Destination + price filters",
  },
  { name: "Support", explorer: false, premium: "✅ Priority support" },
  {
    name: "Money-back guarantee",
    explorer: "—",
    premium: "✅ 7-day full refund",
  },
];

export default function PricingPage() {
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const monthlyPrice = period === "monthly" ? "€9" : "€6.58";
  const annualTotal = "€79";
  const periodLabel = period === "monthly" ? "/month" : "/mo (billed €79/yr)";

  return (
    <div className="pt-20">
      {/* HEADER */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
            Pricing
          </span>
          <h1 className="text-5xl md:text-6xl font-black mt-4 mb-6 leading-tight">
            One deal pays for
            <br />
            <span className="gold">10 years of membership</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10">
            Average member saves €1,400 on their first Premium booking. At
            €9/month, the math is obvious.
          </p>

          {/* Toggle */}
          <PricingToggle period={period} onChange={setPeriod} />
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Explorer */}
            <div className="deal-card rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-1">Explorer</h3>
              <p className="text-gray-500 text-sm mb-6">For casual travelers</p>
              <div className="text-5xl font-black mb-2">
                Free{" "}
                <span className="text-xl font-normal text-gray-500">
                  forever
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-8">
                No credit card required
              </p>
              <ul className="space-y-3 text-sm text-gray-400 mb-10">
                <li className="flex gap-2 items-start">
                  <span className="text-white mt-0.5">✓</span>
                  <span>2 deals per week (48h delay)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-white mt-0.5">✓</span>
                  <span>Weekly email newsletter</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-white mt-0.5">✓</span>
                  <span>Basic miles & points guide</span>
                </li>
                <li className="flex gap-2 items-start text-gray-600">
                  <span className="mt-0.5">✗</span>
                  <span>Real-time alerts</span>
                </li>
                <li className="flex gap-2 items-start text-gray-600">
                  <span className="mt-0.5">✗</span>
                  <span>Error fare notifications</span>
                </li>
                <li className="flex gap-2 items-start text-gray-600">
                  <span className="mt-0.5">✗</span>
                  <span>Telegram deal channel</span>
                </li>
                <li className="flex gap-2 items-start text-gray-600">
                  <span className="mt-0.5">✗</span>
                  <span>Personalized alerts</span>
                </li>
                <li className="flex gap-2 items-start text-gray-600">
                  <span className="mt-0.5">✗</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center border border-white/20 text-white font-bold py-4 rounded-xl hover:bg-white/5 transition"
              >
                Start with Explorer
              </Link>
            </div>

            {/* Premium */}
            <div
              className="rounded-2xl p-8 border-2 border-yellow-500/60 glow relative"
              style={{ background: "rgba(245,200,66,0.04)" }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="text-xs font-bold gradient-gold text-black px-4 py-1.5 rounded-full">
                  Most popular
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">Premium</h3>
              <p className="text-gray-400 text-sm mb-6">
                For serious deal hunters
              </p>
              <div className="text-5xl font-black mb-1">
                {monthlyPrice}{" "}
                <span className="text-xl font-normal text-gray-500">
                  {periodLabel}
                </span>
              </div>
              {period === "annual" && (
                <p className="text-xs text-green-400 font-semibold mb-2">
                  You save €29/year vs monthly
                </p>
              )}
              <p className="text-xs text-gray-600 mb-8">
                {period === "annual"
                  ? `Billed ${annualTotal} annually`
                  : "or €79/year — save 26%"}
              </p>
              <ul className="space-y-3 text-sm text-gray-300 mb-10">
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>All deals in real-time</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Error fare instant alerts</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Private Telegram channel</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Full points & miles playbook (50+ pages)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Upgrade & voucher strategies</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Personalized alerts (destination + budget)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>Priority email support</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="gold mt-0.5">✓</span>
                  <span>7-day money-back guarantee</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center gradient-gold text-black font-black py-4 rounded-xl hover:opacity-90 transition"
              >
                Start 7-day free trial →
              </Link>
              <p className="text-xs text-center text-gray-600 mt-3">
                No credit card needed for trial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE COMPARISON TABLE */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">
            Full feature comparison
          </h2>
          <div className="deal-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 px-6 py-4 text-sm font-bold">
              <div className="text-gray-400">Feature</div>
              <div className="text-center text-gray-400">Explorer</div>
              <div className="text-center text-yellow-500">Premium</div>
            </div>
            {features.map((feature, i) => (
              <div
                key={i}
                className="grid grid-cols-3 px-6 py-4 text-sm border-t border-white/5 hover:bg-white/5 transition"
              >
                <div className="text-gray-300">{feature.name}</div>
                <div className="text-center text-gray-500">
                  {feature.explorer === false ? (
                    <span className="text-gray-700">✗</span>
                  ) : (
                    feature.explorer
                  )}
                </div>
                <div className="text-center text-gray-300 font-semibold">
                  {feature.premium}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="rounded-2xl p-10 border border-yellow-500/20 mb-16"
            style={{ background: "rgba(245,200,66,0.04)" }}
          >
            <div className="text-5xl font-black gold mb-2">€1,400</div>
            <p className="text-gray-400">
              Average savings on first Premium booking
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Based on member-reported savings, Jan–Mar 2026
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                initials: "CR",
                name: "Carlos R.",
                city: "Madrid",
                quote:
                  "Paid for 3 years of Premium with one error fare to Singapore. Business class for €320. Unbelievable.",
              },
              {
                initials: "LM",
                name: "Laura M.",
                city: "Barcelona",
                quote:
                  "Used Turkish miles to book Emirates First Class. My friends thought I won a contest. I just read the guide.",
              },
              {
                initials: "DA",
                name: "Diego A.",
                city: "Buenos Aires",
                quote:
                  "First month I booked BCN→NYC in Iberia Business for €290. The subscription pays itself in minutes.",
              },
            ].map((t) => (
              <div key={t.name} className="deal-card rounded-2xl p-6">
                <div className="flex gap-1 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-black font-bold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-600">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">
            Pricing FAQ
          </h2>
          <div className="space-y-3">
            {pricingFaqs.map((faq, i) => (
              <div key={i} className="deal-card rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm">{faq.question}</span>
                  <span className="text-yellow-500 text-lg flex-shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">
            Start saving on business class today
          </h2>
          <p className="text-gray-400 mb-10">
            Try Premium free for 7 days. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="gradient-gold text-black font-black px-8 py-4 rounded-xl hover:opacity-90 transition"
            >
              Start 7-day free trial →
            </Link>
            <Link
              href="/register"
              className="border border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/5 transition"
            >
              Or start with Explorer (free)
            </Link>
          </div>
          <p className="text-xs text-gray-600 mt-6">
            Cancel anytime · 7-day money-back guarantee · No spam
          </p>
        </div>
      </section>
    </div>
  );
}
