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
  grid: {
    bgGradient: {
      base: "repeating-linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 10vw), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 10vw)",
      md: "repeating-linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 8vw), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 8vw)",
      lg: "repeating-linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 6vw), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 6vw)",
      xl: "repeating-linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 5vw), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 5vw)",
      "2xl":
        "repeating-linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 4vw), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 4vw)",
    },
  },
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: { base: "start", lg: "center" },
    maxW: "8xl",
    placeSelf: "center",
    w: "full",
    flex: 1,
  },
}
