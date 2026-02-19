import { memo, Skeleton, Text, VStack } from "@yamada-ui/react"

export interface DateCardProps {
  /**
   * The date to display. When not provided, animated skeletons are shown in place of each field.
   */
  date?: Date
  /**
   * Label displayed above the date (e.g. "Start" or "End").
   */
  label: string
}

/**
 * Parse a Date object into localized month, day, and year strings.
 *
 * If no date is provided, each part will be null which can be used to render
 * skeleton placeholders in the UI.
 *
 * @param date - The date to parse; when omitted the function returns null parts.
 * @returns An object containing localized month (short), day (numeric), and year (numeric) strings, or nulls.
 */
const parseDateParts = (date?: Date) => {
  if (!date) return { month: null, day: null, year: null }

  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: date.toLocaleDateString("en-US", { day: "numeric" }),
    year: date.toLocaleDateString("en-US", { year: "numeric" }),
  }
}

/**
 * A card that displays a single date broken into day, month, and year sections
 * with a descriptive label above.
 *
 * When no date is provided each field renders as an animated skeleton placeholder,
 * giving users a clear visual cue that a date has not yet been selected.
 *
 * @param props - {@link DateCardProps}
 */
export const DateCard = memo(({ date, label }: DateCardProps) => {
  const parts = parseDateParts(date)
  const loaded = !!parts.day

  return (
    <VStack
      alignItems="center"
      bg="whiteAlpha.100"
      borderRadius="2xl"
      flex="1"
      gap="0"
      layerStyle="gradientBorder"
      px="md"
      py="md"
    >
      <Text
        color="whiteAlpha.600"
        fontSize="2xs"
        fontWeight="semibold"
        letterSpacing="widest"
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Skeleton
        borderRadius="md"
        endColor="whiteAlpha.300"
        loaded={loaded}
        mt="xs"
        startColor="whiteAlpha.100"
      >
        <Text fontSize="4xl" fontWeight="bold" lineHeight="1.1">
          {parts.day ?? "00"}
        </Text>
      </Skeleton>
      <Skeleton
        borderRadius="md"
        endColor="whiteAlpha.300"
        loaded={loaded}
        mt="1"
        startColor="whiteAlpha.100"
      >
        <Text fontSize="sm" fontWeight="medium">
          {parts.month ?? "XXX"}
        </Text>
      </Skeleton>
      <Skeleton
        borderRadius="md"
        endColor="whiteAlpha.300"
        loaded={loaded}
        mt="1"
        startColor="whiteAlpha.100"
      >
        <Text color="whiteAlpha.600" fontSize="xs">
          {parts.year ?? "0000"}
        </Text>
      </Skeleton>
    </VStack>
  )
})

DateCard.displayName = "DateCard"
