'use client'
import { defaultConfig, defaultTheme } from '@/theme'
import { UIProvider, extendConfig, extendTheme } from '@yamada-ui/react'
import { FC, PropsWithChildren, memo } from 'react'

export const Providers: FC<PropsWithChildren> = memo(({ children }) => {
  const config = extendConfig(defaultConfig)
  const theme = extendTheme(defaultTheme)()
  return (
    <UIProvider config={config} theme={theme}>
      {children}
    </UIProvider>
  )
})

Providers.displayName = 'Providers'
