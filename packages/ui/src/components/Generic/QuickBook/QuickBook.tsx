import { Button, Heading, Select } from "@repo/ui/components/Primitive"
import { CalendarClockIcon, CircleGaugeIcon } from "@yamada-ui/lucide"
import { memo, type SelectItem, Stack, VStack } from "@yamada-ui/react"

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
        <Stack direction={{ base: "column", md: "row" }}>
          <Select
            icon={<CalendarClockIcon fontSize={24} />}
            items={locationAndTimeOptions}
            label="Location & Time"
            stylised
          />
          <Select
            icon={<CircleGaugeIcon fontSize={24} />}
            items={skillLevelOptions}
            label="Skill Level"
            stylised
          />
          <Button colorScheme="primary" size="lg" variant="gradient">
            {submitLabel}
          </Button>
        </Stack>
      </VStack>
    )
  },
)

QuickBook.displayName = "QuickBook"
