import { NuqsProvider } from "@repo/ui/components/Provider"
import { ColorModeScript } from "@yamada-ui/react"
import { Providers } from "@/app/providers"
import { FooterServerSection } from "@/components/server/FooterServerSection"
import { NavigationBarServerSection } from "@/components/server/NavigationBarServerSection"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <NuqsProvider>
      <ColorModeScript initialColorMode="dark" />
      <Providers>
        <NavigationBarServerSection />
        {children}
        <FooterServerSection />
      </Providers>
    </NuqsProvider>
  )
}
