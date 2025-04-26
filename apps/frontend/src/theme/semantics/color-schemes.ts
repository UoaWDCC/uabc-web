import type { ThemeSemantics } from "@yamada-ui/react"

export const colorSchemes: ThemeSemantics["colorSchemes"] = {
  danger: "red",
  info: "blue",
  link: "blue",
  primary: "blue",
  secondary: "violet",
  success: "green",
  warning: "orange",
  tertiary: "red",
  destructive: "destructive",
}

export const SEMANTIC_COLOR_SCHEMES = Object.keys(colorSchemes)
