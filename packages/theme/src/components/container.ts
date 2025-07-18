import type { ComponentStyle } from "@yamada-ui/core"

export const Container: ComponentStyle<"Container"> = {
  baseStyle: {
    display: "flex",
    flexDirection: "column",
    gap: { base: "sm", sm: "md", md: "lg", lg: "xl" },
    p: { base: "sm", sm: "md", md: "lg", lg: "xl" },
    w: "100%",
  },
}
