import { Box, HStack, isArray, Text, useColorMode, VStack } from "@yamada-ui/react"
import type { FC } from "react"

interface GradientPalletProps {
  name: string
  gradient: string
}

export const GradientPallet: FC<GradientPalletProps> = ({ name, gradient }) => {
  const { colorMode } = useColorMode()

  return (
    <HStack key={gradient}>
      <Box bgGradient={gradient} minH="12" minW="12" rounded="md" />
      <VStack gap="1">
        <Text fontWeight="semibold" lineClamp={1} m="0">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Text>
        <Text m="0">
          {!isArray(gradient) ? gradient : colorMode === "light" ? gradient[0] : gradient[1]}
        </Text>
      </VStack>
    </HStack>
  )
}
