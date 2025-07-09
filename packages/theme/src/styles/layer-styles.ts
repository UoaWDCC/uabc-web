import type { LayerStyles } from "@yamada-ui/core"

export const layerStyles: LayerStyles = {
  gradientBorder: {
    position: "relative",
    _before: {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      border: "1px solid transparent",
      bg: "linear-gradient(15deg, rgba(255, 255, 255, 0.00) 33%, #FFFFFF 90%) border-box, rgba(255, 255, 255, 0.2) border-box",
      mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
      maskComposite: "exclude",
      mixBlendMode: "overlay",
      pointerEvents: "none",
    },
  },
}
