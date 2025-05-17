import type { ThemeSemantics } from "@yamada-ui/core"

export const colorSchemes: ThemeSemantics["colorSchemes"] = {
  primary: "blue",
  secondary: "secondary",
  success: "green",
  warning: "orange",
  danger: "red",
}

export const SEMANTIC_COLOR_SCHEMES = Object.keys(colorSchemes)
