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
import { Heading } from "../../Primitive"

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

export const BookingTimesCard = ({
  label,
  value,
  location,
  bookingTime,
  full = false,
  ...props
}: BookingTimesCardProps) => {
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
}
