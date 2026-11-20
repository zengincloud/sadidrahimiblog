import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 p-6 flex gap-8 border-b border-white/10">
        <Link href="/" className="text-lg transition-all duration-300 ease-out hover:opacity-60">
          ← back
        </Link>
        <Link href="/blog" className="text-lg transition-all duration-300 ease-out hover:opacity-60">
          blog
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-5xl md:text-7xl font-sans mb-8 text-balance">Welcome to my home</h1>
        <p className="text-xl text-white/70 leading-relaxed max-w-2xl">I'm Sadid Rahimi, and this is my personal blog where I share with you my thoughts on current affairs, finance, startups, experiences I have experienced, and random things in between.       
        </p>
      </main>
    </div>
  )
}
