import Link from "next/link"

export default function EntryPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="pt-8 px-8">
        <h1 className="text-white text-xl font-sans">sadid rahimi</h1>
      </header>

      <nav className="flex-1 flex flex-col items-center justify-center gap-8">
        <Link
          href="/home"
          className="text-white text-6xl md:text-8xl font-sans tracking-tight transition-all duration-500 ease-out hover:tracking-widest hover:opacity-60"
        >
          home
        </Link>
        <Link
          href="/blog"
          className="text-white text-6xl md:text-8xl font-sans tracking-tight transition-all duration-500 ease-out hover:tracking-widest hover:opacity-60"
        >
          blog
        </Link>
        <Link
          href="/portfolio"
          className="text-white text-6xl md:text-8xl font-sans tracking-tight transition-all duration-500 ease-out hover:tracking-widest hover:opacity-60"
        >
          portfolio
        </Link>
      </nav>
    </div>
  )
}
