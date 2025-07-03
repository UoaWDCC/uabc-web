import type { CardProps } from "@yamada-ui/react"

export const styles: Record<"default" | "selected" | "full", CardProps> = {
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
