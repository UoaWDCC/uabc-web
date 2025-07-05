import type { CardProps, CSSUIObject } from "@yamada-ui/react"

export const separatorAfterStyles: CSSUIObject = {
  content: "''",
  position: "absolute",
  left: "0",
  right: "0",
  zIndex: 1,
  height: "1px",
  bgGradient: "textGradient",
  borderRadius: "inherit",
  display: "flex",
}

export const styles: Record<string, CardProps> = {
  default: {
    bg: ["secondary.50", "secondary.900"],
    borderWidth: "1px",
  },
  selected: {
    bg: ["primary.50", "secondary.950"],
    borderColor: "secondary.200",
    borderWidth: "3px",
  },
  full: {
    bg: ["gray.100", "gray.800"],
  },
}

export const BOOKING_TIMES_CARD_TYPES = Object.keys(styles)
