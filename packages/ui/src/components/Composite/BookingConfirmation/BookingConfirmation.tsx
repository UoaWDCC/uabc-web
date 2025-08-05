"use client"

import { MAX_CASUAL_BOOKINGS, MAX_MEMBER_BOOKINGS, MembershipType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { ShuttleIcon } from "@repo/ui/components/Icon"
import { Button, Heading, IconWithText } from "@repo/ui/components/Primitive"
import { ArrowLeftIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  DataList,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@yamada-ui/react"
import { memo, useCallback, useMemo } from "react"

export interface BookingConfirmationData {
  date: string
  time: string
  location: string
  attendees: string
}

/**
 * The props for the BookingConfirmation component.
 */
export interface BookingConfirmationProps {
  /**
   * The booking confirmation data to display. Can be a single booking or an array of bookings.
   */
  bookingData: BookingConfirmationData[]
  /**
   * Callback function triggered when the back button is clicked.
   */
  onBack?: () => void
  /**
   * Callback function triggered when the confirm button is clicked.
   */
  onConfirm?: () => void
  /**
   * The title text displayed in the component.
   */
  title?: string
  /**
   * The user object.
   */
  user: Pick<User, "remainingSessions" | "role">
}

/**
 * A component that displays booking confirmation details and allows users to confirm their booking.
 *
 * @param props The props for the component.
 * @returns The booking confirmation component.
 *
 * @example
 * import { BookingConfirmation } from "@repo/ui/components/Composite"
 *
 * <BookingConfirmation
 *   bookingData={[{
 *     date: "Tuesday 24/06/25",
 *     time: "7:30 PM - 10:00 PM",
 *     location: "UoA Rec Centre, 17 Symonds Street",
 *     attendees: "39/40",
 *   }]}
 *   user={{
 *     role: MembershipType.member,
 *     remainingSessions: 6,
 *   }}
 *   onBack={() => console.log("Back clicked")}
 *   onConfirm={() => console.log("Confirm clicked")}
 * />
 */
export const BookingConfirmation = memo<BookingConfirmationProps>(
  ({ bookingData, user, onBack, onConfirm, title = "Booking Confirmation" }) => {
    const maxBookings = useMemo(() => {
      if (user.role === MembershipType.casual) {
        return MAX_CASUAL_BOOKINGS
      }
      return MAX_MEMBER_BOOKINGS
    }, [user.role])

    const sessionsLeft = useMemo(() => {
      return Math.min(maxBookings, user.remainingSessions ?? 0) - bookingData.length
    }, [maxBookings, bookingData.length, user.remainingSessions])

    const handleConfirm = useCallback(() => {
      onConfirm?.()
    }, [onConfirm])

    const bookingItems = useMemo(() => {
      return bookingData.map((booking, index) => {
        const items = [
          {
            term: "Time",
            description: booking.time,
            termProps: { color: "muted", fontSize: "sm" },
            descriptionProps: { fontSize: "md", fontWeight: "medium" },
          },
          {
            term: "Location",
            description: booking.location,
            termProps: { color: "muted", fontSize: "sm" },
            descriptionProps: { fontSize: "md", fontWeight: "medium" },
          },
          {
            term: "Attendees",
            description: `${booking.attendees} attendees`,
            termProps: { color: "muted", fontSize: "sm" },
            descriptionProps: { fontSize: "md", fontWeight: "medium" },
          },
        ]

        return {
          booking,
          items,
          index,
        }
      })
    }, [bookingData])

    return (
      <Card
        alignItems="center"
        backdropBlur="15px"
        backdropFilter="auto"
        bg={["secondary.50", "secondary.800"]}
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap="md"
        justifyContent="center"
        layerStyle="gradientBorder"
        px={{ base: "md", md: "xl" }}
        py="lg"
        rounded="3xl"
        w="full"
      >
        <CardHeader pt="0" w="full">
          <HStack
            alignItems="center"
            display={{ base: "flex", md: "grid" }}
            flexDirection={{ base: "column", sm: "row" }}
            gap={{ base: "sm", md: "0" }}
            gridTemplateColumns={{ md: "1fr auto 1fr" }}
            justifyContent="space-between"
            position="relative"
            w="full"
          >
            <IconButton
              aria-label="Back"
              icon={<ArrowLeftIcon />}
              left={0}
              onClick={onBack}
              position={{ base: "absolute", md: "relative" }}
              size={{ base: "md", md: "lg" }}
              variant="ghost"
              w="fit-content"
            />

            <Heading.h2
              color={{ base: "primary", md: "white" }}
              fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
              fontWeight={{ base: "semibold", md: "medium" }}
              order={{ base: 2, sm: 1 }}
              textAlign="center"
            >
              {title}
            </Heading.h2>

            <IconWithText
              icon={<ShuttleIcon />}
              justifySelf={{ md: "end" }}
              label={`Sessions Left: ${sessionsLeft}`}
              order={{ base: 3, sm: 2 }}
            />
          </HStack>
        </CardHeader>

        <CardBody w="full">
          <VStack gap="lg" w="full">
            {bookingItems.map(({ booking, items, index }) => (
              <VStack gap="md" key={`${booking.date}-${booking.time}-${index}`} w="full">
                {bookingData.length > 1 && (
                  <Text color="primary" fontSize="lg" fontWeight="medium">
                    Booking {index + 1}
                  </Text>
                )}
                <Text fontSize="lg" fontWeight="medium">
                  {booking.date}
                </Text>

                <DataList
                  items={items}
                  orientation="vertical"
                  size="md"
                  variant="subtle"
                  w="full"
                />
              </VStack>
            ))}
          </VStack>
        </CardBody>

        <CardFooter>
          <Center w="full">
            <Button colorScheme="primary" onClick={handleConfirm} size="lg">
              Confirm {bookingData.length > 1 ? `${bookingData.length} Bookings` : "Booking"}
            </Button>
          </Center>
        </CardFooter>
      </Card>
    )
  },
)

BookingConfirmation.displayName = "BookingConfirmation"
