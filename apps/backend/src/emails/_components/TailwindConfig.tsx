import { pixelBasedPreset, Tailwind } from "@react-email/components"
import { breakpoints } from "@repo/theme/tokens/breakpoints"
import { fontSizes } from "@repo/theme/tokens/font-sizes"
import { fontWeights } from "@repo/theme/tokens/font-weights"
import { radii } from "@repo/theme/tokens/radii"
import { spaces } from "@repo/theme/tokens/spaces"
import type { ReactNode } from "react"

export const TailwindConfig = ({ children }: { children: ReactNode }) => {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset], // ensures padding/margin values are in pixels, not rems for email client compatibility
        theme: {
          extend: {
            colors: {
              primary: "#5872C6", // colors.blue[500]
              secondary: "#303030", // colors.gray[800]
              tertiary: "#512DA4", // colors.purple[500]
            },
            spacing: spaces as Record<string, string>,
            fontSize: fontSizes as Record<string, string>,
            fontWeight: fontWeights as Record<string, string>,
            breakpoints: breakpoints as Record<string, string>,
            rounded: radii as Record<string, string>,
          },
        },
      }}
    >
      {children}
    </Tailwind>
  )
}
