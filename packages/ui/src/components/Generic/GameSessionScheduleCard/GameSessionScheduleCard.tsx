import type { GameSessionSchedule } from "@repo/shared/types"
import { capitalize, formatTime } from "@repo/shared/utils"
import { Card, CardBody, type CardProps, HStack, memo, Text, VStack } from "@yamada-ui/react"

/**
 * Props for the GameSessionScheduleCard component.
 */
export interface GameSessionScheduleCardProps extends Omit<CardProps, "children"> {
  /**
   * The game session schedule data to display.
   */
  gameSessionSchedule: GameSessionSchedule
}

/**
 * GameSessionScheduleCard component for displaying game session summary in admin semesters view.
 *
 * @param gameSessionSchedule The game session schedule data to display.
 * @returns A card component displaying game session information.
 */
export const GameSessionScheduleCard = memo(
  ({ gameSessionSchedule, ...cardProps }: GameSessionScheduleCardProps) => {
    const { name, location, day, startTime, endTime, capacity, casualCapacity } =
      gameSessionSchedule

    return (
      <Card
        bg={["secondary.50", "secondary.900"]}
        color={["black", "white"]}
        layerStyle="gradientBorder"
        rounded="xl"
        variant="solid"
        w="full"
        {...cardProps}
      >
        <CardBody>
          <VStack align="stretch" gap="md">
            <VStack
              align="stretch"
              bg={["secondary.100", "blackAlpha.300"]}
              gap="sm"
              p="sm"
              rounded="lg"
            >
              <HStack justifyContent="space-between">
                <Text color="muted">Session Name</Text>
                <Text fontWeight="bold">{name}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="muted">Time</Text>
                <Text fontWeight="semibold">
                  {capitalize(day)} {formatTime(startTime)} - {formatTime(endTime)}
                </Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="muted">Location</Text>
                <Text fontWeight="semibold">{location}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="muted">Capacities</Text>
                <Text fontWeight="semibold">
                  {capacity} / {casualCapacity}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    )
  },
)
