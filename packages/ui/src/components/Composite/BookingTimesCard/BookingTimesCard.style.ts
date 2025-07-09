import type { CSSUIObject } from "@yamada-ui/react"

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
