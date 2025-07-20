import { NuqsProvider } from "@repo/ui/components/Provider"
import { ColorModeScript, Container } from "@yamada-ui/react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/app/provider"
import { FooterServerSection } from "@/components/server/FooterServerSection"
import { NavigationBarServerSection } from "@/components/server/NavigationBarServerSection"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
  title: {
    template: "%s | UABC",
    default: "UABC",
  },
  description:
    "University of Auckland Badminton Club - Join our community of badminton enthusiasts. Book sessions, join events, and connect with fellow players.",
  keywords: [
    "badminton",
    "university",
    "auckland",
    "sports",
    "club",
    "booking",
    "events",
    "uoa",
    "universityofauckland",
  ],
  authors: [{ name: "2025 WDCC UABC Team" }],
  creator: "2025 WDCC UABC Team",
  publisher: "University of Auckland Badminton Club",
  openGraph: {
    url: process.env.NEXT_PUBLIC_URL,
    siteName: "UABC",
    locale: "en_NZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
        <NuqsProvider>
          <ColorModeScript initialColorMode="dark" />
          <Providers>
            <Container
              bgColor="black"
              bgGradient={{
                base: "repeating-linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 10vw), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 10vw)",
                md: "repeating-linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 8vw), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 8vw)",
                lg: "repeating-linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 6vw), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 6vw)",
                xl: "repeating-linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 5vw), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 5vw)",
                "2xl":
                  "repeating-linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 4vw), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 4vw)",
              }}
              centerContent
              paddingX="lg"
            >
              <NavigationBarServerSection />
              {children}
            </Container>
            <FooterServerSection />
          </Providers>
        </NuqsProvider>
      </body>
    </html>
  )
}
