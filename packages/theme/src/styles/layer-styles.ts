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
  fadeFromMiddle: {
    position: "relative",
    _before: {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      border: "1px solid transparent",
      bg: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(170, 170, 170, 1) 50%, rgba(255, 255, 255, 0.00) 100%) border-box",
      pointerEvents: "none",
    },
  },
  fadeLeft: {
    position: "relative",
    _before: {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      border: "1px solid transparent",
      bg: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(150, 150, 150, 1) 100%) border-box",
      pointerEvents: "none",
    },
  },
  fadeRight: {
    position: "relative",
    _before: {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      border: "1px solid transparent",
      bg: "linear-gradient(-90deg, rgba(255, 255, 255, 0.00) 0%, rgba(150, 150, 150, 1) 100%) border-box",
      pointerEvents: "none",
    },
  },
}
