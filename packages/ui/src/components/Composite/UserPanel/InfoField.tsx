import { Text, VStack } from "@yamada-ui/react"
import { type FC, memo } from "react"

export interface InfoFieldProps {
  label: string
  value: string
}

export const InfoField: FC<InfoFieldProps> = memo(({ label, value }) => (
  <VStack
    border="2px solid"
    borderColor={["blackAlpha.200", "whiteAlpha.300"]}
    gap="xs"
    minW="sm"
    px="md"
    py="sm"
    rounded="lg"
  >
    <Text color="muted" fontSize="sm">
      {label}
    </Text>
    <Text>{value}</Text>
  </VStack>
))

InfoField.displayName = "InfoField"
