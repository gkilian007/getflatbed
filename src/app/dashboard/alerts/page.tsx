"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Alert = {
  id: string
  origin: string | null
  destination: string | null
  max_price: number | null
  deal_types: string[]
  channels: string[]
  active: boolean
  created_at: string
}

const DEAL_TYPE_OPTIONS = [
  { value: "error_fare", label: "⚡ Error Fares" },
  { value: "miles", label: "🏆 Miles Deals" },
  { value: "flash_sale", label: "🔔 Flash Sales" },
  { value: "voucher", label: "💳 Vouchers" },
]

const CHANNEL_OPTIONS = [
  { value: "email", label: "📧 Email" },
  { value: "telegram", label: "📱 Telegram" },
]

export default function AlertsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isPremium, setIsPremium] = useState(false)
  const [telegramConnected, setTelegramConnected] = useState(false)
  const [connectCode, setConnectCode] = useState<string | null>(null)
  const [loadingCode, setLoadingCode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    max_price: "",
    deal_types: [] as string[],
    channels: ["email"],
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan, telegram_chat_id")
        .eq("id", user.id)
        .single()

      setIsPremium(profile?.plan === "premium")
      setTelegramConnected(!!profile?.telegram_chat_id)

      const { data: alertsData } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false })

      setAlerts(alertsData || [])
      setLoading(false)
    }
    load()
  }, [router, supabase])

  async function handleCreateAlert(e: React.FormEvent) {
    e.preventDefault()
    if (!isPremium) return
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("alerts")
      .insert({
        user_id: user.id,
        origin: form.origin || null,
        destination: form.destination || null,
        max_price: form.max_price ? Number(form.max_price) : null,
        deal_types: form.deal_types,
        channels: form.channels,
        active: true,
      })
      .select()
      .single()

    if (!error && data) {
      setAlerts((prev) => [data, ...prev])
      setForm({ origin: "", destination: "", max_price: "", deal_types: [], channels: ["email"] })
    }
    setSaving(false)
  }

  async function handleDeleteAlert(id: string) {
    await supabase.from("alerts").delete().eq("id", id)
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleGetCode() {
    setLoadingCode(true)
    const res = await fetch("/api/telegram/connect", { method: "POST" })
    const json = await res.json()
    setConnectCode(json.code)
    setLoadingCode(false)
  }

  function toggleDealType(value: string) {
    setForm((prev) => ({
      ...prev,
      deal_types: prev.deal_types.includes(value)
        ? prev.deal_types.filter((t) => t !== value)
        : [...prev.deal_types, value],
    }))
  }

  function toggleChannel(value: string) {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.includes(value)
        ? prev.channels.filter((c) => c !== value)
        : [...prev.channels, value],
    }))
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black">
              My <span className="gold">Alerts</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Get notified instantly when matching deals are posted.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-300"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Premium gate */}
        {!isPremium && (
          <div
            className="rounded-2xl border border-yellow-500/30 p-6 mb-10 glow"
            style={{ background: "rgba(245,200,66,0.04)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-black text-lg mb-1">Alerts are a Premium feature</h2>
                <p className="text-gray-400 text-sm">
                  Upgrade to create custom alerts and receive instant Telegram + email notifications.
                </p>
              </div>
              <Link
                href="/pricing"
                className="gradient-gold text-black font-black text-sm px-5 py-2.5 rounded-full whitespace-nowrap"
              >
                Upgrade →
              </Link>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Create alert */}
          <div>
            <h2 className="text-xl font-black mb-4">Create Alert</h2>
            <form
              onSubmit={handleCreateAlert}
              className="deal-card rounded-2xl p-6 space-y-4"
            >
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">
                  Origin (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MAD, BCN, LIS"
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value.toUpperCase() })}
                  disabled={!isPremium}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">
                  Destination (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. JFK, NRT, DXB"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value.toUpperCase() })}
                  disabled={!isPremium}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">
                  Max Price (€, optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={form.max_price}
                  onChange={(e) => setForm({ ...form, max_price: e.target.value })}
                  disabled={!isPremium}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                  Deal Types
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DEAL_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleDealType(opt.value)}
                      disabled={!isPremium}
                      className={`text-xs py-2 px-3 rounded-lg border text-left transition-colors disabled:opacity-40 ${
                        form.deal_types.includes(opt.value)
                          ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                  Notify via
                </label>
                <div className="flex gap-2">
                  {CHANNEL_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleChannel(opt.value)}
                      disabled={!isPremium}
                      className={`text-xs py-2 px-3 rounded-lg border transition-colors disabled:opacity-40 ${
                        form.channels.includes(opt.value)
                          ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!isPremium || saving}
                className="w-full gradient-gold text-black font-black py-2.5 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Create Alert"}
              </button>
            </form>

            {/* Telegram Connect */}
            <div className="deal-card rounded-2xl p-6 mt-6">
              <h3 className="font-black mb-1">📱 Telegram Notifications</h3>
              <p className="text-gray-500 text-sm mb-4">
                {telegramConnected
                  ? "Your Telegram is connected. You'll receive instant deal alerts."
                  : "Connect Telegram to receive instant push notifications for new deals."}
              </p>

              {telegramConnected ? (
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <span>✓ Connected</span>
                </div>
              ) : (
                <div>
                  {!connectCode ? (
                    <button
                      onClick={handleGetCode}
                      disabled={loadingCode || !isPremium}
                      className="gradient-gold text-black font-black text-sm px-5 py-2.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {loadingCode ? "Generating..." : "Connect Telegram"}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-2">Your one-time code (valid 10 min):</p>
                        <p className="text-3xl font-black tracking-widest gold text-center">{connectCode}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-400 space-y-1">
                        <p>1. Open Telegram and search <span className="text-white font-semibold">@Getflatbedbot</span></p>
                        <p>2. Send: <code className="text-yellow-400 bg-yellow-500/10 px-1 rounded">/connect {connectCode}</code></p>
                        <p>3. Done! ✅</p>
                      </div>
                      <button
                        onClick={handleGetCode}
                        className="text-xs text-gray-500 hover:text-gray-300"
                      >
                        Generate new code
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Active alerts list */}
          <div>
            <h2 className="text-xl font-black mb-4">
              Active Alerts{" "}
              <span className="text-gray-600 font-normal text-base">({alerts.length})</span>
            </h2>

            {alerts.length === 0 ? (
              <div className="deal-card rounded-2xl p-8 text-center text-gray-500">
                <div className="text-4xl mb-3">🔔</div>
                <p className="text-sm">No alerts yet. Create one to get notified!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="deal-card rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm">
                          {alert.origin || "Any"} → {alert.destination || "Any"}
                        </div>
                        {alert.max_price && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            Max €{alert.max_price}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {alert.deal_types.length > 0
                            ? alert.deal_types.map((t) => (
                                <span
                                  key={t}
                                  className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400"
                                >
                                  {t.replace("_", " ")}
                                </span>
                              ))
                            : (
                              <span className="text-xs text-gray-600">All types</span>
                            )}
                        </div>
                        <div className="flex gap-1 mt-1.5">
                          {alert.channels.map((c) => (
                            <span
                              key={c}
                              className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600"
                            >
                              {c === "email" ? "📧" : "📱"} {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-gray-600 hover:text-red-400 text-lg leading-none flex-shrink-0"
                        title="Delete alert"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
