"use client"

import { Button, Heading, Select } from "@repo/ui/components/Primitive"
import { CalendarClockIcon, CircleGaugeIcon } from "@yamada-ui/lucide"
import { Grid, GridItem, memo, type SelectItem, VStack } from "@yamada-ui/react"
import { type SubmitHandler, useForm } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
  locationAndTimeId: z.string().min(1, "Field is required"),
  skillLevel: z.string().min(1, "Field is required"),
})

export interface QuickBookProps {
  title?: string
  submitLabel?: string
  locationAndTimeOptions: SelectItem[]
  skillLevelOptions: SelectItem[]
  onSubmit: SubmitHandler<z.infer<typeof formSchema>>
}

export const QuickBook = memo(
  ({
    title = "Quick Book",
    submitLabel = "Book Now",
    locationAndTimeOptions,
    skillLevelOptions,
    onSubmit,
  }: QuickBookProps) => {
    const {
      handleSubmit,
      formState: { isSubmitting },
    } = useForm<z.infer<typeof formSchema>>()

    return (
      <VStack
        as="form"
        bgColor="secondary.800"
        borderRadius="3xl"
        borderWidth="medium"
        onSubmit={handleSubmit(onSubmit)}
        p="md"
      >
        <Heading.h2 display={{ base: "none", md: "block" }}>{title}</Heading.h2>
        <Grid gap="md" templateColumns={{ base: "1fr", md: "1fr 1fr auto" }}>
          <GridItem minW={0}>
            <Select
              data-testid="location-and-time"
              icon={<CalendarClockIcon fontSize={24} />}
              items={locationAndTimeOptions}
              label="Location & Time"
              stylised
            />
          </GridItem>
          <GridItem minW={0}>
            <Select
              data-testid="skill-level"
              icon={<CircleGaugeIcon fontSize={24} />}
              items={skillLevelOptions}
              label="Skill Level"
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
