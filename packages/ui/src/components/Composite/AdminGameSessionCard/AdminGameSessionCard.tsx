"use client"

import type { AdminGameSession } from "@repo/shared"
import { capitalize, formatTime } from "@repo/shared"
import { Button, Heading, IconWithText } from "@repo/ui/components/Primitive"
import { getStatusColor } from "@repo/ui/utils"
import { ClockIcon, MapPinIcon, UsersRoundIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  type CardProps,
  HStack,
  Spacer,
  Tag,
  VStack,
} from "@yamada-ui/react"
import { memo } from "react"

export interface AdminGameSessionCardProps extends Omit<CardProps, "children"> {
  /**
   * The admin game session data to display.
   */
  gameSession: AdminGameSession
  /**
   * Callback function when export button is clicked.
   */
  onExport?: () => void
}

/**
 * AdminGameSessionCard component for displaying game session information in an admin interface.
 *
 * @param gameSession The admin game session data to display.
 * @param onExport Callback function when export button is clicked.
 * @returns A card component displaying game session information for admin use.
 * @example
 * <AdminGameSessionCard
 *   gameSession={{
 *     id: "session-123",
 *     day: "Tuesday",
 *     status: "ongoing",
 *     startTime: "2025-01-21T19:30:00Z",
 *     endTime: "2025-01-21T22:00:00Z",
 *     name: "UoA Rec Centre",
 *     location: "17 Symonds Street",
 *     attendees: 39,
 *     capacity: 40,
 *     casualAttendees: 5,
 *     casualCapacity: 10
 *   }}
 *   onExport={() => handleExport()}
 * />
 */
export const AdminGameSessionCard = memo(
  ({ gameSession, onExport, ...cardProps }: AdminGameSessionCardProps) => {
    const { day, status, startTime, endTime, name, location, attendees, capacity } = gameSession

    const colorScheme = getStatusColor(status)

    const displayDay = capitalize(day)

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
        <CardHeader>
          <HStack w="full">
            <Heading.h3 fontSize="xl" fontWeight="semibold">
              {displayDay}
            </Heading.h3>
            <Spacer />
            <Tag
              colorScheme={colorScheme}
              fontSize="sm"
              fontWeight="medium"
              rounded="full"
              variant="outline"
            >
              {status}
            </Tag>
          </HStack>
        </CardHeader>
        <CardBody gap="md">
          <VStack align="flex-start" gap="sm">
            <IconWithText
              icon={<ClockIcon fontSize="lg" />}
              label={`${formatTime(startTime)} - ${formatTime(endTime)}`}
            />
            <VStack align="flex-start" gap="xs">
              {name && <IconWithText icon={<MapPinIcon fontSize="lg" />} label={name} />}
              {location && <IconWithText icon={<MapPinIcon fontSize="lg" />} label={location} />}
            </VStack>
            <IconWithText
              icon={<UsersRoundIcon fontSize="lg" />}
              label={`${attendees}/${capacity} attendees`}
            />
          </VStack>
        </CardBody>
        <CardFooter>
          <Button colorScheme="primary" onClick={onExport} rounded="xl" size="md" w="full">
            Export Member List as CSV
          </Button>
        </CardFooter>
      </Card>
    )
  },
)

AdminGameSessionCard.displayName = "AdminGameSessionCard"
