export const INVESTMENT = 1000

export type Position = {
  ticker: string
  label: string
  // ISO purchase date. Entry price = first closing price on/after this date.
  purchaseDate: string
  // Optional fixed purchase price; used instead of the historical close.
  entryPrice?: number
}

// Update these when you make a purchase or want an exact date.
// 2025 purchases use the first trading day of the year (Jan 2, 2025).
export const positions: Position[] = [
  { ticker: "TSM", label: "Taiwan Semiconductor", purchaseDate: "2025-01-02" },
  { ticker: "ASML", label: "ASML", purchaseDate: "2025-01-02" },
  { ticker: "NVDA", label: "NVIDIA", purchaseDate: "2025-01-02" },
  { ticker: "SPY", label: "S&P 500 ETF", purchaseDate: "2025-01-02" },
  { ticker: "DFN.TO", label: "Dividend 15 Split Corp.", purchaseDate: "2025-01-02" },
  { ticker: "WU", label: "Western Union", purchaseDate: "2026-01-02" },
  { ticker: "ANT", label: "Anthropic", purchaseDate: "2026-11-19", entryPrice: 94.68 },
]
