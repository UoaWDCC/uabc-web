import { pixelBasedPreset, Tailwind } from "@react-email/components"
import type { ReactNode } from "react"

export const TailwindConfig = ({ children }: { children: ReactNode }) => {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset], // ensures padding/margin values are in pixels, not rems for email client compatibility
        theme: {
          extend: {
            colors: {
              primary: "#5872C6",
              secondary: "#303030",
              tertiary: "#512DA4",
            },
            fontFamily: {
              sans: [
                "Geist",
                "Geist Fallback",
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Helvetica Neue",
                "游ゴシック体",
                "YuGothic",
                "YuGothic M",
                "Hiragino Kaku Gothic ProN",
                "Meiryo",
                "sans-serif",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
              ], // from fonts.ts in packages/theme
            },
            spacing: {
              0.5: "0.125rem",
              1: "0.25rem",
              1.5: "0.375rem",
              2: "0.5rem",
              2.5: "0.625rem",
              3: "0.75rem",
              3.5: "0.875rem",
              4: "1rem",
              4.5: "1.125rem",
              5: "1.25rem",
              5.5: "1.375rem",
              6: "1.5rem",
              6.5: "1.625rem",
              7: "1.75rem",
              7.5: "1.875rem",
              8: "2rem",
              9: "2.25rem",
              10: "2.5rem",
              11: "2.75rem",
              12: "3rem",
              13: "3.25rem",
              14: "3.5rem",
              15: "3.75rem",
              16: "4rem",
              17: "4.25rem",
              18: "4.5rem",
              20: "5rem",
              24: "6rem",
              28: "7rem",
              32: "8rem",
              36: "9rem",
              40: "10rem",
              44: "11rem",
              48: "12rem",
              52: "13rem",
              56: "14rem",
              60: "15rem",
              64: "16rem",
              68: "17rem",
              72: "18rem",
              76: "19rem",
              80: "20rem",
              84: "21rem",
              88: "22rem",
              92: "23rem",
              96: "24rem",
              px: "1px",
            }, // from spaces.ts in packages/theme
            fontSize: {
              "2xs": "0.625rem",
              xs: "0.75rem",
              sm: "0.875rem",
              md: "1rem",
              lg: "1.125rem",
              xl: "1.25rem",
              "2xl": "1.5rem",
              "3xl": "1.875rem",
              "4xl": "2rem",
              "5xl": "2.25rem",
              "6xl": "3rem",
              "7xl": "3.75rem",
              "8xl": "4.5rem",
              "9xl": "6rem",
            }, // from font-sizes.ts in packages/theme
            fontWeight: {
              hairline: "100",
              thin: "200",
              light: "300",
              normal: "400",
              medium: "500",
              semibold: "600",
              bold: "700",
              extrabold: "800",
              black: "900",
            }, // from font-weights.ts in packages/theme
            breakpoints: {
              sm: "30em",
              md: "48em",
              lg: "61em",
              xl: "80em",
              "2xl": "90em",
            }, // from breakpoints.ts in packages/theme
            rounded: {
              base: "0.25rem",
              sm: "0.125rem",
              md: "0.375rem",
              lg: "0.5rem",
              xl: "0.75rem",
              "2xl": "1rem",
              "3xl": "1.5rem",
              full: "9999px",
              none: "0",
            }, // from radii.ts in packages/theme
          },
        },
      }}
    >
      {children}
    </Tailwind>
  )
}
