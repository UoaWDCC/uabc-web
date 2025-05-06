import type { CartGameSession } from "@/types/game-session"
import { Box, Card, CardHeader, Text, VStack } from "@yamada-ui/react"
import { LevelSelector } from "./LevelSelector"
interface ExpandedSessionCardProps {
  gameSession: CartGameSession
}

export const ExpandedSessionCard = ({ gameSession }: ExpandedSessionCardProps) => (
  <Card fontSize="sm" rounded="md" shadow="none">
    <CardHeader backgroundColor="primary" paddingX={6} paddingY="md" roundedTop="md" shadow="lg">
      <VStack gap="none">
        <Text color="white" fontSize="lg" fontWeight="medium">
          {gameSession.weekday}
        </Text>
        <Text color="whiteAlpha.700" fontWeight="medium">
          {gameSession.locationName}
        </Text>
      </VStack>
    </CardHeader>
    <Box backgroundColor="gray.50" padding={6}>
      <Text color="tertiary" fontWeight="semibold">
        Address
      </Text>
      <Text color="tertiary.300">{gameSession.locationAddress}</Text>
      <br />
      <Text color="tertiary" fontWeight="semibold">
        Time
      </Text>
      <Text casing="uppercase" color="tertiary.300">
        {gameSession.startTime} - {gameSession.endTime}
      </Text>
    </Box>
    <LevelSelector id={gameSession.id} selectedLevel={gameSession.playLevel} />
  </Card>
)
