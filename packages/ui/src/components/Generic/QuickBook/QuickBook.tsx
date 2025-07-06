import { PlayLevel } from "@repo/shared"
import { Button, Heading, Select } from "@repo/ui/components/Primitive"
import { CalendarClockIcon, CircleGaugeIcon } from "@yamada-ui/lucide"
import { Option, Stack, VStack } from "@yamada-ui/react"

export interface QuickBookProps {
  title?: string
  submitLabel?: string
  schedules: { id: string; label: string }[]
}

export const QuickBook = ({
  title = "Quick Book",
  submitLabel = "Book Now",
  schedules,
}: QuickBookProps) => {
  return (
    <VStack bgColor="secondary.800" borderRadius="3xl" borderWidth="medium" p="md">
      <Heading.h2>{title}</Heading.h2>
      <Stack direction={{ base: "column", md: "row" }}>
        <Select icon={<CalendarClockIcon fontSize={24} />} label="Location & Time" stylised>
          {schedules.map((schedule) => (
            <Option key={schedule.id} value={schedule.label}>
              {schedule.label}
            </Option>
          ))}
        </Select>
        <Select icon={<CircleGaugeIcon fontSize={24} />} label="Skill Level" stylised>
          {Object.keys(PlayLevel).map((playLevel) => {
            const formattedPlayLevel = playLevel.charAt(0).toUpperCase() + playLevel.slice(1)
            return (
              <Option key={playLevel} value={playLevel}>
                {formattedPlayLevel}
              </Option>
            )
          })}
        </Select>
        <Button colorScheme="primary" size="lg" variant="gradient">
          {submitLabel}
        </Button>
      </Stack>
    </VStack>
  )
}

QuickBook.displayName = "QuickBook"
