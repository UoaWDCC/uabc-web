import type { ThemeConfig, UsageTheme } from '@yamada-ui/react'
import { breakpoint } from './config'
import { semantics } from './semantics'
import { tokens } from './tokens'

export const defaultConfig: ThemeConfig = { breakpoint }

export const defaultTheme: UsageTheme = {
  semantics,
  ...tokens,
}
