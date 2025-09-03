import { type ComponentStyle, mergeStyle } from "@yamada-ui/core"

import { Button } from "./button"

export const IconButton: ComponentStyle<"IconButton"> = mergeStyle(Button, {
  baseStyle: {
    aspectRatio: "1",
  },
  sizes: {
    "2xs": {
      minW: "1.5rem",
      h: "1.5rem",
      rounded: "xl",
    },
    xs: {
      minW: "2rem",
      h: "2rem",
      rounded: "xl",
    },
    sm: {
      minW: "2.5rem",
      h: "2.5rem",
      rounded: "xl",
    },
    md: {
      minW: "3rem",
      h: "3rem",
      rounded: "xl",
    },
    lg: {
      minW: "3.5rem",
      h: "3.5rem",
      rounded: "xl",
    },
    xl: {
      minW: "4rem",
      h: "4rem",
      rounded: "xl",
    },
  },
})({ omit: ["sizes"] })
