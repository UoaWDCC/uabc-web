import { Box } from "@yamada-ui/react"

export const GridBackground = () => {
  return (
    <Box inset={0} layerStyle="grid" minH="100dvh" position="fixed" top="0" w="full" zIndex={-1} />
  )
}
