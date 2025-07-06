import type { CardProps, CSSUIObject } from "@yamada-ui/react"
import { BookingTimesCardTypes } from "./BookingTimesCard"

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
  [BookingTimesCardTypes.default]: {
    bg: ["secondary.50", "secondary.900"],
    borderWidth: "1px",
  },
  [BookingTimesCardTypes.selected]: {
    bg: ["primary.50", "secondary.950"],
    borderColor: "secondary.200",
    borderWidth: "3px",
  },
  [BookingTimesCardTypes.full]: {
    bg: ["gray.100", "gray.800"],
  },
}

export const BOOKING_TIMES_CARD_TYPES = Object.keys(BookingTimesCardTypes)
