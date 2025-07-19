"use client"
import { IconWithText } from "@repo/ui/components/Primitive"
import { Clock10Icon, MapPinIcon, UserIcon } from "@yamada-ui/lucide"
import {
  CheckboxCardGroup,
  type CheckboxCardGroupProps,
  type CheckboxCardProps,
  FormControl,
  type FormControlProps,
  HStack,
  VStack,
} from "@yamada-ui/react"
import { forwardRef, memo } from "react"
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"

/**
 * Props for the {@link BookingTimesCardGroup} component.
 */

interface BookingTimeItem extends CheckboxCardProps {
  memberAttendees?: string
  casualAttendees?: string
}

export interface BookingTimesCardGroupProps extends Omit<CheckboxCardGroupProps, "items"> {
  /**
   * An array of {@link CheckboxCardProps} objects representing the booking times.
   */
  items: BookingTimeItem[]
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
   * Field name for React Hook Form Controller integration.
   *
   * @remarks
   * This is the name of the field in the form data.
   */
  name: string
  /**
   * React Hook Form control object for Controller integration.
   *
   * @remarks
   * This should be the `control` object returned by `useForm`.
   */
  // biome-ignore lint/suspicious/noExplicitAny: It could be any control
  control: Control<any>
}

/**
 * `BookingTimesCardGroup` displays a group of booking time options as selectable cards,
 * with built-in support for React Hook Form validation and error display.
 *
 * @example
 * // With React Hook Form
 * <BookingTimesCardGroup
 *   items={[
 *     {
 *       label: "Tuesday, 12th May",
 *       memberAttendees: "32/35",
 *       casualAttendees: "4/5",
 *       value: "booking-123",
 *       addon: "UoA Hiwa Center",
 *       description: "7:30 - 10pm"
 *     },
 *     {
 *       label: "Wednesday, 13th May",
 *       memberAttendees: "32/35",
 *       casualAttendees: "4/5",
 *       value: "booking-456",
 *       addon: "UoA Hiwa Center",
 *       description: "2:00 - 4:30pm",
 *       disabled: true
 *     }
 *   ]}
 *   name="bookingTimes"
 *   control={control}
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
                  addon: (
                    <VStack alignItems="flex-start" gap="2xs">
                      <IconWithText icon={<MapPinIcon />} label={item.addon} />
                      <HStack flexWrap="wrap" gap="2xs" width="fit-content">
                        <IconWithText
                          icon={<UserIcon />}
                          label={item.memberAttendees + " members Attendees"}
                        />
                        <IconWithText
                          icon={<UserIcon />}
                          label={item.casualAttendees + " casuals Attendees"}
                        />
                      </HStack>
                    </VStack>
                  ),
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
