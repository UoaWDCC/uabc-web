import { ArrowRightIcon } from "@yamada-ui/lucide"
import { Box, HStack, memo } from "@yamada-ui/react"
import { DateCard } from "../DateCard"

export interface DateRangeDisplayProps {
  /**
   * The start date of the range. When not provided, the start card shows placeholder dashes.
   */
  startDate?: Date
  /**
   * The end date of the range. When not provided, the end card shows placeholder dashes.
   */
  endDate?: Date
}

/**
 * Displays a start and end date side by side as {@link DateCard} components,
 * separated by an arrow icon.
 *
 * When either date is absent the corresponding card renders in its empty placeholder
 * state, giving users a clear visual indication of what still needs to be selected.
 *
 * @param props - {@link DateRangeDisplayProps}
 */
export const DateRangeDisplay = memo(({ startDate, endDate }: DateRangeDisplayProps) => {
  return (
    <HStack alignItems="stretch" gap="sm" w="full">
      <DateCard date={startDate} label="Start" />
      <Box alignSelf="center" color="whiteAlpha.400" flexShrink={0}>
        <ArrowRightIcon fontSize="md" />
      </Box>
      <DateCard date={endDate} label="End" />
    </HStack>
  )
})

DateRangeDisplay.displayName = "DateRangeDisplay"
