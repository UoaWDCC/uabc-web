import { HStack, Separator, Text } from "@yamada-ui/react"

export const BreakLine = ({ label }: { label: string }) => {
  return (
    <HStack>
      <Separator />
      <Text color="tertiary" fontSize="xs">
        {label}
      </Text>
      <Separator />
    </HStack>
  )
}
