import type { ComponentStyle } from "@yamada-ui/core"

export const Container: ComponentStyle<"Container"> = {
  baseStyle: {
    display: "flex",
    flexDirection: "column",
    gap: { base: "lg", sm: "md" },
    p: { base: "md", sm: "lg", lg: "2xl" },
    w: "100%",
  },
}
