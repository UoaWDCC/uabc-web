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
