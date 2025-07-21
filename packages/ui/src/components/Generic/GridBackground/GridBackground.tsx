import { Box } from "@yamada-ui/react"

export const GridBackground = () => {
  return (
    <Box
      bottom="0"
      layerStyle="grid"
      left="0"
      minH="100dvh"
      position="fixed"
      right="0"
      top="0"
      zIndex={-1}
    />
  )
}
