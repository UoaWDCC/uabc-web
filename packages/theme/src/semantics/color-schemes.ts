import type { ThemeSemantics } from "@yamada-ui/core"

export const colorSchemes: ThemeSemantics["colorSchemes"] = {
  danger: "red",
  info: "blue",
  link: "blue",
  primary: "blue",
  secondary: "secondary",
  success: "green",
  warning: "orange",
}

export const SEMANTIC_COLOR_SCHEMES = Object.keys(colorSchemes)
