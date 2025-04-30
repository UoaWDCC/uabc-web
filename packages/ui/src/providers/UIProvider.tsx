"use client"
import { config, theme } from "@repo/theme"
import { UIProvider as Provider, type UIProviderProps } from "@yamada-ui/react"
import { type FC, memo } from "react"

export const UIProvider: FC<UIProviderProps> = memo(({ children, ...props }) => {
  return (
    <Provider config={config} theme={theme} {...props}>
      {children}
    </Provider>
  )
})

UIProvider.displayName = "UIProvider"
