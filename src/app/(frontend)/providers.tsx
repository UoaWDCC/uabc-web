'use client'
import { extendConfig, extendTheme, UIProvider } from '@yamada-ui/react'
import { Inter } from 'next/font/google'
import { FC, memo, PropsWithChildren } from 'react'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const Providers: FC<PropsWithChildren> = memo(({ children }) => {
  const config = extendConfig({
    locale: 'en-US',
  })
  const theme = extendTheme({
    semantics: {
      fonts: {
        body: `${inter.style.fontFamily}, $fonts.body`,
        heading: `${inter.style.fontFamily}, $fonts.heading`,
        mono: `${inter.style.fontFamily}, $fonts.mono`,
      },
      colors: {
        blue: {
          500: 'hsl(215 52% 45%)',
        },
      },
    },
  })()
  return (
    <UIProvider config={config} theme={theme}>
      {children}
    </UIProvider>
  )
})

Providers.displayName = 'Providers'
