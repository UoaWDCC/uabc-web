import { NuqsProvider } from "@repo/ui/components/Provider"
import { Center, ColorModeScript } from "@yamada-ui/react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/app/providers"
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
            <NavigationBarServerSection />
            <Center
              alignItems="center"
              as="main"
              flex="1"
              flexDirection="column"
              maxW="8xl"
              placeSelf="center"
              px="md"
              py="lg"
              w="full"
            >
              {children}
            </Center>
            <FooterServerSection />
          </Providers>
        </NuqsProvider>
      </body>
    </html>
  )
}
