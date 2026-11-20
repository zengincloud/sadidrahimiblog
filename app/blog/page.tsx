"use client"

import Link from "next/link"

const articles = [
  {
    id: 2,
    title: "Your 2025 Markets Wrapped",
    date: "December 23, 2025",
    content: `After a brutal shit eating of the markets from pre-rate cut anticipation in October,today's GDP numbers came out over 4% and the markets finally found solace.

Markets, after either a bull rally or severe uncertainty, just generally want a handful signs of positivity, which can mean lowered rates, higher GDP, just big macroeconomic numbers. 

Superimpose this with COVID era, where investors lost a boatload of certainty, but the feds brought all that back tenfold by increasing the money supply and pumping bonds to their balance sheet (trillions in treasury notes).

The one constant that permeates all cycles of economy is fear; fear of losing your entire portfolio, your client's portfolio, your retirement livelihood, and so investors wanna know that when things are good, they're great.

Now, in complete contrast, it can also be true that markets rally on BAD news too, like we saw earlier this year. But at those times it just becomes irrational.

So how do you distinguish rational with irrationality? 

There's no definitive way to tell, but by observing some key indicators like job growth ("growth", if any), core CPI, housing starts, etc, strong indicators of a failing economy but a rising stock market, let you know surely the markets are reacting in manners otherwise not congruent to those aforementioned indicators.

Thus, a "false" bull market can be defined as any within a stagnating economy.

International markets and its impact to the S&P

Contrary to popular belief, international markets are hardly, if any, a drop in the bucket in comparison to how it affects the dominant market the global economy looks toward, the standard and poor index. 

Barring wars and turmoil that directly result in commodity gluts (Russian offload of oil barrels that resulted in the excess production by American producers) no foreign conflicts rattle American markets as much as American markets affect them. 

Therefore, when markets are trading sideways, in anticipation of a rise or fall, international markets will not provide indication of your desired direction. This tells us then that indicators should strictly be relied upon intrinsically, domestically, and in its own macro economic scale. Some influence from weighted stocks matter, of course, but it is also true that investors can ignore even the highest weighted stock if it means bullish sentiment otherwise (see Nvidia post Q3 '26 abysmal earnings). 

The US Hegemony

What this all boils down to is the simple idea that investors have been touting since time immemorial: it doesn't actually fkn matter at all.

It doesn't matter what macroeconomic numbers are telling you, it doesn't matter what European or Middle Eastern conflict America meddles in,  and it sure as shit doesn't matter what earnings each of the 500 report.

The United States economy is built with guardrails and backstops in place such that there is almost no room for error. Quite literally, the government could never default, neither on its bonds nor its corporations that make up its wealth, because of the Federal Reserve's dollar power. 
People use the greenback simply for one reason: because people use the greenback. 

And for that reason, the only thing that matters for you, the common investor, is that you're in the market, always, through peaks and valleys, throughout the fear and rallies, because despite all the volatility we've faced over the past shakey 10 years, you would still come out on top with 234% to date.`,
  },
  {
    id: 1,
    title: "The Power of J. Powell",
    date: "December 10, 2025",
    content: `

Historically, inflation doesn’t really end until the hardest parts cool down. In past cycles, central banks didn’t start cutting rates until housing costs, service prices, and overall financial conditions clearly slowed. That’s not fully happening right now. Housing costs are still high because supply is tight and replacement costs are expensive. Service prices, which usually move with wages, have stopped falling. Financial conditions are already looser, with stocks up and credit easier, even before rate cuts started. Taken together, this looks more like a late-cycle economy than one that’s fully past inflation.

In the 1970s, inflation cooled for short periods after rates went up, but it never really went away. Housing, wages, and services stayed hot. The Fed cut rates anyway, and inflation came back in waves. Eventually, rates had to be pushed much higher under Paul Volcker, which caused a recession but finally stopped inflation. The takeaway from that period is simple: easing before inflation is truly beaten usually makes the problem bigger later.

The Fed’s power, however, has always come from sticking to its plan even when markets or politics don’t like it. When policy looks shaky or too reactive, financial conditions loosen on their own. Investors take more risk, asset prices rise, and borrowing speeds up. Markets don’t just react to what the Fed does today, they react to whether they think the Fed will stay tough tomorrow.

This means cuts don’t usually cause problems right away. The effects show up later, after debt builds up and asset prices stretch further. In past cycles, this forced future policymakers to tighten much more aggressively to regain control. Those delayed corrections tended to hurt more than if restraint had been kept in place earlier.

Bottom Line

History suggests that cutting rates before housing, services inflation, and financial conditions actually cool increases the risk of inflation coming back and sets up a tougher correction down the road. It doesn’t avoid pain, it just pushes it out. 

Which of the Kevins will defy these laws and continue to cause rampant inflation? Time will tell, but we know one thing: it won't be Fed Chair Powell (:cryingemoji)`,
  },
]

export default function BlogPage() {
  const scrollToArticle = (id: number) => {
    const element = document.getElementById(`article-${id}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 p-6 flex gap-8 border-b border-white/10 bg-black z-10">
        <Link href="/" className="text-lg transition-all duration-300 ease-out hover:opacity-60">
          ← back
        </Link>
        <Link href="/home" className="text-lg transition-all duration-300 ease-out hover:opacity-60">
          home
        </Link>
      </nav>

      <aside className="fixed left-6 top-32 hidden lg:block w-64 z-20">
        <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Index</h3>
        <nav className="space-y-3">
          {articles.map((article) => (
            <button
              key={article.id}
              onClick={() => scrollToArticle(article.id)}
              className="block text-left text-sm leading-tight transition-all duration-300 ease-out hover:text-white hover:translate-x-1 text-white/60"
            >
              {article.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 lg:ml-80">
        <h1 className="text-5xl md:text-6xl font-sans mb-16 text-balance">articles</h1>

        <div className="space-y-20">
          {articles.map((article) => (
            <article
              id={`article-${article.id}`}
              key={article.id}
              className="border-b border-white/10 pb-20 last:border-0 scroll-mt-32"
            >
              <time className="text-sm text-white/50 mb-3 block">{article.date}</time>
              <h2 className="text-3xl md:text-4xl font-sans mb-6 text-balance">{article.title}</h2>
              <div className="prose prose-invert max-w-none">
                {article.content.split("\n\n").map((paragraph, index) => {
                  const isSectionHeader =
                    paragraph === "International markets and its impact to the S&P" || paragraph === "The US Hegemony" || paragraph === "Bottom Line"

                  return (
                    <p
                      key={index}
                      className={`leading-relaxed mb-4 text-pretty ${
                        isSectionHeader ? "text-white font-semibold italic text-lg" : "text-white/80"
                      }`}
                    >
                      {isSectionHeader ? (
                        <strong>
                          <em>{paragraph}</em>
                        </strong>
                      ) : (
                        paragraph
                      )}
                    </p>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
