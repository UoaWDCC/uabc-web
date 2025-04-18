import type { ThemeSemantics } from '@yamada-ui/react'
import { colors } from './colors'
import { colorSchemes } from './color-schemes'

export const semantics: ThemeSemantics = {
  colors,
  ...colorSchemes,
}

export { SEMANTIC_COLOR_SCHEMES } from './color-schemes'
