'use client'
import { extendConfig, extendTheme, UIProvider } from '@yamada-ui/react'
import { FC, memo, PropsWithChildren } from 'react'

export const Providers: FC<PropsWithChildren> = memo(({ children }) => {
  const config = extendConfig({
    locale: 'en-US',
  })
  const theme = extendTheme({})()
  return (
    <UIProvider config={config} theme={theme}>
      {children}
    </UIProvider>
  )
})

Providers.displayName = 'Providers'
