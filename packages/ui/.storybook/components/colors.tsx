import { Box, HStack, isArray, Text, useColorMode, VStack } from "@yamada-ui/react"
import type { FC } from "react"

interface ColorPalletsProps {
  name: string
  colors: Record<string, string>
}

export const ColorPallets: FC<ColorPalletsProps> = ({ name, colors }) => {
  return Object.entries(colors[name] ?? {}).map(([tone, value]) => (
    <ColorPallet key={tone} {...{ name, tone, value }} />
  ))
}

interface ColorPalletProps {
  name: string
  value: string
  tone?: string
}

export const ColorPallet: FC<ColorPalletProps> = ({ name, tone, value }) => {
  const { colorMode } = useColorMode()

  return (
    <HStack key={tone}>
      <Box
        bg={tone ? `${name}.${tone}` : name}
        boxShadow="inner"
        minH="12"
        minW="12"
        rounded="md"
      />
      <VStack gap="1">
        <Text fontWeight="semibold" lineClamp={1} m="0">
          {name.charAt(0).toUpperCase() + name.slice(1)} {tone}
        </Text>
        <Text lineClamp={1} m="0">
          {!isArray(value) ? value : colorMode === "light" ? value[0] : value[1]}
        </Text>
      </VStack>
    </HStack>
  )
}
