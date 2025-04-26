"use client"
import { config, theme } from "@repo/theme"
import { UIProvider } from "@yamada-ui/react"
import { type FC, type PropsWithChildren, memo } from "react"

export const Providers: FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <UIProvider config={config} theme={theme}>
      {children}
    </UIProvider>
  )
})

Providers.displayName = "Providers"
