import type { ThemeConfig, UsageTheme } from "@yamada-ui/core"
import { extendConfig, extendTheme } from "@yamada-ui/theme-tools"
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

export { components, semantics, tokens }
