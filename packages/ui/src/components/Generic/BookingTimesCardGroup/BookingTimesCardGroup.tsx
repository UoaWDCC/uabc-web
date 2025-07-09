import { Clock10Icon, MapPinIcon } from "@yamada-ui/lucide"
import {
  CheckboxCardGroup,
  type CheckboxCardGroupProps,
  type CheckboxCardProps,
  FormControl,
  type FormControlProps,
} from "@yamada-ui/react"
import { forwardRef, memo } from "react"
import type { FieldPath, FieldValues, UseFormRegisterReturn } from "react-hook-form"
import { IconWithText } from "../../Primitive"

/**
 * Props for the {@link BookingTimesCardGroup} component.
 */
export interface BookingTimesCardGroupProps extends Omit<CheckboxCardGroupProps, "items"> {
  /**
   * An array of {@link CheckboxCardProps} objects representing the booking times.
   */
  items: CheckboxCardProps[]

  /**
   * Indicates whether the input field is in an error state.
   *
   * @remarks
   * When `true`, the input displays an error border and error message.
   * Works seamlessly with React Hook Form validation.
   *
   * @defaultValue `false`
   */
  isError?: boolean

  /**
   * The error message displayed when the input is in an error state.
   *
   * @remarks
   * If not provided, no error message will be shown.
   * Typically used with React Hook Form error messages.
   */
  errorMessage?: string

  /**
   * Additional props for the FormControl wrapper.
   *
   * @remarks
   * Allows customization of the FormControl container.
   */
  formControlProps?: FormControlProps

  /**
   * React Hook Form registration object.
   *
   * @remarks
   * When using with React Hook Form, spread the register() result into this prop.
   * This automatically handles onChange, onBlur, name, and ref.
   *
   * @example
   * <BookingTimesCardGroup {...register("fieldName")} />
   */
  registration?: UseFormRegisterReturn<FieldPath<FieldValues>>
}

/**
 * BookingTimesCardGroup is a component that displays a group of BookingTimesCard components.
 * It wraps multiple booking time options in a checkbox card group for selection with built-in React Hook Form support.
 *
 * @example
 * // Basic usage
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
 *
 * @example
 * // With React Hook Form
 * <BookingTimesCardGroup
 *   items={bookingTimesData}
 *   {...register("bookingTimes")}
 *   isError={!!errors.bookingTimes}
 *   errorMessage={errors.bookingTimes?.message}
 * />
 */
export const BookingTimesCardGroup = memo(
  forwardRef<HTMLDivElement, BookingTimesCardGroupProps>(
    (
      {
        items,
        isError = false,
        errorMessage,
        formControlProps,
        registration,
        ...props
      }: BookingTimesCardGroupProps,
      ref,
    ) => {
      const { onChange: rhfOnChange, ...registrationProps } = registration || {}

      const checkboxGroupProps = {
        ...registrationProps,
        ...props,
        ref,
        onChange: rhfOnChange
          ? (value: string[]) => rhfOnChange({ target: { value } })
          : props.onChange,
      }

      return (
        <FormControl errorMessage={errorMessage} invalid={isError} {...formControlProps}>
          <CheckboxCardGroup
            {...checkboxGroupProps}
            items={items.map((item) => {
              return {
                ...item,
                addon: <IconWithText icon={<MapPinIcon />} label={item.addon} />,
                description: <IconWithText icon={<Clock10Icon />} label={item.description} />,
              }
            })}
          />
        </FormControl>
      )
    },
  ),
)

BookingTimesCardGroup.displayName = "BookingTimesCardGroup"
