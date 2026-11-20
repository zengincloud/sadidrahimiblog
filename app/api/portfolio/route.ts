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

  const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? []
  const entry = entryOverride ?? closes.find((c): c is number => typeof c === "number")
  const current: number | undefined = result.meta?.regularMarketPrice
  if (entry === undefined || current === undefined) throw new Error("no prices")

  const value = (INVESTMENT / entry) * current
  return {
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
