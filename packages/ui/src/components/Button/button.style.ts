import type { HTMLUIProps } from "@yamada-ui/react"

export const styles: Record<string, HTMLUIProps<"button">> = {
  base: {
    fontSize: {
      base: "1rem",
      sm: "1.125rem",
    },
    height: {
      base: "3rem",
      sm: "3.625rem",
    },
    padding: {
      base: "1rem",
      sm: "0.375rem 1.25rem",
    },
  },
  xs: {
    fontSize: "xs",
    h: 6,
    lineHeight: "$sizes.6",
    minW: 6,
    px: 2,
    rounded: "sm",
  },
  sm: {
    fontSize: "sm",
    lineHeight: "$sizes.8",
    h: 8,
    minW: 24,
    px: 7.5,
    py: 2,
    rounded: "xl",
  },
  md: {
    fontSize: "sm",
    lineHeight: "$sizes.10",
    h: 10,
    minW: "10.4375rem",
    px: 7.5,
    py: 4,
    rounded: "xl",
  },
  lg: {
    fontSize: "lg",
    lineHeight: "$sizes.12",
    h: 12,
    minW: "13.75rem",
    px: 5,
    py: 3.5,
    rounded: "xl",
  },
  xl: {
    fontSize: "lg",
    lineHeight: "$sizes.14",
    h: 14,
    minW: "23.125rem",
    px: 5,
    py: 3.5,
    rounded: "xl",
  },
  "2xl": {
    fontSize: "xl",
    lineHeight: "$sizes.16",
    h: 16,
    minW: 16,
    px: 10,
    py: 3.5,
    rounded: "lg",
  },
}
