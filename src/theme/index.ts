import type { UsageTheme } from '@yamada-ui/react'
import { semantics } from './semantics'
import { tokens } from './tokens'

export const defaultTheme: UsageTheme = {
  semantics,
  ...tokens,
}
