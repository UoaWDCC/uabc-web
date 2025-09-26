import type { ThemeConfig, UsageTheme } from "@yamada-ui/core"
import { extendBaseTheme, extendConfig } from "@yamada-ui/theme-tools"
import { components } from "./components"
import { breakpoint, initialColorMode, noticeOptions } from "./config"
import { semantics } from "./semantics"
import { styles } from "./styles"
import { tokens } from "./tokens"

export const defaultConfig: ThemeConfig = {
  breakpoint,
  initialColorMode,
  notice: { options: noticeOptions },
}

export const config = extendConfig(defaultConfig)

export const defaultTheme: UsageTheme = {
  semantics,
  components,
  styles,
  ...tokens,
}

export const theme = extendBaseTheme(defaultTheme)()

export { components, semantics, tokens, noticeOptions }
