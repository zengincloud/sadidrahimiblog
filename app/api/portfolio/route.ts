import { NextResponse } from "next/server"
import { INVESTMENT, positions } from "@/lib/portfolio"

export const dynamic = "force-dynamic"

async function quote(ticker: string, purchaseDate: string, entryOverride?: number) {
  const period1 = Math.floor(Date.parse(`${purchaseDate}T00:00:00Z`) / 1000)
  const period2 = Math.floor(Date.now() / 1000) + 86400
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    ticker,
  )}?period1=${period1}&period2=${period2}&interval=1d`

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const result = json?.chart?.result?.[0]
  if (!result) throw new Error("no data")

  const opens: (number | null)[] = result.indicators?.quote?.[0]?.open ?? []
  const entry = entryOverride ?? opens.find((c): c is number => typeof c === "number")
  const current: number | undefined = result.meta?.regularMarketPrice
  if (entry === undefined || current === undefined) throw new Error("no prices")

  const value = (INVESTMENT / entry) * current

  // Daily value of the $1,000 position, from the purchase date to now.
  const stamps: number[] = result.timestamp ?? []
  const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? []
  const offset: number = result.meta?.gmtoffset ?? 0
  const series: { d: string; v: number }[] = []
  stamps.forEach((t, i) => {
    const c = closes[i]
    if (typeof c !== "number") return
    series.push({ d: new Date((t + offset) * 1000).toISOString().slice(0, 10), v: (INVESTMENT / entry) * c })
  })
  // Make the last point match the live price shown in the table.
  if (series.length) series[series.length - 1].v = value
  else series.push({ d: new Date().toISOString().slice(0, 10), v: value })

  return {
    series,
    entryPrice: entry,
    currentPrice: current,
    currency: result.meta?.currency ?? "USD",
    value,
    gain: value - INVESTMENT,
    gainPct: (value / INVESTMENT - 1) * 100,
  }
}

export async function GET() {
  const rows = await Promise.all(
    positions.map(async (p) => {
      try {
        return { ...p, ...(await quote(p.ticker, p.purchaseDate, p.entryPrice)) }
      } catch {
        return { ...p, error: true as const }
      }
    }),
  )
  return NextResponse.json({ asOf: new Date().toISOString(), investment: INVESTMENT, rows })
}
