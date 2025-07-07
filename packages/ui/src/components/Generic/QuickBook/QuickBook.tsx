import { Button, Heading, Select } from "@repo/ui/components/Primitive"
import { CalendarClockIcon, CircleGaugeIcon } from "@yamada-ui/lucide"
import { Grid, GridItem, memo, type SelectItem, VStack } from "@yamada-ui/react"

export interface QuickBookProps {
  title?: string
  submitLabel?: string
  locationAndTimeOptions: SelectItem[]
  skillLevelOptions: SelectItem[]
}

export const QuickBook = memo(
  ({
    title = "Quick Book",
    submitLabel = "Book Now",
    locationAndTimeOptions,
    skillLevelOptions,
  }: QuickBookProps) => {
    return (
      <VStack bgColor="secondary.800" borderRadius="3xl" borderWidth="medium" p="md">
        <Heading.h2>{title}</Heading.h2>
        <Grid gap="md" templateColumns={{ base: "1fr", md: "1fr 1fr auto" }}>
          <GridItem minW={0}>
            <Select
              icon={<CalendarClockIcon fontSize={24} />}
              items={locationAndTimeOptions}
              label="Location & Time"
              stylised
            />
          </GridItem>
          <GridItem minW={0}>
            <Select
              icon={<CircleGaugeIcon fontSize={24} />}
              items={skillLevelOptions}
              label="Skill Level"
              stylised
            />
          </GridItem>
          <GridItem placeSelf="center" w="full">
            <Button colorScheme="primary" size="lg" variant="gradient" w="full">
              {submitLabel}
            </Button>
          </GridItem>
        </Grid>
      </VStack>
    )
  },
)

QuickBook.displayName = "QuickBook"
