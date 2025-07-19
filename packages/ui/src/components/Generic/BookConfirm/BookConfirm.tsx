import { ShuttleIcon } from "@repo/ui/components/Icon"
import { Button, IconWithText } from "@repo/ui/components/Primitive"
import { For, List, ListItem, Spacer, Text, VStack } from "@yamada-ui/react"
import { BookingDetails, type BookingDetailsProps } from "./BookingDetails"

/**
 * Props for the {@link BookConfirm} component.
 */
export interface BookConfirmProps {
  /**
   * The details of each booking.
   */
  bookings: BookingDetailsProps[]
  /**
   * The total number of sessions the user can book, if a member.
   * If a casual member, this will be undefined.
   */
  sessionCount?: number
  /**
   * Callback function to call when the user confirms the booking.
   */
  onConfirm: () => void
  /**
   * Whether the booking is for a casual member.
   * If true, the user will be prompted to bank transfer.
   */
  casual?: boolean
}

/**
 * A component that displays booking details and a confirmation button.
 *
 * @param bookings The details of each booking the user is making.
 * @param sessionCount The total number of sessions the user can book.
 * @param sessionsBooked The number of sessions the user is booking.
 * @param onConfirm Callback function to call when the user confirms the booking.
 * @param casual Whether the booking is for a casual member.
 * @returns A component that displays booking details and a confirmation button.
 * @example
 * <BookConfirm
 *  bookings={[{
 *   day: Weekday.tuesday,
 *   date: "24/06/25",
 *   startTime: "19:30",
 *   endTime: "20:00",
 *   name: "UoA Rec Centre",
 *   location: "17 Symonds Street",
 *   currentAttendees: 30,
 *   capacity: 40,
 *  }]}
 *  sessionCount={10}
 *  onConfirm={submitBooking}
 * />
 * @example
 * <BookConfirm
 *  bookings={bookings}
 *  onConfirm={submitBooking}
 *  casual
 * />
 */
export const BookConfirm = ({
  bookings,
  sessionCount = 0,
  onConfirm,
  casual = false,
}: BookConfirmProps) => {
  return (
    <VStack align="center" flex={1} gap="xl" maxW="md" textAlign="center">
      <List gap="lg" w="full">
        <For each={bookings}>
          {(booking) => {
            return (
              <ListItem key={`${booking.name}-${booking.day}-${booking.startTime}`}>
                <BookingDetails {...booking} />
              </ListItem>
            )
          }}
        </For>
      </List>
      <Spacer />
      {casual ? (
        <VStack align="center" gap="md" w="full">
          <Text>
            Please bank transfer to XXXXXXXXXXXX with your full name as reference. You will not be
            able to play on the day without bank transferring.
          </Text>
          <Text>Casual members can only book one session a week!</Text>
        </VStack>
      ) : (
        <IconWithText
          icon={<ShuttleIcon />}
          label={`Sessions Left After Booking: ${sessionCount - bookings.length}`}
        />
      )}
      <Button colorScheme="primary" onClick={onConfirm} size={{ base: "md", md: "lg" }}>
        Confirm Booking
      </Button>
    </VStack>
  )
}
