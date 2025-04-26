import type { ReactNode } from "react"

import "./globals.css"

import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import OriginTracker from "@/components/Composite/providers/OriginTracker"
import QueryClientProvider from "@/components/Composite/providers/QueryClientProvider"
import SessionProvider from "@/components/Composite/providers/SessionProvider"
import { Providers } from "@/components/Composite/providers/UIProvider"
import { Toaster } from "@/components/Generic/ui/toaster"
import { ColorModeScript } from "@yamada-ui/react"

export const metadata: Metadata = {
  title: "UABC Booking Portal",
  description: "Book your badminton sessions with the University of Auckland Badminton Club.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/icon.svg",
        href: "/svgs/icon.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/svgs/icon-darkmode.svg",
        href: "/svgs/icon-darkmode.svg",
      },
    ],
  },
  verification: {
    google: "0Ry7iEopHE0vvfRKRY_Py-CpaOb764pPGqs33RuLBU0",
  },
}

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${inter.variable} font-sans`} lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ColorModeScript initialColorMode="light" />
        <QueryClientProvider>
          <SessionProvider>
            <OriginTracker>
              <Providers>{children}</Providers>
            </OriginTracker>
          </SessionProvider>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  )
}
