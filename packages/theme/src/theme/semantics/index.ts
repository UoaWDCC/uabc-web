import type { ThemeSemantics } from "@yamada-ui/core"
import { colorSchemes } from "./color-schemes"
import { colors } from "./colors"

export const semantics: ThemeSemantics = {
  colors,
  ...colorSchemes,
}

export { SEMANTIC_COLOR_SCHEMES } from "./color-schemes"
