'use client'
import { defaultTheme } from '@/theme'
import { extendTheme, UIProvider } from '@yamada-ui/react'
import { FC, memo, PropsWithChildren } from 'react'

export const Providers: FC<PropsWithChildren> = memo(({ children }) => {
  const theme = extendTheme(defaultTheme)()
  return <UIProvider theme={theme}>{children}</UIProvider>
})

Providers.displayName = 'Providers'
