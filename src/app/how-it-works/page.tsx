"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Are error fares legal?",
    answer:
      "Yes, in the vast majority of cases. When an airline publishes a fare — even by mistake — and you book it, you have a valid contract. Most airlines honor these bookings to avoid reputational damage. In rare cases they may cancel and refund you, but this is the exception, not the rule. We only alert to fares that have a high likelihood of being honored.",
  },
  {
    question: "What if the airline cancels my ticket?",
    answer:
      "If an airline cancels an error fare booking, they are legally required to refund you in full. You won't lose money. That said, we recommend not booking non-refundable hotels until your ticket is confirmed (usually 24-48h after booking).",
  },
  {
    question: "Can I trust miles deals?",
    answer:
      "Absolutely. Miles deals use legitimate frequent flyer programs — Turkish Miles&Smiles, Flying Blue, Iberia Avios — to book business class seats at drastically reduced redemption rates. These are not hacks or workarounds; they are the programs working as intended, just optimized.",
  },
  {
    question: "Do I need a specific credit card?",
    answer:
      "Not for most deals. Error fares and flash sales just require a payment card. For miles deals, you need points in a specific program. Our guides explain exactly how to earn points quickly — often through credit card sign-up bonuses that give you 50,000+ points immediately.",
  },
  {
    question: "Are alerts personalized?",
    answer:
      "Premium members can set origin airports, dream destinations, and deal type preferences. Our algorithm then prioritizes relevant deals. Explorer members receive our curated weekly digest of the best deals across all routes.",
  },
  {
    question: "How fast do I need to act?",
    answer:
      "Error fares typically last 2–6 hours before the airline corrects the price. Flash sales can last up to 48 hours. That's why Premium members receive instant Telegram alerts — so you can act within minutes, not hours.",
  },
  {
    question: "Do you send spam?",
    answer:
      "Never. We only send alerts when there's a genuine deal worth your attention. Premium members get instant alerts (1-3 per week on average). Explorer members get a weekly digest. You can adjust frequency or unsubscribe anytime with one click.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No contracts, no commitments. Cancel your Premium subscription anytime from your account settings and you won't be charged again. We also offer a 7-day money-back guarantee on new Premium subscriptions, no questions asked.",
  },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
            Behind the scenes
          </span>
          <h1 className="text-5xl md:text-6xl font-black mt-4 mb-6 leading-tight">
            How we find deals
            <br />
            <span className="gold">nobody else does</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            While everyone else books at full price, our team monitors hundreds
            of sources around the clock — catching pricing mistakes, redemption
            sweet spots, and limited-time sales the moment they go live.
          </p>
        </div>
      </section>

      {/* SOURCE 1: ERROR FARES */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-4xl mb-6 block">⚡</span>
              <span className="text-xs font-bold tracking-widest text-red-400 uppercase mb-3 block">
                Source 1
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Error Fares
              </h2>
              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>
                  <strong className="text-white">What is an error fare?</strong>{" "}
                  Airlines publish millions of fares daily across hundreds of
                  booking systems. Occasionally, a human input error, currency
                  conversion glitch, or system bug creates a price that&apos;s
                  90%+ below the actual value. These are error fares.
                </p>
                <p>
                  <strong className="text-white">Why are they legal?</strong> In
                  most jurisdictions, when an airline publishes and accepts
                  payment for a fare, a contract is formed. Airlines almost
                  always honor these bookings to protect their brand reputation.
                </p>
                <p>
                  <strong className="text-white">
                    How long do they last?
                  </strong>{" "}
                  Typically 2–6 hours. Once the airline notices, the price is
                  corrected. This is why instant alerts are critical — waiting
                  until tomorrow means missing the deal entirely.
                </p>
                <p>
                  <strong className="text-white">What we do:</strong> The moment
                  we detect an error fare, we verify it manually, confirm
                  booking works, and push an instant alert to Premium members
                  via Telegram and email simultaneously.
                </p>
              </div>
            </div>
            <div className="deal-card rounded-2xl p-8">
              <div className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wide">
                Example error fare
              </div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full inline-block mb-2">
                    ⚡ Error fare
                  </div>
                  <h3 className="text-xl font-bold">Madrid → Bangkok</h3>
                  <p className="text-xs text-gray-500">
                    Iberia Business · oneworld
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600 line-through">
                    €4,200
                  </div>
                  <div className="text-3xl font-black text-green-400">€280</div>
                  <div className="text-xs text-yellow-500 font-semibold">
                    93% off
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 bg-white/5 rounded-lg p-3">
                🕐 Alert sent at 14:32 · Deal expired at 17:15
                <br />
                ✅ 47 members booked in time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCE 2: MILES & POINTS */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div
                className="deal-card rounded-2xl p-6 overflow-x-auto"
              >
                <div className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wide">
                  Program comparison
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-600 border-b border-white/10">
                      <th className="text-left py-2">Program</th>
                      <th className="text-left py-2">Best route</th>
                      <th className="text-right py-2">Points</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400 space-y-2">
                    {[
                      ["Turkish M&S", "MAD→NYC", "45K"],
                      ["Flying Blue", "MAD→JFK", "50K"],
                      ["Iberia Avios", "MAD→BOG", "34K"],
                      ["Emirates Skywards", "BCN→DXB", "55K"],
                      ["ANA Mileage", "BCN→NRT", "60K"],
                    ].map(([prog, route, pts]) => (
                      <tr
                        key={prog}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="py-2 font-semibold text-white">
                          {prog}
                        </td>
                        <td className="py-2">{route}</td>
                        <td className="py-2 text-right text-green-400 font-bold">
                          {pts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-4xl mb-6 block">🏆</span>
              <span className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3 block">
                Source 2
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Miles & Points Hacks
              </h2>
              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>
                  <strong className="text-white">The big alliances:</strong>{" "}
                  Oneworld, SkyTeam, and Star Alliance let you use points from
                  one airline to book seats on partner carriers — often at a
                  fraction of the &quot;standard&quot; redemption rate.
                </p>
                <p>
                  <strong className="text-white">The secret programs:</strong>{" "}
                  Turkish Miles&amp;Smiles lets you fly business class on United,
                  Lufthansa, or Singapore for as little as 45,000 points.
                  Flying Blue frequently runs 50% off promos on business class.
                </p>
                <p>
                  <strong className="text-white">
                    How to earn without flying:
                  </strong>{" "}
                  Credit card sign-up bonuses in Spain can give you 50,000–
                  80,000 points instantly. Hotel transfers, shopping portals,
                  and partner programs top up your balance fast.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCE 3: UPGRADES */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-4xl mb-6 block">🔼</span>
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3 block">
                Source 3
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Upgrades & Vouchers
              </h2>
              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>
                  <strong className="text-white">
                    Companion certificates:
                  </strong>{" "}
                  Many premium credit cards include a &quot;companion
                  certificate&quot; — one free or heavily discounted business
                  class ticket when you buy one at full price. We show you which
                  cards offer this and which routes to pair them with.
                </p>
                <p>
                  <strong className="text-white">Bid upgrades:</strong>{" "}
                  Airlines like Iberia, British Airways, and Lufthansa offer
                  upgrade auctions (via Plusgrade) where economy passengers
                  bid for unsold business seats. Winning bids are often 60–80%
                  below the upgrade fare.
                </p>
                <p>
                  <strong className="text-white">
                    Last-minute counters:
                  </strong>{" "}
                  Within 48 hours of departure, airlines sometimes sell unsold
                  premium seats at steep discounts. We monitor these windows and
                  alert you when a relevant route drops.
                </p>
                <p>
                  <strong className="text-white">Status match:</strong> Flying
                  business class on a competitor? You can often match your elite
                  status to another airline — giving you upgrade priority,
                  lounge access, and bonus miles from day one.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "🎫",
                  title: "Companion Cert",
                  desc: "2-for-1 business tickets",
                },
                {
                  icon: "🔨",
                  title: "Bid Upgrade",
                  desc: "Auction for empty seats",
                },
                {
                  icon: "⏱️",
                  title: "Last Minute",
                  desc: "48h before departure",
                },
                {
                  icon: "⭐",
                  title: "Status Match",
                  desc: "Instant elite benefits",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="deal-card rounded-xl p-5 text-center"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="text-sm font-bold mb-1">{item.title}</div>
                  <div className="text-xs text-gray-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              Our process
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3">
              From discovery to your inbox
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />
            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Monitor 200+ sources",
                  desc: "We track airline websites, GDS systems, booking aggregators, and community tip sources — 24 hours a day, 7 days a week, 365 days a year. No deal escapes our net.",
                  icon: "🔍",
                },
                {
                  step: "02",
                  title: "Manual verification",
                  desc: "Every potential deal is checked by a human before we send any alert. We verify the fare is actually bookable, confirm the routing makes sense, and estimate how long it will last.",
                  icon: "✅",
                },
                {
                  step: "03",
                  title: "Instant alert sent",
                  desc: "Premium members receive a Telegram message and email simultaneously — usually within 5 minutes of our team confirming the deal. Explorer members receive the best deals in their weekly digest.",
                  icon: "⚡",
                },
                {
                  step: "04",
                  title: "You book directly",
                  desc: "We link directly to the airline's website. No middleman, no booking fees. You book and pay the airline directly, keeping full control and the airline's customer service.",
                  icon: "🛫",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <div className="relative z-10 w-12 h-12 gradient-gold rounded-full flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="deal-card rounded-2xl p-6 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{item.icon}</span>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3">
              Questions & answers
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
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

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to fly business for less?
          </h2>
          <p className="text-gray-400 mb-10">
            Join hundreds of smart travelers who already pay a fraction of the
            price.
          </p>
          {submitted ? (
            <p className="text-green-400 font-bold text-lg">
              You&apos;re in! Check your inbox soon.
            </p>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-xl text-base"
                />
                <button
                  type="submit"
                  className="gradient-gold text-black font-black px-7 py-4 rounded-xl hover:opacity-90 transition"
                >
                  Get alerts free →
                </button>
              </form>
              <p className="text-xs text-gray-600 mt-4">
                Free forever · No credit card · Unsubscribe anytime
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
