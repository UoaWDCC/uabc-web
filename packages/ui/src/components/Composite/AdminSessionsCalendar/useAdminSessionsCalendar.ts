import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import { parseAsString, useQueryState } from "nuqs"
import { useCallback, useMemo } from "react"

dayjs.extend(timezone)

export interface UseAdminSessionsCalendarOptions {
  /**
   * The query parameter key for the date
   * @default "date"
   */
  dateParamKey?: string
  /**
   * Initial date value when no date is selected
   * @default new Date()
   */
  initialDate?: Date
}

export interface UseAdminSessionsCalendarReturn {
  /**
   * Currently selected date
   */
  selectedDate: Date
  /**
   * Function to update the selected date
   */
  setSelectedDate: (date: Date) => void
  /**
   * Function to go to today's date
   */
  goToToday: () => void
}

/**
 * Hook for managing admin sessions calendar state with URL synchronization using nuqs
 *
 * Provides state management for the admin sessions calendar with automatic
 * URL synchronization using nuqs. The selected date is stored in the URL
 * for deep linking and browser navigation support.
 *
 * @param options Configuration options for the hook
 * @returns Object containing selected date and control functions
 *
 * @example
 * ```tsx
 * const { selectedDate, setSelectedDate, goToToday } = useAdminSessionsCalendar({
 *   dateParamKey: "selectedDate",
 *   initialDate: new Date("2025-01-21")
 * })
 * ```
 */
export function useAdminSessionsCalendar({
  dateParamKey = "date",
  initialDate = new Date(),
}: UseAdminSessionsCalendarOptions): UseAdminSessionsCalendarReturn {
  const [dateParam, setDateParam] = useQueryState(
    dateParamKey,
    parseAsString.withDefault(dayjs(initialDate).format("YYYY-MM-DD")),
  )

  const selectedDate = useMemo(() => {
    if (!dateParam) return initialDate
    const parsed = dayjs(dateParam, "YYYY-MM-DD", true)
    return parsed.isValid() ? parsed.toDate() : initialDate
  }, [dateParam, initialDate])

  const setSelectedDate = useCallback(
    (date: Date) => {
      const formattedDate = dayjs(date).format("YYYY-MM-DD")
      setDateParam(formattedDate)
    },
    [setDateParam],
  )

  const goToToday = useCallback(() => {
    setSelectedDate(new Date())
  }, [setSelectedDate])

  return {
    selectedDate,
    setSelectedDate,
    goToToday,
  }
}
