import {
  CheckboxCard,
  CheckboxCardDescription,
  CheckboxCardLabel,
  Text,
  VStack,
} from "@yamada-ui/react"
import { memo } from "react"
import type { CartGameSession } from "@/types/game-session"

interface SelectSessionCardProps {
  session: CartGameSession
  checked: boolean
  handleSessionClick: (id: number) => void
}

function UnmemoizedSelectSessionCard({
  session,
  checked,
  handleSessionClick,
}: SelectSessionCardProps) {
  const { weekday, startTime, endTime, locationName } = session
  const status = session.isFull ? "disabled" : checked ? "selected" : "default"
  const isDisabled = status === "disabled"
  return (
    <CheckboxCard
      checked={checked}
      data-testid="session-card"
      disabled={session.isFull}
      onChange={() => handleSessionClick(session.id)}
      variant="subtle"
    >
      <CheckboxCardLabel>
        {weekday} {isDisabled && "(Session Full)"}
      </CheckboxCardLabel>
      <CheckboxCardDescription>
        <VStack gap={1}>
          <Text>{locationName}</Text>
          <Text textTransform="uppercase">
            {startTime} - {endTime}
          </Text>
        </VStack>
      </CheckboxCardDescription>
    </CheckboxCard>
  )
}

export const SelectSessionCard = memo(UnmemoizedSelectSessionCard)
