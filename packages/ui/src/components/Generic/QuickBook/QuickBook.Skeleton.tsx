"use client"

import { Button, Heading, Select } from "@repo/ui/components/Primitive"
import { CalendarClockIcon, CircleGaugeIcon } from "@yamada-ui/lucide"
import { FormControl, Grid, GridItem, VStack } from "@yamada-ui/react"

export interface QuickBookSkeletonProps {
  /**
   * Title displayed above the form.
   * @defaultValue "Quick Book"
   */
  title?: string
  /**
   * Label for the disabled submit button.
   * @defaultValue "Book Now"
   */
  submitLabel?: string
}

/**
 * Skeleton for the QuickBook form while client data is loading/hydrating.
 * Renders the same layout with controls disabled.
 */
export const QuickBookSkeleton = ({
  title = "Quick Book",
  submitLabel = "Book Now",
}: QuickBookSkeletonProps) => {
  return (
    <VStack bgColor="secondary.800" borderRadius="3xl" borderWidth="medium" p="md">
      <Heading.h2 display={{ base: "none", md: "block" }}>{title}</Heading.h2>
      <Grid gap="md" templateColumns={{ base: "1fr", lg: "1fr 1fr auto" }}>
        <GridItem minW={0}>
          <FormControl>
            <Select
              containerProps={{ rounded: "xl" }}
              data-testid="location-and-time-skeleton"
              disabled
              icon={<CalendarClockIcon fontSize={24} />}
              items={[]}
              label="Location & Time"
              rounded="xl"
              variant="stylised"
            />
          </FormControl>
        </GridItem>
        <GridItem minW={0}>
          <FormControl>
            <Select
              containerProps={{ rounded: "xl" }}
              data-testid="skill-level-skeleton"
              disabled
              icon={<CircleGaugeIcon fontSize={24} />}
              items={[]}
              label="Skill Level"
              rounded="xl"
              variant="stylised"
            />
          </FormControl>
        </GridItem>
        <GridItem w="full">
          <Button
            colorScheme="primary"
            disabled
            loading
            size="lg"
            type="button"
            variant="gradient"
            w="full"
          >
            {submitLabel}
          </Button>
        </GridItem>
      </Grid>
    </VStack>
  )
}
