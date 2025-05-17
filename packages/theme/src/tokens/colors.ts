import type { ThemeTokens } from "@yamada-ui/core"
import { generate } from "@yamada-ui/theme-tools"

export const colors: ThemeTokens = {
  black: "#0a0a0a",
  white: "#fffff",
  blue: generate.tones("#5872c6"),
  secondary: generate.tones("#1b1b1b"),
}

export const COLORS = ["blue", "secondary"]
