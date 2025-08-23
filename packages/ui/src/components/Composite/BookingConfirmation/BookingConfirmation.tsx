"use client"

import { MembershipType } from "@repo/shared"
import type { GameSession, User } from "@repo/shared/payload-types"
import { ShuttleIcon, UabcLogo } from "@repo/ui/components/Icon"
import { Button, Heading, IconButton, IconWithText } from "@repo/ui/components/Primitive"
import { useBookingLimits } from "@repo/ui/hooks"
import { ArrowLeftIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  DataList,
  Grid,
  GridItem,
  Text,
  VStack,
} from "@yamada-ui/react"
import { memo, useCallback, useMemo } from "react"

export interface BookingConfirmationData
  extends Pick<
    GameSession,
    "name" | "location" | "startTime" | "endTime" | "capacity" | "casualCapacity"
  > {
  /**
   * The number of attendees for the booking.
   */
  attendees: number
  /**
   * The number of casual attendees for the booking.
   */
  casualAttendees: number
  /**
   * The date of the booking.
   */
  date: string
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
  onConfirm?: (data: BookingConfirmationData[]) => void
  /**
   * The title text displayed in the component.
   */
  title?: string
  /**
   * The user object.
   */
  user: Pick<User, "remainingSessions" | "role">
  /**
   * Whether the confirm button is loading.
   */
  loading?: boolean
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
  ({ bookingData, user, onBack, onConfirm, title = "Booking Confirmation", loading }) => {
    const { sessionsLabel } = useBookingLimits({
      user,
      selectedCount: bookingData.length,
    })

    const [weeklyText, totalText] = useMemo(() => {
      const [weekly, total] = sessionsLabel.split(" • ")
      return [weekly ?? sessionsLabel, total ?? ""]
    }, [sessionsLabel])

    const handleConfirm = useCallback(() => {
      onConfirm?.(bookingData)
    }, [onConfirm, bookingData])

    const bookingItems = useMemo(() => {
      return bookingData.map((booking, index) => {
        const items = [
          {
            term: "Time",
            description: `${booking.startTime} - ${booking.endTime}`,
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
            description:
              user.role === MembershipType.casual
                ? `${booking.casualAttendees} / ${booking.casualCapacity}`
                : `${booking.attendees} / ${booking.capacity}`,
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
    }, [bookingData, user.role])

    return (
      <Card
        alignItems="center"
        backdropBlur="15px"
        backdropFilter="auto"
        bg={["secondary.50", "secondary.800"]}
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        flex={1}
        gap="md"
        justifyContent="center"
        layerStyle="gradientBorder"
        position="relative"
        px={{ base: "md", md: "xl" }}
        py="lg"
        rounded="3xl"
        w="full"
      >
        <CardHeader pt="0" w="full">
          <Grid
            alignItems="center"
            flexDirection={{ base: "column", sm: "row" }}
            gap={{ base: "sm", md: "0" }}
            gridTemplateColumns="1fr auto 1fr"
            justifyContent="space-between"
            w="full"
          >
            <GridItem>
              <IconButton
                aria-label="Back"
                color={["black", "white"]}
                icon={<ArrowLeftIcon />}
                onClick={onBack}
                size={{ base: "md", md: "lg" }}
                variant="ghost"
              />
            </GridItem>

            <GridItem>
              <Heading.h2
                color={{ base: "primary", md: "white" }}
                fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                fontWeight={{ base: "semibold", md: "medium" }}
                order={{ base: 2, sm: 1 }}
                textAlign="center"
              >
                {title}
              </Heading.h2>
            </GridItem>
            <GridItem />
          </Grid>
        </CardHeader>

        <CardBody position="relative" w="full">
          <Center
            alignItems="center"
            display={{ base: "none", md: "flex" }}
            filter="blur(10px) brightness(0.5)"
            inset="0"
            justifyContent="center"
            pointerEvents="none"
            position="absolute"
            userSelect="none"
            zIndex={-1}
          >
            <UabcLogo boxSize={{ base: "sm", xl: "md" }} opacity={0.5} />
          </Center>

          <VStack gap="md" w="full">
            <Center display={{ base: "none", md: "flex" }}>
              <IconWithText icon={<ShuttleIcon />} label={sessionsLabel} />
            </Center>
            <Grid
              display={{ base: "grid", md: "none" }}
              gap="sm"
              gridTemplateColumns="1fr auto 1fr"
              w="full"
            >
              <GridItem as={Center}>
                <ShuttleIcon />
              </GridItem>
              <GridItem>
                <Grid
                  gap="sm"
                  gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  textAlign={{ base: "center", md: "left" }}
                >
                  <GridItem>
                    <Text>{weeklyText}</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{totalText}</Text>
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem />
            </Grid>

            {bookingItems.map(({ booking, items, index }) => (
              <VStack gap="md" key={`${booking.startTime}-${booking.endTime}-${index}`} w="full">
                {bookingData.length > 1 && (
                  <Text color="primary" fontSize="lg" fontWeight="medium">
                    Booking {index + 1}
                  </Text>
                )}
                <Text fontSize="lg" fontWeight="medium">
                  {booking.name}
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
            <Button
              colorScheme="primary"
              isLoading={loading}
              loadingText="Confirming..."
              onClick={handleConfirm}
              size="lg"
            >
              Confirm {bookingData.length > 1 ? `${bookingData.length} Bookings` : "Booking"}
            </Button>
          </Center>
        </CardFooter>
      </Card>
    )
  },
)

BookingConfirmation.displayName = "BookingConfirmation"
