'use client'
import { config, theme } from '@/theme'
import { UIProvider } from '@yamada-ui/react'
import { FC, memo, PropsWithChildren } from 'react'

export const Providers: FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <UIProvider config={config} theme={theme}>
      {children}
    </UIProvider>
  )
})

Providers.displayName = 'Providers'
