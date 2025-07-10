"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlayLevel } from "@repo/shared"
import { Button, Heading, Select } from "@repo/ui/components/Primitive"
import { CalendarClockIcon, CircleGaugeIcon } from "@yamada-ui/lucide"
import { Grid, GridItem, memo, noop, type SelectItem, VStack } from "@yamada-ui/react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { locationAndTimeOptionsMock } from "./QuickBook.mock"
import type { UIQuickBookFormValues } from "./schema"
import { UIQuickBookFormSchema } from "./schema"

/**
 * Props for {@link QuickBook} component
 */
export interface QuickBookProps {
  /**
   * Title for the QuickBook component.
   *
   * @remarks Is not displayed on mobile screens
   *
   * @defaultValue "Quick Book"
   */
  title?: string

  /**
   * Label for the submit button.
   *
   * @defaultValue "Book Now"
   */
  submitLabel?: string

  /**
   * Options for the Location & Time Select component.
   *
   * @remarks Type is currently SelectItem[], which may be changed to a better alternative
   * @remarks label: human-readable information about the BookingSchedule/location & time; value: ID of the BookingSchedule/location & time
   *
   * @see {@link locationAndTimeOptionsMock}
   */
  locationAndTimeOptions: SelectItem[]

  /**
   * Submit handler called when user submits the QuickBook form.
   */
  onSubmit?: SubmitHandler<UIQuickBookFormValues>
}

/**
 * Options for the Skill Level Select component, using enum values from {@link PlayLevel}.
 */
const skillLevelOptions = Object.values(PlayLevel).map((playLevel) => ({
  value: playLevel,
  label: playLevel,
}))

/**
 * Quick Book component for both mobile and desktop screens, for the hero section of the home page.
 * The user must select a Location & Time and Skill Level before submitting.
 *
 * @param props QuickBook component props
 * @returns The memoized Quick Book component
 *
 * @remarks
 * The parent component should use `useMemo` to prevent redundant re-renders of this component.
 * See {@link https://react.dev/reference/react/memo#minimizing-props-changes}
 */
export const QuickBook = memo(
  ({
    title = "Quick Book",
    submitLabel = "Book Now",
    locationAndTimeOptions,
    onSubmit,
  }: QuickBookProps) => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<UIQuickBookFormValues>({
      resolver: zodResolver(UIQuickBookFormSchema),
    })

    return (
      <VStack
        as="form"
        bgColor="secondary.800"
        borderRadius="3xl"
        borderWidth="medium"
        onSubmit={handleSubmit(onSubmit ?? noop)}
        p="md"
      >
        <Heading.h2 display={{ base: "none", md: "block" }}>{title}</Heading.h2>
        <Grid gap="md" templateColumns={{ base: "1fr", md: "1fr 1fr auto" }}>
          <GridItem minW={0}>
            <Select
              data-testid="location-and-time"
              errorMessage={errors.locationAndTimeId?.message}
              icon={<CalendarClockIcon fontSize={24} />}
              isError={!!errors.locationAndTimeId}
              items={locationAndTimeOptions}
              label="Location & Time"
              registration={register("locationAndTimeId")}
              stylised
            />
          </GridItem>
          <GridItem minW={0}>
            <Select
              data-testid="skill-level"
              errorMessage={errors.skillLevel?.message}
              icon={<CircleGaugeIcon fontSize={24} />}
              isError={!!errors.skillLevel}
              items={skillLevelOptions}
              label="Skill Level"
              registration={register("skillLevel")}
              stylised
            />
          </GridItem>
          <GridItem w="full">
            <Button
              colorScheme="primary"
              loading={isSubmitting}
              size="lg"
              type="submit"
              variant="gradient"
              w="full"
            >
              {submitLabel}
            </Button>
          </GridItem>
        </Grid>
      </VStack>
    )
  },
)

QuickBook.displayName = "QuickBook"
