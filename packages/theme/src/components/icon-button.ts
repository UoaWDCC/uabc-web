import { type ComponentStyle, mergeStyle } from "@yamada-ui/core"

import { Button } from "./button"

export const IconButton: ComponentStyle<"IconButton"> = mergeStyle(Button, {
  baseStyle: {
    aspectRatio: "1",
  },
  sizes: {
    xs: {
      minW: "2rem",
      rounded: "xl",
    },
    sm: {
      minW: "2.5rem",
      rounded: "xl",
    },
    md: {
      minW: "3rem",
      rounded: "xl",
    },
    lg: {
      minW: "3.5rem",
      rounded: "xl",
    },
    xl: {
      minW: "4rem",
      rounded: "xl",
    },
  },
})({ omit: ["sizes"] })
