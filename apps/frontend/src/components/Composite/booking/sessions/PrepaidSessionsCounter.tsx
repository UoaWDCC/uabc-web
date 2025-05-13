import { HStack, Text } from "@yamada-ui/react"
import { CountIndicator } from "../../CountIndicator"

interface PrepaidSessionsCounterProps {
  prepaidSessions: number
}

export function PrepaidSessionsCounter({ prepaidSessions }: PrepaidSessionsCounterProps) {
  return (
    <HStack>
      <Text fontSize="xs" fontWeight="medium">
        Prepaid Sessions <br />
        Remaining
      </Text>
      <CountIndicator>{prepaidSessions}</CountIndicator>
    </HStack>
  )
}
