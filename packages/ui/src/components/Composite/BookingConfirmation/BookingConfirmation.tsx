"use client"

import type { MembershipType } from "@repo/shared"
import { ShuttleIcon } from "@repo/ui/components/Icon"
import { Button, Heading, IconWithText } from "@repo/ui/components/Primitive"
import { ArrowLeftIcon, ClockIcon, MapPinIcon, UsersIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  IconButton,
  Text,
  VStack,
} from "@yamada-ui/react"
import { memo, useCallback } from "react"

export interface BookingConfirmationData {
  date: string
  time: string
  location: string
  attendees: string
  sessionsLeft: number
}

/**
 * The props for the BookingConfirmation component.
 */
export interface BookingConfirmationProps {
  /**
   * The booking confirmation data to display. Can be a single booking or an array of bookings.
   */
  bookingData: BookingConfirmationData | BookingConfirmationData[]
  /**
   * The membership type of the user.
   */
  membershipType?: MembershipType
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
 *   bookingData={{
 *     date: "Tuesday 24/06/25",
 *     time: "7:30 PM - 10:00 PM",
 *     location: "UoA Rec Centre, 17 Symonds Street",
 *     attendees: "39/40",
 *     sessionsLeft: 6
 *   }}
 *   onBack={() => console.log("Back clicked")}
 *   onConfirm={() => console.log("Confirm clicked")}
 * />
 */
export const BookingConfirmation = memo<BookingConfirmationProps>(
  ({ bookingData, onBack, onConfirm, title = "Booking Confirmation" }) => {
    const handleConfirm = useCallback(() => {
      onConfirm?.()
    }, [onConfirm])

    const bookings = Array.isArray(bookingData) ? bookingData : [bookingData]

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
        position="relative"
        px={{ base: "md", md: "xl" }}
        py="lg"
        rounded="3xl"
      >
        <IconButton
          aria-label="Back"
          icon={<ArrowLeftIcon />}
          left="md"
          onClick={onBack}
          position="absolute"
          top="md"
          variant="ghost"
        />
        <CardHeader pt="lg" w="full">
          <Heading.h2
            color={{ base: "primary", md: "white" }}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight={{ base: "semibold", md: "medium" }}
            textAlign="center"
          >
            {title}
          </Heading.h2>
        </CardHeader>

        <CardBody w="full">
          <VStack gap="lg" w="full">
            {bookings.map((booking, index) => (
              <VStack gap="md" key={`${booking.date}-${booking.time}-${index}`} w="full">
                {bookings.length > 1 && (
                  <Text color="primary" fontSize="lg" fontWeight="medium">
                    Booking {index + 1}
                  </Text>
                )}
                <Text fontSize="lg" fontWeight="medium">
                  {booking.date}
                </Text>

                <VStack gap="sm" w="full">
                  <IconWithText icon={<ClockIcon />} label={booking.time} />
                  <IconWithText icon={<MapPinIcon />} label={booking.location} />
                  <IconWithText icon={<UsersIcon />} label={`${booking.attendees} attendees`} />
                  <IconWithText
                    icon={<ShuttleIcon />}
                    label={`Sessions Left After Booking: ${booking.sessionsLeft}`}
                  />
                </VStack>
              </VStack>
            ))}
          </VStack>
        </CardBody>

        <CardFooter pb="lg">
          <Center w="full">
            <Button colorScheme="primary" onClick={handleConfirm} size="lg">
              Confirm {bookings.length > 1 ? `${bookings.length} Bookings` : "Booking"}
            </Button>
          </Center>
        </CardFooter>
      </Card>
    )
  },
)

BookingConfirmation.displayName = "BookingConfirmation"
