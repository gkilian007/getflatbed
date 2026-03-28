"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

const ADMIN_EMAIL = "paeltuyo@gmail.com"
const ADMIN_KEY = "getflatbed-admin-2026"

interface ScrapeResult {
  found: number
  new: number
  skipped: number
  errors: string[]
  sources: Record<string, number>
  duration_ms: number
}

interface DealStats {
  total: number
  bySource: Record<string, number>
  byType: Record<string, number>
  active: number
  expired: number
}

interface Deal {
  source: string | null
  type: string
  status: string
}

export default function AdminPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null)
  const [stats, setStats] = useState<DealStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || null)
      setLoading(false)
    })
  }, [])

  async function runScraper() {
    setScraping(true)
    setScrapeResult(null)
    try {
      const res = await fetch("/api/cron/scrape-deals", {
        headers: { "x-admin-key": ADMIN_KEY },
      })
      const data: ScrapeResult = await res.json()
      setScrapeResult(data)
    } catch (err) {
      setScrapeResult({
        found: 0,
        new: 0,
        skipped: 0,
        errors: [(err as Error).message],
        sources: {},
        duration_ms: 0,
      })
    } finally {
      setScraping(false)
    }
  }

  async function loadStats() {
    setStatsLoading(true)
    try {
      const supabase = createClient()
      const { data: deals } = await supabase
        .from("deals")
        .select("source, type, status")

      if (!deals) {
        setStatsLoading(false)
        return
      }

      const bySource: Record<string, number> = {}
      const byType: Record<string, number> = {}
      let active = 0
      let expired = 0

      for (const deal of deals as Deal[]) {
        const src = deal.source || "manual"
        bySource[src] = (bySource[src] || 0) + 1
        byType[deal.type] = (byType[deal.type] || 0) + 1
        if (deal.status === "active") active++
        else expired++
      }

      setStats({
        total: deals.length,
        bySource,
        byType,
        active,
        expired,
      })
    } catch (err) {
      console.error("Stats error:", err)
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  if (userEmail !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">Admin access required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2">
          ✈️ GetFlatbed <span className="text-yellow-400">Admin</span>
        </h1>
        <p className="text-gray-400 mb-8">Deal management & monitoring</p>

        {/* Scraper section */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔍 Deal Scraper</h2>
          <p className="text-gray-400 text-sm mb-4">
            Runs all scrapers (Secret Flying, The Flight Deal, Amadeus) and publishes new deals.
          </p>

          <button
            onClick={runScraper}
            disabled={scraping}
            className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {scraping ? "⏳ Buscando ofertas..." : "🔍 Ejecutar búsqueda de ofertas ahora"}
          </button>

          {scrapeResult && (
            <div className="mt-4 bg-black/50 border border-white/5 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{scrapeResult.found}</div>
                  <div className="text-xs text-gray-500">Encontradas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-green-400">{scrapeResult.new}</div>
                  <div className="text-xs text-gray-500">Nuevas publicadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-gray-400">{scrapeResult.skipped}</div>
                  <div className="text-xs text-gray-500">Duplicadas omitidas</div>
                </div>
              </div>

              {Object.keys(scrapeResult.sources).length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Por fuente:</div>
                  <div className="flex gap-3 flex-wrap">
                    {Object.entries(scrapeResult.sources).map(([src, count]) => (
                      <span key={src} className="text-xs bg-white/5 px-2 py-1 rounded">
                        {src}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {scrapeResult.duration_ms > 0 && (
                <div className="text-xs text-gray-600">
                  Completado en {(scrapeResult.duration_ms / 1000).toFixed(1)}s
                </div>
              )}

              {scrapeResult.errors.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-red-400 mb-1">Errores ({scrapeResult.errors.length}):</div>
                  {scrapeResult.errors.map((e, i) => (
                    <div key={i} className="text-xs text-red-300/70 font-mono truncate">
                      {e}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats section */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">📊 Estadísticas</h2>
            <button
              onClick={loadStats}
              disabled={statsLoading}
              className="text-sm border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5 disabled:opacity-50 transition-all"
            >
              {statsLoading ? "Cargando..." : "📊 Ver estadísticas"}
            </button>
          </div>

          {stats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black">{stats.total}</div>
                  <div className="text-xs text-gray-500">Total deals</div>
                </div>
                <div className="bg-black/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-green-400">{stats.active}</div>
                  <div className="text-xs text-gray-500">Activas</div>
                </div>
                <div className="bg-black/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-gray-500">{stats.expired}</div>
                  <div className="text-xs text-gray-500">Expiradas</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Por tipo</div>
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm py-1 border-b border-white/5">
                      <span className="text-gray-300">{type}</span>
                      <span className="text-yellow-400 font-bold">{count}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2">Por fuente</div>
                  {Object.entries(stats.bySource).map(([src, count]) => (
                    <div key={src} className="flex justify-between text-sm py-1 border-b border-white/5">
                      <span className="text-gray-300">{src}</span>
                      <span className="text-yellow-400 font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Haz clic en &quot;Ver estadísticas&quot; para cargar los datos.</p>
          )}
        </div>

        {/* Cron info */}
        <div className="mt-6 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
          <div className="text-yellow-400 text-sm font-bold mb-1">⚡ Cron automático</div>
          <div className="text-gray-400 text-xs">
            El scraper está configurado para ejecutarse cada 30 minutos vía Vercel Cron (requiere plan Pro).
            En plan Free, se ejecuta 1 vez/día. Usa el botón de arriba para búsquedas manuales.
          </div>
          <div className="text-gray-500 text-xs mt-1 font-mono">
            GET /api/cron/scrape-deals?key=ADMIN_KEY
          </div>
        </div>
      </div>
    </div>
  )
}
