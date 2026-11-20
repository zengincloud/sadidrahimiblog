"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type Row = {
  ticker: string
  label: string
  purchaseDate: string
  entryPrice?: number
  currentPrice?: number
  currency?: string
  value?: number
  gain?: number
  gainPct?: number
  error?: boolean
}

type Data = { asOf: string; investment: number; rows: Row[] }

const money = (n: number, digits = 2) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits })

const signed = (n: number) => `${n >= 0 ? "+" : "-"}${money(Math.abs(n))}`

const fmtDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })

export default function PortfolioPage() {
  const [data, setData] = useState<Data | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setFailed(true))
  }, [])

  const ok = data?.rows.filter((r) => !r.error) ?? []
  const invested = ok.length * (data?.investment ?? 0)
  const totalValue = ok.reduce((s, r) => s + (r.value ?? 0), 0)
  const totalGain = totalValue - invested

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 p-6 flex gap-8 border-b border-white/10 bg-black z-10">
        <Link href="/" className="text-lg transition-all duration-300 ease-out hover:opacity-60">
          ← back
        </Link>
        <Link href="/home" className="text-lg transition-all duration-300 ease-out hover:opacity-60">
          home
        </Link>
        <Link href="/blog" className="text-lg transition-all duration-300 ease-out hover:opacity-60">
          blog
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-5xl md:text-6xl font-sans mb-6 text-balance">portfolio</h1>
        <p className="text-xl text-white/70 leading-relaxed max-w-2xl mb-12">
          my current portfolio makeup, up to date and past purchases
        </p>

        {failed && <p className="text-white/60">couldn’t load prices right now, try again in a bit.</p>}
        {!data && !failed && <p className="text-white/40">loading prices…</p>}

        {data && (
          <>
            <p className="text-white/60 mb-8">
              what {money(data.investment, 0)} in each would be worth today
              {ok.length > 0 && (
                <>
                  {" "}
                  — <span className="text-white">{money(totalValue, 0)}</span> from {money(invested, 0)}{" "}
                  <span className={totalGain >= 0 ? "text-emerald-400" : "text-red-400"}>({signed(totalGain)})</span>
                </>
              )}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm uppercase tracking-wider text-white/50 border-b border-white/10">
                    <th className="py-3 pr-4 font-normal">Ticker</th>
                    <th className="py-3 pr-4 font-normal">Bought</th>
                    <th className="py-3 pr-4 font-normal text-right">Entry</th>
                    <th className="py-3 pr-4 font-normal text-right">Now</th>
                    <th className="py-3 pr-4 font-normal text-right">Worth</th>
                    <th className="py-3 font-normal text-right">Made</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((r) => {
                    const up = (r.gain ?? 0) >= 0
                    return (
                      <tr key={r.ticker} className="border-b border-white/10">
                        <td className="py-4 pr-4">
                          <div className="font-semibold">{r.ticker}</div>
                          <div className="text-sm text-white/50">{r.label}</div>
                        </td>
                        <td className="py-4 pr-4 text-white/80 whitespace-nowrap">{fmtDate(r.purchaseDate)}</td>
                        {r.error ? (
                          <td colSpan={4} className="py-4 text-right text-white/40">
                            price unavailable
                          </td>
                        ) : (
                          <>
                            <td className="py-4 pr-4 text-right text-white/80">{money(r.entryPrice!)}</td>
                            <td className="py-4 pr-4 text-right text-white/80">{money(r.currentPrice!)}</td>
                            <td className="py-4 pr-4 text-right">{money(r.value!)}</td>
                            <td className={`py-4 text-right whitespace-nowrap ${up ? "text-emerald-400" : "text-red-400"}`}>
                              {signed(r.gain!)}
                              <div className="text-sm">
                                {up ? "+" : ""}
                                {r.gainPct!.toFixed(1)}%
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
                {ok.length > 0 && (
                  <tfoot>
                    <tr className="border-t border-white/30">
                      <td className="py-4 pr-4 font-semibold">Total</td>
                      <td className="py-4 pr-4 text-white/50 text-sm whitespace-nowrap">{ok.length} positions</td>
                      <td className="py-4 pr-4 text-right text-white/80" colSpan={2}>
                        {money(invested, 0)} in
                      </td>
                      <td className="py-4 pr-4 text-right font-semibold">{money(totalValue)}</td>
                      <td className={`py-4 text-right whitespace-nowrap font-semibold ${totalGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {signed(totalGain)}
                        <div className="text-sm">
                          {totalGain >= 0 ? "+" : ""}
                          {((totalValue / invested - 1) * 100).toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            <p className="text-sm text-white/40 mt-8 leading-relaxed">
              Prices as of {new Date(data.asOf).toLocaleString()}. Entry is the closing price on the purchase date (or next
              trading day), except ANT at $94.68; 2025 buys use Jan 2, 2025. Price return only, no dividends. DFN.TO trades in CAD and isn’t
              converted. Not financial advice.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
