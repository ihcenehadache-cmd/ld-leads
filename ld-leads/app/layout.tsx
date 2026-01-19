import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LD LEADS | Find your perfect leads next to you",
  description: "Advanced AI-powered lead discovery and strategic B2B intelligence platform.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} antialiased bg-[#020202] text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
