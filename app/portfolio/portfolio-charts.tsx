"use client"

import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Row = {
  ticker: string
  label: string
  series?: { d: string; v: number }[]
  error?: boolean
}

// Categorical slots 1-7 (dark-surface steps), assigned in the fixed order positions are listed.
const SERIES = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#0ca30c", "#9085e9"]
const SURFACE = "#1a1a19"
const INK = "#f0efec"
const INK_2 = "#c3c2b7"
const INK_MUTED = "#8a8982"
const GRID = "rgba(255,255,255,0.08)"

const pct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const tick = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`)
  return `${d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })} '${String(d.getUTCFullYear()).slice(2)}`
}
const full = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })

type Point = Record<string, number | string | undefined> & { d: string; worth: number; invested: number }

function useChartData(rows: Row[], investment: number) {
  return useMemo(() => {
    const live = rows.filter((r) => !r.error && r.series?.length)
    const dates = Array.from(new Set(live.flatMap((r) => r.series!.map((p) => p.d)))).sort()
    const maps = live.map((r) => new Map(r.series!.map((p) => [p.d, p.v])))
    const last: Record<string, number | undefined> = {}
    const points: Point[] = dates.map((d) => {
      let worth = 0
      let invested = 0
      const pt: Point = { d, worth: 0, invested: 0 }
      live.forEach((r, i) => {
        const v = maps[i].get(d)
        if (v !== undefined) last[r.ticker] = v
        const cur = last[r.ticker]
        if (cur === undefined) return // not bought yet
        worth += cur
        invested += investment
        pt[r.ticker] = (cur / investment - 1) * 100
      })
      pt.worth = worth
      pt.invested = invested
      return pt
    })
    return { live, points }
  }, [rows, investment])
}

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl p-5 mb-6" style={{ background: SURFACE }}>
      <h2 className="text-lg font-semibold" style={{ color: INK }}>
        {title}
      </h2>
      <p className="text-sm mb-4" style={{ color: INK_2 }}>
        {sub}
      </p>
      {children}
    </section>
  )
}

function Swatch({ color, dashed }: { color: string; dashed?: boolean }) {
  return (
    <span
      className="inline-block w-3 h-0 mr-2 align-middle"
      style={{ borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}` }}
    />
  )
}

export default function PortfolioCharts({ rows, investment }: { rows: Row[]; investment: number }) {
  const { live, points } = useChartData(rows, investment)
  if (points.length === 0) return null
  const lastIdx = points.length - 1
  const axis = { stroke: INK_MUTED, fontSize: 12, tickLine: false, axisLine: false } as const

  return (
    <div className="mb-10">
      {/* Chart 1: total worth vs money in */}
      <Card title="Total worth vs. money in" sub={`Every position starts as ${usd(investment)} on its purchase date.`}>
        <div className="flex gap-5 text-sm mb-2" style={{ color: INK_2 }}>
          <span>
            <Swatch color={INK} />
            Worth
          </span>
          <span>
            <Swatch color={INK_MUTED} dashed />
            Invested
          </span>
        </div>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={points} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="d" tickFormatter={tick} minTickGap={48} {...axis} />
              <YAxis tickFormatter={usd} width={64} domain={["auto", "auto"]} {...axis} />
              <Tooltip
                cursor={{ stroke: INK_MUTED, strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const p = payload[0].payload as Point
                  const gain = p.worth - p.invested
                  return (
                    <div className="rounded-lg px-3 py-2 text-sm shadow-lg" style={{ background: "#000", color: INK, border: `1px solid ${GRID}` }}>
                      <div style={{ color: INK_2 }}>{full(p.d)}</div>
                      <div>Worth {usd(p.worth)}</div>
                      <div style={{ color: INK_2 }}>Invested {usd(p.invested)}</div>
                      <div>
                        {gain >= 0 ? "+" : "-"}
                        {usd(Math.abs(gain))} ({pct((p.worth / p.invested - 1) * 100)})
                      </div>
                    </div>
                  )
                }}
              />
              <Line type="stepAfter" dataKey="invested" stroke={INK_MUTED} strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={false} isAnimationActive={false} />
              <Line
                type="monotone"
                dataKey="worth"
                stroke={INK}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: INK, stroke: SURFACE, strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Chart 2: per-position return since purchase, indexed to 0% */}
      <Card title="Each pick since purchase" sub="Return on each $1,000 entry, starting from 0% on its own purchase date.">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm mb-2" style={{ color: INK_2 }}>
          {live.map((r, i) => (
            <span key={r.ticker}>
              <Swatch color={SERIES[i % SERIES.length]} />
              {r.ticker}
            </span>
          ))}
        </div>
        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer>
            <LineChart data={points} margin={{ top: 8, right: 64, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="d" tickFormatter={tick} minTickGap={48} {...axis} />
              <YAxis tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}%`} width={56} {...axis} />
              <ReferenceLine y={0} stroke={INK_MUTED} strokeDasharray="2 3" />
              <Tooltip
                cursor={{ stroke: INK_MUTED, strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const items = payload
                    .filter((p) => typeof p.value === "number")
                    .sort((a, b) => (b.value as number) - (a.value as number))
                  return (
                    <div className="rounded-lg px-3 py-2 text-sm shadow-lg" style={{ background: "#000", color: INK, border: `1px solid ${GRID}` }}>
                      <div className="mb-1" style={{ color: INK_2 }}>
                        {full(String(label))}
                      </div>
                      {items.map((p) => (
                        <div key={String(p.dataKey)} className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
                          <span className="w-14">{String(p.dataKey)}</span>
                          <span>{pct(p.value as number)}</span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
              {live.map((r, i) => {
                const color = SERIES[i % SERIES.length]
                return (
                  <Line
                    key={r.ticker}
                    type="monotone"
                    dataKey={r.ticker}
                    stroke={color}
                    strokeWidth={2}
                    isAnimationActive={false}
                    activeDot={{ r: 5, fill: color, stroke: SURFACE, strokeWidth: 2 }}
                    // Marker + direct label on the final point only.
                    dot={(p: { cx?: number; cy?: number; index?: number; value?: number }) => {
                      if (p.index !== lastIdx || p.cx === undefined || p.cy === undefined) return <g key={`${r.ticker}-${p.index}`} />
                      return (
                        <g key={`${r.ticker}-end`}>
                          <circle cx={p.cx} cy={p.cy} r={4} fill={color} stroke={SURFACE} strokeWidth={2} />
                          <text x={p.cx + 9} y={p.cy} dy="0.32em" fontSize={11} fill={INK_2}>
                            {r.ticker}
                          </text>
                        </g>
                      )
                    }}
                  />
                )
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
