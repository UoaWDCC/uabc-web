import { isString } from "@yamada-ui/react"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { z } from "zod"
import type { CompositeCalendarPopupProps, DateValue, PopupConfig } from "./types"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

/**
 * Timezone to use for all calendar popup logic (New Zealand)
 */
const NZ_TIMEZONE = "Pacific/Auckland"

/**
 * Navigation functions for managing popup state transitions
 */
type PopupNavigation = {
  /**
   * Switch to a different popup
   * @param from The current popup ID
   * @param to The popup ID to switch to
   */
  switchPopup: (from: string, to: string) => void
}

/**
 * Creates a popup configuration object with consistent naming
 *
 * @param baseId Base identifier for the popup
 * @param suffix Optional suffix to append to the base ID
 * @returns Complete popup configuration with ID and parameter keys
 *
 * @example
 * ```tsx
 * const config = createPopupConfig("date-picker", "step-1")
 * // Returns: { popupId: "date-picker-step-1", openValue: "open", dateParamKey: "date-picker-step-1-date" }
 * ```
 */
export function createPopupConfig(baseId: string, suffix?: string): PopupConfig {
  const popupId = suffix ? `${baseId}-${suffix}` : baseId
  return {
    popupId,
    openValue: "open",
    dateParamKey: `${popupId}-date`,
  }
}

/**
 * Creates composite props by merging base configuration with provided props
 *
 * @param baseId Base identifier for the popup
 * @param props Additional props to merge with the base configuration
 * @returns Combined props with popup configuration
 *
 * @example
 * ```tsx
 * const props = createCompositeProps("calendar", { title: "Select Date" })
 * // Includes popupId, openValue, dateParamKey, and any additional props
 * ```
 */
export function createCompositeProps<T extends boolean = false>(
  baseId: string,
  props: CompositeCalendarPopupProps<T> = {} as CompositeCalendarPopupProps<T>,
): CompositeCalendarPopupProps<T> & PopupConfig {
  const popupId = props.popupId || baseId
  const config = createPopupConfig(popupId)

  return {
    ...config,
    ...props,
    popupId,
  }
}

/**
 * Type guard to check if a value is a string array.
 *
 * @param val - The value to check.
 * @returns True if `val` is an array of strings.
 */
export function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((v) => typeof v === "string")
}

/**
 * Converts a date or date range to a URL-safe string representation in NZ timezone.
 *
 * @param val - The date or date range to convert.
 * @param range - Whether this is a range selection.
 * @returns A string or string array representation for URL parameters.
 */
export function toPopupValue(val: Date | [Date?, Date?], range: boolean): string | string[] {
  const formatDate = (date: Date) => dayjs(date).tz(NZ_TIMEZONE).format("YYYY-MM-DD")

  if (range) {
    const arr = val as [Date?, Date?]
    return [
      arr[0] instanceof Date ? formatDate(arr[0]) : "",
      arr[1] instanceof Date ? formatDate(arr[1]) : "",
    ]
  }

  const d = val as Date
  return d instanceof Date ? formatDate(d) : ""
}

/**
 * Converts a string or string array from a URL parameter to a `Date` or date range in NZ timezone.
 *
 * @param param - The URL parameter value.
 * @param range - Whether this is a range selection.
 * @param initialDate - The initial date to fall back to if parsing fails.
 * @returns A `Date` object or a tuple of `Date` objects.
 */
export function fromPopupValue<T extends boolean>(
  param: string | string[] | undefined,
  range: T,
  initialDate: DateValue<T>,
): DateValue<T> {
  const parseDate = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr) return undefined
    const d = dayjs(dateStr, "YYYY-MM-DD", true)
    if (!d.isValid()) return undefined
    return dayjs.tz(dateStr, "YYYY-MM-DD", NZ_TIMEZONE).toDate()
  }

  if (range) {
    const dateArray = isStringArray(param) ? param : isString(param) ? [param] : []

    if (!dateArray.length) {
      return initialDate
    }

    const [startStr, endStr] = dateArray
    const startDate = parseDate(startStr)
    const endDate = parseDate(endStr)

    const validStart = startDate && !Number.isNaN(startDate.getTime()) ? startDate : undefined
    const validEnd = endDate && !Number.isNaN(endDate.getTime()) ? endDate : undefined
    const rangeSchema = z.tuple([z.date().optional(), z.date().optional()])
    const result = rangeSchema.safeParse([validStart, validEnd])

    return result.success ? (result.data as unknown as DateValue<T>) : initialDate
  }

  const dateString = isString(param) ? param : isStringArray(param) ? param[0] : ""
  if (!dateString) return initialDate

  const date = parseDate(dateString) ?? new Date(Number.NaN)
  const singleSchema = z.date()
  const result = singleSchema.safeParse(date)

  if (result.success) {
    return result.data as DateValue<T>
  }

  return initialDate
}

/**
 * Navigation patterns for managing popup state transitions
 *
 * @remarks
 * Provides common patterns for popup navigation including sequential,
 * conditional, and form-based navigation flows
 */
export const NavigationPatterns = {
  /**
   * Sequential navigation patterns for step-by-step flows
   */
  sequential: {
    /**
     * Navigate to the next popup in sequence
     *
     * @param current Current popup ID
     * @param next Next popup ID
     * @param navigation Navigation functions
     */
    next: (current: string, next: string, navigation: PopupNavigation) => {
      navigation.switchPopup(current, next)
    },

    /**
     * Navigate to the previous popup in sequence
     *
     * @param current Current popup ID
     * @param previous Previous popup ID
     * @param navigation Navigation functions
     */
    previous: (current: string, previous: string, navigation: PopupNavigation) => {
      navigation.switchPopup(current, previous)
    },
  },

  /**
   * Conditional navigation patterns for branching flows
   */
  conditional: {
    /**
     * Navigate based on a condition
     *
     * @param current Current popup ID
     * @param condition Condition to evaluate
     * @param trueTarget Target popup ID if condition is true
     * @param falseTarget Target popup ID if condition is false
     * @param navigation Navigation functions
     */
    navigate: (
      current: string,
      condition: boolean,
      trueTarget: string,
      falseTarget: string,
      navigation: PopupNavigation,
    ) => {
      const target = condition ? trueTarget : falseTarget
      navigation.switchPopup(current, target)
    },
  },

  /**
   * Form-based navigation patterns with validation
   */
  form: {
    /**
     * Navigate to next step if form is valid
     *
     * @param current Current popup ID
     * @param next Next popup ID
     * @param isValid Validation function
     * @param navigation Navigation functions
     * @returns True if navigation occurred, false if validation failed
     */
    nextStep: (
      current: string,
      next: string,
      isValid: () => boolean,
      navigation: PopupNavigation,
    ): boolean => {
      if (isValid()) {
        navigation.switchPopup(current, next)
        return true
      }
      return false
    },
  },
}
