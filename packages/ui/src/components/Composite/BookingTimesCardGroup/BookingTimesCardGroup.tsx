import { CheckboxCardGroup, type CheckboxCardGroupProps, FormControl } from "@yamada-ui/react"
import { BookingTimesCard, type BookingTimesCardProps } from "../../Generic/BookingTimesCard"

/**
 * Props for the {@link BookingTimesCardGroup} component.
 */
export interface BookingTimesCardGroupProps extends CheckboxCardGroupProps {
  /**
   * An array of {@link BookingTimesCardProps} objects representing the booking times.
   */
  items: BookingTimesCardProps[]
}

/**
 * BookingTimesCardGroup is a component that displays a group of BookingTimesCard components.
 * It wraps multiple booking time options in a checkbox card group for selection.
 *
 * @example
 * <BookingTimesCardGroup
 *   items={[
 *     {
 *       label: "Tuesday, 12th May",
 *       value: "booking-123",
 *       location: "UoA Hiwa Center",
 *       bookingTime: "7:30 - 10pm"
 *     },
 *     {
 *       label: "Wednesday, 13th May",
 *       value: "booking-456",
 *       location: "UoA Hiwa Center",
 *       bookingTime: "2:00 - 4:30pm",
 *       full: true
 *     }
 *   ]}
 * />
 */
export const BookingTimesCardGroup = ({ items, ...props }: BookingTimesCardGroupProps) => {
  return (
    <FormControl>
      <CheckboxCardGroup {...props}>
        {items.map(({ full, value, label, bookingTime, location, ...props }) => {
          return (
            <BookingTimesCard
              bookingTime={bookingTime}
              full={full}
              key={value}
              label={label}
              location={location}
              value={value}
              {...props}
            />
          )
        })}
      </CheckboxCardGroup>
    </FormControl>
  )
}
BookingTimesCardGroup.displayName = "BookingTimesCardGroup"
