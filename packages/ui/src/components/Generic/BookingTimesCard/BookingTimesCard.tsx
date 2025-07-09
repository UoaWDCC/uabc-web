import { Clock10Icon, MapPinIcon } from "@yamada-ui/lucide"
import {
  CheckboxCard,
  CheckboxCardAddon,
  CheckboxCardDescription,
  CheckboxCardLabel,
  type CheckboxCardProps,
  HStack,
  Text,
} from "@yamada-ui/react"
import { memo } from "react"
import { Heading } from "../../Primitive"

/**
 * Props for {@link BookingTimesCard} component
 */
export interface BookingTimesCardProps extends CheckboxCardProps {
  /**
   * The title for the BookingTimesCard
   * @example "Tuesday, 12th May"
   */
  label: string
  /**
   * The value for the BookingTimesCard
   * @example "e7f2ge97g2fu9beu2ge97gfu9i2heb"
   */
  value: string
  /**
   * The location for the booking
   * @example "UoA Hiwa Center"
   */
  location: string
  /**
   * The time for the booking
   * @example "7:30 - 10pm"
   */
  bookingTime: string
  /**
   * Whether the booking is full or not
   */
  full?: boolean
}

/**
 * BookingTimesCard is a component for displaying booking time options.
 * It shows a selectable card with date, time, and location information for a booking slot.
 * When the `full` prop is set to `true`, the card will be disabled to indicate that the booking slot is no longer available.
 *
 * @example
 * // Available booking slot
 * <BookingTimesCard
 *   label="Tuesday, 12th May"
 *   value="booking-123"
 *   location="UoA Hiwa Center"
 *   bookingTime="7:30 - 10pm"
 *   full={false}
 * />
 *
 * @example
 * // Disabled booking slot (full)
 * <BookingTimesCard
 *   label="Wednesday, 13th May"
 *   value="booking-456"
 *   location="UoA Hiwa Center"
 *   bookingTime="2:00 - 4:30pm"
 *   full={true}
 * />
 */
export const BookingTimesCard = memo(
  ({ label, value, location, bookingTime, full = false, ...props }: BookingTimesCardProps) => {
    return (
      <CheckboxCard disabled={full} {...props}>
        <CheckboxCardLabel>
          <Heading.h3 fontSize="lg" fontWeight="semibold" textAlign="left">
            {label}
          </Heading.h3>
        </CheckboxCardLabel>
        <CheckboxCardDescription>
          <HStack gap="xs">
            <Clock10Icon />
            <Text>{bookingTime}</Text>
          </HStack>
        </CheckboxCardDescription>
        <CheckboxCardAddon>
          <HStack gap="xs">
            <MapPinIcon fontSize="md" />
            <Text fontSize="sm">{location}</Text>
          </HStack>
        </CheckboxCardAddon>
      </CheckboxCard>
    )
  },
)

BookingTimesCard.displayName = "BookingTimesCard"
