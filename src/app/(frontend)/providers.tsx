'use client'
import { defaultTheme } from '@/theme'
import { extendConfig, extendTheme, UIProvider } from '@yamada-ui/react'
import { FC, memo, PropsWithChildren } from 'react'

export const Providers: FC<PropsWithChildren> = memo(({ children }) => {
  const config = extendConfig({ breakpoint: { direction: 'up' } })
  const theme = extendTheme(defaultTheme)()
  return (
    <UIProvider config={config} theme={theme}>
      {children}
    </UIProvider>
  )
})

Providers.displayName = 'Providers'
