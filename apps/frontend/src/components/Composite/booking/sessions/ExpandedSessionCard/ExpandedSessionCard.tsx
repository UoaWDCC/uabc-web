import type { CartGameSession } from "@/types/game-session"
import { Card, CardBody, CardHeader, Text, VStack } from "@yamada-ui/react"
import { LevelSelector } from "./LevelSelector"
interface ExpandedSessionCardProps {
  gameSession: CartGameSession
}

export const ExpandedSessionCard = ({ gameSession }: ExpandedSessionCardProps) => (
  <Card fontSize="sm" rounded="md" shadow="none">
    <CardHeader backgroundColor="primary" paddingX={6} paddingY="md" roundedTop="md" shadow="lg">
      <VStack gap="0">
        <Text color="white" fontSize="lg" fontWeight="medium">
          {gameSession.weekday}
        </Text>
        <Text color="whiteAlpha.800" fontWeight="medium">
          {gameSession.locationName}
        </Text>
      </VStack>
    </CardHeader>
    <CardBody backgroundColor="gray.50" gap="sm">
      <VStack gap="xs">
        <Text color="tertiary" fontWeight="semibold">
          Address
        </Text>
        <Text color="tertiary.400">{gameSession.locationAddress}</Text>
      </VStack>
      <VStack gap="xs">
        <Text color="tertiary" fontWeight="semibold">
          Time
        </Text>
        <Text casing="uppercase" color="tertiary.400">
          {gameSession.startTime} - {gameSession.endTime}
        </Text>
      </VStack>
    </CardBody>
    <LevelSelector id={gameSession.id} selectedLevel={gameSession.playLevel} />
  </Card>
)
