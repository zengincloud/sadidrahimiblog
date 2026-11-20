import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "sadid rahimi blogs",
  description: "",
  generator: "v0.app",
  openGraph: {
    title: "sadid rahimi blogs",
    description: "",
    images: [
      {
        url: "/og-image.png",
        width: 500,
        height: 500,
        alt: "sadid rahimi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "sadid rahimi",
    description: "",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
