import { type ThemeConfig, type UsageTheme, extendConfig, extendTheme } from "@yamada-ui/react"
import { components } from "./components"
import { breakpoint } from "./config"
import { semantics } from "./semantics"
import { tokens } from "./tokens"

export const defaultConfig: ThemeConfig = { breakpoint }

export const config = extendConfig(defaultConfig)

export const defaultTheme: UsageTheme = {
  semantics,
  components,
  ...tokens,
}

export const theme = extendTheme(defaultTheme)()
