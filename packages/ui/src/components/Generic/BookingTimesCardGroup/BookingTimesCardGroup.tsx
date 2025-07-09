"use client"
import { Clock10Icon, MapPinIcon } from "@yamada-ui/lucide"
import {
  CheckboxCardGroup,
  type CheckboxCardGroupProps,
  type CheckboxCardProps,
  FormControl,
  type FormControlProps,
} from "@yamada-ui/react"
import { forwardRef, memo } from "react"
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"
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
   * Field name for Controller integration.
   */
  name: string
  /**
   * React Hook Form control object for Controller integration.
   */
  control?: Control<any>
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
        control,
        name,
        ...props
      }: BookingTimesCardGroupProps,
      ref,
    ) => {
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState }) => (
            <FormControl
              errorMessage={fieldState.error?.message || errorMessage}
              invalid={!!fieldState.error || isError}
              {...formControlProps}
            >
              <CheckboxCardGroup
                {...props}
                items={items.map((item) => ({
                  ...item,
                  addon: <IconWithText icon={<MapPinIcon />} label={item.addon} />,
                  description: <IconWithText icon={<Clock10Icon />} label={item.description} />,
                }))}
                onChange={field.onChange}
                ref={ref}
                value={field.value}
              />
            </FormControl>
          )}
        />
      )
    },
  ),
)

BookingTimesCardGroup.displayName = "BookingTimesCardGroup"
