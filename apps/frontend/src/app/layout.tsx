import { Footer } from "@repo/ui/components/Generic"
import { NuqsProvider, QueryProvider, UIProvider } from "@repo/ui/components/Provider"
import { ColorModeScript } from "@yamada-ui/react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "UABC | Home",
  description:
    "Welcome to the homepage of UABC, New Zealand's largest student badminton club. We run weekly badminton sessions and fun social events to connect like-minded badminton people! Join our sessions or check our Instagram page for events!",
  openGraph: {
    title: "UABC | Home",
    description:
      "Welcome to the homepage of UABC, New Zealand's largest student badminton club. We run weekly badminton sessions and fun social events to connect like-minded badminton people! Join our sessions or check our Instagram page for events!",
    url: "https://uabc.wddc.co.nz",
    siteName: "UABC",
    images: [
      {
        url: "/favicon.ico",
        width: 32,
        height: 32,
        alt: "UABC logo",
      },
    ],
    locale: "en_NZ",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <QueryProvider>
          <NuqsProvider>
            <ColorModeScript initialColorMode="dark" />
            <UIProvider>
              {children}
              <Footer />
            </UIProvider>
          </NuqsProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
