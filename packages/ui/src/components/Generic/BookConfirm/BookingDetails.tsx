import type { Weekday } from "@repo/shared"
import { Heading, IconWithText } from "@repo/ui/components/Primitive"
import { ClockIcon, MapPinIcon, UsersRoundIcon } from "@yamada-ui/lucide"
import { Card, CardBody, CardHeader, VStack } from "@yamada-ui/react"

/**
 * Props for the {@link BookingDetails} component.
 */
export interface BookingDetailsProps {
  /**
   * The day of the week for the booking.
   */
  day: Weekday
  /**
   * The date of the booking.
   */
  date?: string
  /**
   * The start time of the booking.
   */
  startTime: string
  /**
   * The end time of the booking.
   */
  endTime: string
  /**
   * The name of the booking location.
   */
  name?: string
  /**
   * The address of the booking.
   */
  location?: string
  /**
   * The number of current attendees for this booking time.
   */
  currentAttendees: number
  /**
   * The total capacity for the location.
   */
  capacity: number
}

/**
 * Component to display booking details such as day, date, time, name, location, and current attendees.
 *
 * @param day The day of the booking.
 * @param date The date of the booking.
 * @param startTime The start time of the booking.
 * @param endTime The end time of the booking.
 * @param name The name of the booking location.
 * @param location The address of the booking.
 * @param currentAttendees The number of current attendees for this booking time.
 * @param capacity The total capacity for the location.
 * @returns A component that displays booking details.
 * @example
 * <BookingDetails
 *  day={Weekday.tuesday}
 *  date="24/06/25"
 *  startTime="19:30"
 *  endTime="20:00"
 *  name="UoA Rec Centre"
 *  location="17 Symonds Street"
 *  currentAttendees={30}
 *  capacity={40}
 * />
 */
export const BookingDetails = ({
  day,
  date,
  startTime,
  endTime,
  name,
  location,
  currentAttendees,
  capacity,
}: BookingDetailsProps) => {
  const formattedNameAndLocation = name && location ? `${name}, ${location}` : name || location

  return (
    <Card
      bgColor="secondary.900"
      borderRadius="2xl"
      gap={{ base: "sm", md: "md" }}
      layerStyle="gradientBorder"
      py="md"
    >
      <CardHeader>
        <Heading.h3
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="medium"
          textAlign="center"
          w="full"
        >
          {day} {date}
        </Heading.h3>
      </CardHeader>
      <CardBody>
        <VStack align="center" gap="md" w="full">
          <IconWithText icon={<ClockIcon fontSize="lg" />} label={`${startTime} - ${endTime}`} />
          {(name || location) && (
            <IconWithText icon={<MapPinIcon fontSize="lg" />} label={formattedNameAndLocation} />
          )}
          <IconWithText
            icon={<UsersRoundIcon fontSize="lg" />}
            label={`${currentAttendees}/${capacity} attendees`}
          />
        </VStack>
      </CardBody>
    </Card>
  )
}
