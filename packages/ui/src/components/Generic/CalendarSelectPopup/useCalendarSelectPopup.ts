import { isNumber, isString } from "@yamada-ui/react"
import { useCallback, useMemo } from "react"
import { z } from "zod"
import { usePopupState } from "../../../hooks/usePopupState"
import type {
  DateValue,
  PopupNavigationUtils,
  UseCalendarSelectPopupOptions,
  UseCalendarSelectPopupReturn,
} from "./types"

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((v) => isString(v))
}

type PopupValueType<T extends boolean> = T extends true ? string[] : string

function toPopupValue(val: Date | [Date?, Date?], range: boolean): string | string[] {
  if (range) {
    const arr = val as [Date?, Date?]
    return [
      arr[0] instanceof Date
        ? `${arr[0].getFullYear()}-${String(arr[0].getMonth() + 1).padStart(2, "0")}-${String(arr[0].getDate()).padStart(2, "0")}`
        : "",
      arr[1] instanceof Date
        ? `${arr[1].getFullYear()}-${String(arr[1].getMonth() + 1).padStart(2, "0")}-${String(arr[1].getDate()).padStart(2, "0")}`
        : "",
    ]
  }
  const d = val as Date
  return d instanceof Date
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    : ""
}

export function useCalendarSelectPopup<T extends boolean = false>(
  options: UseCalendarSelectPopupOptions<T>,
): UseCalendarSelectPopupReturn<T> {
  const {
    popupId,
    openValue = "open",
    dateParamKey = `${popupId}-date`,
    initialDate = (options.enableRange ? [undefined, undefined] : new Date()) as T extends true
      ? [Date?, Date?]
      : Date,
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
  } = usePopupState<PopupValueType<T>>({
    popupId,
    openValue,
    valueKey: dateParamKey,
    initialValue: toPopupValue(initialDate, enableRange) as PopupValueType<T>,
    isRange: enableRange,
    onOpen,
    onClose,
  })

  const selectedDate = useMemo((): DateValue<T> | null => {
    if (enableRange) {
      let dateArray: string[] = []
      if (isString(dateParam)) {
        dateArray = [dateParam]
      } else if (isStringArray(dateParam)) {
        dateArray = dateParam
      }
      if (!dateArray.length) return initialDate as DateValue<T>
      const [startStr, endStr] = dateArray
      const startDate = startStr ? new Date(startStr) : undefined
      const endDate = endStr ? new Date(endStr) : undefined
      const validStart = startDate && isNumber(startDate.getTime()) ? startDate : undefined
      const validEnd = endDate && isNumber(endDate.getTime()) ? endDate : undefined
      const rangeSchema = z.array(z.date().optional()).length(2)
      const result = rangeSchema.safeParse([validStart, validEnd])
      return result.success ? (result.data as DateValue<T>) : (initialDate as DateValue<T>)
    }
    let dateString = ""
    if (typeof dateParam === "string") {
      dateString = dateParam
    } else if (isStringArray(dateParam) && dateParam[0]) {
      dateString = dateParam[0]
    }
    if (!dateString) return initialDate as DateValue<T>
    const date = new Date(dateString)
    const singleSchema = z.date()
    const result = singleSchema.safeParse(date)
    return result.success ? (date as DateValue<T>) : (initialDate as DateValue<T>)
  }, [dateParam, initialDate, enableRange])

  const setDate = useCallback(
    (date: DateValue<T> | null) => {
      if (enableRange) {
        if (!Array.isArray(date)) {
          setValue([] as unknown as PopupValueType<T>)
          return
        }
        const [startDate, endDate] = date
        const dateStrings: string[] = []
        if (startDate instanceof Date) {
          dateStrings.push(
            `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`,
          )
        }
        if (endDate instanceof Date) {
          if (dateStrings.length === 0) {
            dateStrings.push("")
          }
          dateStrings.push(
            `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`,
          )
        }
        setValue(dateStrings as PopupValueType<T>)
        if (date[0] || date[1]) {
          onDateSelect?.(date as DateValue<T>)
        }
      } else {
        if (date instanceof Date) {
          const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
          setValue(dateString as PopupValueType<T>)
          onDateSelect?.(date as DateValue<T>)
        } else {
          setValue(null)
        }
      }
    },
    [setValue, onDateSelect, enableRange],
  )

  const clearDate = useCallback(() => {
    clearValue()
  }, [clearValue])

  const setToday = useCallback(() => {
    const today = new Date()
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
