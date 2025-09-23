import { pixelBasedPreset, Tailwind } from "@react-email/components"
import { breakpoints } from "@repo/theme/tokens/breakpoints"
import { colors } from "@repo/theme/tokens/colors"
import { fontSizes } from "@repo/theme/tokens/font-sizes"
import { fontWeights } from "@repo/theme/tokens/font-weights"
import { radii } from "@repo/theme/tokens/radii"
import { spaces } from "@repo/theme/tokens/spaces"
import type { ReactNode } from "react"

// biome-ignore lint/suspicious/noExplicitAny: we would need to import Yamada to type this properly, which seems excessive for now
const convertThemeTokensToTailwindNested = (themeTokens: any) => {
  const tailwindTokens: Record<string, string | Record<string, string>> = {}

  Object.entries(themeTokens).forEach(([name, value]) => {
    if (typeof value === "string") {
      tailwindTokens[name] = value
    } else if (typeof value === "object" && value !== null) {
      tailwindTokens[name] = {}
      Object.entries(value).forEach(([subValue, tokenValue]) => {
        if (typeof tokenValue === "string") {
          ;(tailwindTokens[name] as Record<string, string>)[subValue] = tokenValue
        }
      })
    }
  })

  return tailwindTokens
}

// biome-ignore lint/suspicious/noExplicitAny: we would need to import Yamada to type this properly, which seems excessive for now
const convertThemeTokensToTailwindFlat = (themeTokens: any): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(themeTokens)
      .filter(([_, tokenValue]) => typeof tokenValue === "string")
      .map(([tokenName, tokenValue]) => [tokenName, tokenValue as string]),
  )
}

export const TailwindConfig = ({ children }: { children: ReactNode }) => {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset], // ensures padding/margin values are in pixels, not rems for email client compatibility
        theme: {
          extend: {
            colors: convertThemeTokensToTailwindNested(colors),
            spacing: convertThemeTokensToTailwindFlat(spaces),
            fontSize: convertThemeTokensToTailwindFlat(fontSizes),
            fontWeight: convertThemeTokensToTailwindFlat(fontWeights),
            breakpoints: convertThemeTokensToTailwindFlat(breakpoints),
            rounded: convertThemeTokensToTailwindFlat(radii),
          },
        },
      }}
    >
      {children}
    </Tailwind>
  )
}
