"use client"

import type { GameSessionSchedule } from "@repo/shared/payload-types"
import { getDateTimeStatus } from "@repo/shared/utils"
import { Card, CardBody, type CardProps, HStack, Text, VStack } from "@yamada-ui/react"
import { memo } from "react"

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
    const { name, startTime, endTime } = gameSessionSchedule
    const type = getDateTimeStatus(startTime, endTime)

    const typeColor = (() => {
      const t = type.toLowerCase()
      if (t.includes("ongoing")) return "green.400"
      if (t.includes("upcoming")) return "blue.400"
      if (t.includes("past") || t.includes("completed")) return "gray.400"
      return "muted"
    })()

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
                <Text fontWeight="semibold">{name}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="muted">Time</Text>
                <Text>
                  {startTime} - {endTime}
                </Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="muted">Session Type</Text>
                <Text color={typeColor} fontWeight="semibold">
                  {type}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    )
  },
)

GameSessionScheduleCard.displayName = "GameSessionScheduleCard"
