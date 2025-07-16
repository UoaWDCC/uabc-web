import { act, renderHook } from "@repo/ui/test-utils"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { vi } from "vitest"
import { useCalendarSelectPopup } from "./useCalendarSelectPopup"

dayjs.extend(utc)
dayjs.extend(timezone)

const NZ_TIMEZONE = "Pacific/Auckland"

beforeAll(() => {
  vi.useFakeTimers()
  vi.setSystemTime(dayjs.tz("2025-01-01", "YYYY-MM-DD", NZ_TIMEZONE).toDate())
})

afterAll(() => {
  vi.useRealTimers()
})

describe("useCalendarSelectPopup", () => {
  it("should initialize with null date by default", () => {
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test" }), {
      wrapper: withNuqsTestingAdapter(),
    })
    expect(result.current.selectedDate).toBeNull()
  })

  it("should initialize with provided initial date", () => {
    const initialDate = dayjs.tz("2025-01-01", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test", initialDate }), {
      wrapper: withNuqsTestingAdapter(),
    })
    expect(result.current.selectedDate).toEqual(initialDate)
  })

  it("should set and update the selected date", () => {
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test" }), {
      wrapper: withNuqsTestingAdapter(),
    })
    const newDate = dayjs.tz("2025-02-10", "YYYY-MM-DD", NZ_TIMEZONE).toDate()

    act(() => {
      result.current.setDate(newDate)
    })

    expect(result.current.selectedDate).toEqual(newDate)
  })

  it("should clear the date to initialDate if provided", () => {
    const initialDate = dayjs.tz("2025-01-10", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test", initialDate }), {
      wrapper: withNuqsTestingAdapter(),
    })

    act(() => {
      result.current.setDate(dayjs.tz("2025-02-10", "YYYY-MM-DD", NZ_TIMEZONE).toDate())
      result.current.clearDate()
    })

    expect(result.current.selectedDate).toEqual(initialDate)
  })

  it("should clear the date to null if no initialDate is provided", () => {
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test" }), {
      wrapper: withNuqsTestingAdapter(),
    })

    act(() => {
      result.current.setDate(dayjs.tz("2025-02-10", "YYYY-MM-DD", NZ_TIMEZONE).toDate())
      result.current.clearDate()
    })

    expect(result.current.selectedDate).toBeNull()
  })

  it("should set date to today", () => {
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test" }), {
      wrapper: withNuqsTestingAdapter(),
    })
    const today = dayjs().tz(NZ_TIMEZONE).startOf("day").toDate()

    act(() => {
      result.current.setToday()
    })

    expect(result.current.selectedDate?.getDate()).toBe(today.getDate())
  })

  it("should handle range selection", () => {
    const { result } = renderHook(
      () =>
        useCalendarSelectPopup({
          popupId: "test",
          enableRange: true,
          initialDate: [undefined, undefined],
        }),
      { wrapper: withNuqsTestingAdapter() },
    )

    const startDate = dayjs.tz("2025-03-01", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
    const endDate = dayjs.tz("2025-03-15", "YYYY-MM-DD", NZ_TIMEZONE).toDate()

    act(() => {
      result.current.setDate([startDate, endDate])
    })

    expect(result.current.selectedDate).toEqual([startDate, endDate])
  })

  it("should open, close, and toggle the popup", () => {
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test" }), {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.toggle()
    })
    expect(result.current.isOpen).toBe(true)
  })

  it("should call onDateSelect callback", () => {
    const onDateSelect = vi.fn()
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test", onDateSelect }), {
      wrapper: withNuqsTestingAdapter(),
    })
    const newDate = dayjs.tz("2025-04-04", "YYYY-MM-DD", NZ_TIMEZONE).toDate()

    act(() => {
      result.current.setDate(newDate)
    })

    expect(onDateSelect).toHaveBeenCalledWith(newDate)
  })

  it("should not call onDateSelect when neither startDate nor endDate is set in range mode", () => {
    const onDateSelect = vi.fn()
    const { result } = renderHook(
      () =>
        useCalendarSelectPopup({
          popupId: "test",
          enableRange: true,
          initialDate: [undefined, undefined],
          onDateSelect,
        }),
      { wrapper: withNuqsTestingAdapter() },
    )

    act(() => {
      result.current.setDate([undefined, undefined])
    })

    expect(onDateSelect).not.toHaveBeenCalled()
  })

  it("should handle setToday in both single and range modes", () => {
    const { result: singleResult } = renderHook(
      () =>
        useCalendarSelectPopup({
          popupId: "test-single",
          enableRange: false,
        }),
      { wrapper: withNuqsTestingAdapter() },
    )

    act(() => {
      singleResult.current.setToday()
    })

    expect(singleResult.current.selectedDate).toBeInstanceOf(Date)
    expect(dayjs(singleResult.current.selectedDate).tz(NZ_TIMEZONE).date()).toBe(1)

    const { result: rangeResult } = renderHook(
      () =>
        useCalendarSelectPopup({
          popupId: "test-range",
          enableRange: true,
          initialDate: [undefined, undefined],
        }),
      { wrapper: withNuqsTestingAdapter() },
    )

    act(() => {
      rangeResult.current.setToday()
    })

    const [startDate, endDate] = rangeResult.current.selectedDate as [Date?, Date?]
    expect(startDate).toBeInstanceOf(Date)
    expect(dayjs(startDate).tz(NZ_TIMEZONE).date()).toBe(1)
    expect(endDate).toBeUndefined()
  })

  it("should reset to initialDate when calling setDate(null)", () => {
    const onDateSelect = vi.fn()
    const initialDate = dayjs.tz("2025-01-01", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
    const { result } = renderHook(
      () =>
        useCalendarSelectPopup({
          popupId: "test",
          enableRange: false,
          onDateSelect,
          initialDate,
        }),
      { wrapper: withNuqsTestingAdapter() },
    )

    act(() => {
      result.current.setDate(dayjs.tz("2025-02-10", "YYYY-MM-DD", NZ_TIMEZONE).toDate())
    })

    act(() => {
      result.current.setDate(null)
    })

    expect(result.current.selectedDate).toEqual(initialDate)
  })
})
