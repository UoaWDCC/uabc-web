"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlayLevel } from "@repo/shared"
import { Button, Heading, Select } from "@repo/ui/components/Primitive"
import { CalendarClockIcon, CircleGaugeIcon } from "@yamada-ui/lucide"
import { Grid, GridItem, memo, noop, type SelectItem, VStack } from "@yamada-ui/react"
import { type SubmitHandler, useForm } from "react-hook-form"
import type { UIQuickBookFormValues } from "./schema"
import { UIQuickBookFormSchema } from "./schema"

export interface QuickBookProps {
  title?: string
  submitLabel?: string
  locationAndTimeOptions: SelectItem[]
  onSubmit?: SubmitHandler<UIQuickBookFormValues>
}

const skillLevelOptions = Object.values(PlayLevel).map((playLevel) => ({
  value: playLevel,
  label: playLevel.charAt(0).toUpperCase() + playLevel.slice(1),
  // TODO: Change PlayLevel enum values to title case and remove string manipulationg here
}))

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
          <GridItem placeSelf="center" w="full">
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
