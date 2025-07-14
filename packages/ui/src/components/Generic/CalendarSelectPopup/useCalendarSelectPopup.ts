import { usePopupState } from "@repo/ui/hooks"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import { useCallback, useMemo } from "react"
import type {
  DateValue,
  PopupNavigationUtils,
  UseCalendarSelectPopupOptions,
  UseCalendarSelectPopupReturn,
} from "./types"
import { fromPopupValue, toPopupValue } from "./utils"

dayjs.extend(timezone)

const NZ_TIMEZONE = "Pacific/Auckland"

/**
 * React hook for managing calendar popup state and date selection
 *
 * This hook provides comprehensive state management for calendar popups,
 * including URL synchronization, date validation, and navigation utilities.
 * Supports both single date and date range selection modes.
 *
 * @param options Configuration options for the calendar popup
 * @returns Object containing popup state, date values, and control functions
 *
 * @example
 * ```tsx
 * // Basic single date selection
 * const calendar = useCalendarSelectPopup({
 *   popupId: "date-picker",
 *   initialDate: new Date(),
 *   onDateSelect: (date) => console.log("Selected:", date)
 * })
 *
 * // Date range selection
 * const rangeCalendar = useCalendarSelectPopup({
 *   popupId: "date-range",
 *   enableRange: true,
 *   initialDate: [undefined, undefined],
 *   onDateSelect: (dates) => console.log("Range:", dates)
 * })
 * ```
 *
 * @remarks
 * The hook automatically handles URL parameter synchronization, allowing
 * for deep linking and browser navigation support. Date values are stored
 * as ISO date strings in the URL and converted back to Date objects.
 */
export function useCalendarSelectPopup<T extends boolean = false>(
  options: UseCalendarSelectPopupOptions<T>,
): UseCalendarSelectPopupReturn<T> {
  const {
    popupId,
    openValue = "open",
    dateParamKey = `${popupId}-date`,
    initialDate = (options.enableRange ? [undefined, undefined] : null) as DateValue<T>,
    enableRange = false as T,
    onDateSelect,
    onClose,
    onOpen,
  } = options

  const {
    isOpen,
    value: dateParam,
    open,
    close,
    toggle,
    setValue,
    clearValue,
    navigation,
  } = usePopupState({
    popupId,
    openValue,
    valueKey: dateParamKey,
    initialValue: toPopupValue(initialDate, enableRange),
    multiple: enableRange,
    onOpen,
    onClose,
  })

  const selectedDate = useMemo(() => {
    if (dateParam == null) {
      return (enableRange ? [undefined, undefined] : null) as DateValue<T> | null
    }
    return fromPopupValue(dateParam, enableRange, initialDate)
  }, [dateParam, enableRange, initialDate])

  const setDate = useCallback(
    (date: DateValue<T> | null) => {
      if (date === null) {
        setValue(toPopupValue(initialDate, enableRange))
        return
      }

      setValue(toPopupValue(date, enableRange))

      if (enableRange) {
        const [startDate, endDate] = date as [Date?, Date?]
        if (startDate || endDate) {
          onDateSelect?.(date)
        }
      } else if (date) {
        onDateSelect?.(date)
      }
    },
    [enableRange, onDateSelect, setValue, initialDate],
  )

  const clearDate = useCallback(() => {
    clearValue()
  }, [clearValue])

  const setToday = useCallback(() => {
    const today = dayjs().tz(NZ_TIMEZONE).startOf("day").toDate()
    if (enableRange) {
      setDate([today, undefined] as unknown as DateValue<T>)
    } else {
      setDate(today as DateValue<T>)
    }
  }, [setDate, enableRange])

  return useMemo(
    () => ({
      isOpen,
      selectedDate,
      open,
      close,
      toggle,
      setDate,
      clearDate,
      setToday,
      navigation: navigation as PopupNavigationUtils,
    }),
    [isOpen, selectedDate, open, close, toggle, setDate, clearDate, setToday, navigation],
  )
}
