import type { ThemeSemantics } from "@yamada-ui/core"

export const colorSchemes: ThemeSemantics["colorSchemes"] = {
  primary: "blue.50",
  secondary: "secondary.16",
  success: "green",
  warning: "orange",
  danger: "red",
}

export const SEMANTIC_COLOR_SCHEMES = Object.keys(colorSchemes)
