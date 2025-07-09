import { Clock10Icon, MapPinIcon } from "@yamada-ui/lucide"
import {
  CheckboxCardGroup,
  type CheckboxCardGroupProps,
  type CheckboxCardProps,
  FormControl,
} from "@yamada-ui/react"
import { IconWithText } from "../../Primitive"

/**
 * Props for the {@link BookingTimesCardGroup} component.
 */
export interface BookingTimesCardGroupProps extends Omit<CheckboxCardGroupProps, "items"> {
  /**
   * An array of {@link BookingTimesCardProps} objects representing the booking times.
   */
  items: CheckboxCardProps[]
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
 *       addon: "UoA Hiwa Center",
 *       description: "7:30 - 10pm"
 *     },
 *     {
 *       label: "Wednesday, 13th May",
 *       value: "booking-456",
 *       addon: "UoA Hiwa Center",
 *       description: "2:00 - 4:30pm",
 *       disabled: true
 *     }
 *   ]}
 * />
 */
export const BookingTimesCardGroup = ({ items, ...props }: BookingTimesCardGroupProps) => {
  return (
    <FormControl>
      <CheckboxCardGroup
        {...props}
        items={items.map((item) => {
          return {
            ...item,
            addon: <IconWithText icon={<MapPinIcon />} label={item.label} />,
            description: <IconWithText icon={<Clock10Icon />} label={item.description} />,
          }
        })}
      />
    </FormControl>
  )
}

BookingTimesCardGroup.displayName = "BookingTimesCardGroup"
