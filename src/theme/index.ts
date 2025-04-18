import { type ThemeConfig, type UsageTheme, extendConfig, extendTheme } from '@yamada-ui/react'
import { breakpoint } from './config'
import { semantics } from './semantics'
import { tokens } from './tokens'

export const defaultConfig: ThemeConfig = { breakpoint }

export const config = extendConfig(defaultConfig)

export const defaultTheme: UsageTheme = {
  semantics,
  ...tokens,
}

export const theme = extendTheme(defaultTheme)()
