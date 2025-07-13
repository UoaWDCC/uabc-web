import { act, renderHook } from "@repo/ui/test-utils"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { vi } from "vitest"
import { useCalendarSelectPopup } from "./useCalendarSelectPopup"

dayjs.extend(utc)
dayjs.extend(timezone)

const NZ_TIMEZONE = "Pacific/Auckland"

const createWrapper = () => {
  const Wrapper = ({ children }: { children: ReactNode }) => <NuqsAdapter>{children}</NuqsAdapter>
  return Wrapper
}

beforeAll(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"))
})

afterAll(() => {
  vi.useRealTimers()
})

describe("useCalendarSelectPopup", () => {
  it("should initialize with default date", () => {
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test" }), {
      wrapper: createWrapper(),
    })
    expect(result.current.selectedDate).toBeInstanceOf(Date)
  })

  it("should initialize with provided initial date", () => {
    const initialDate = dayjs.tz("2025-01-01", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test", initialDate }), {
      wrapper: createWrapper(),
    })
    expect(result.current.selectedDate).toEqual(initialDate)
  })

  it("should set and update the selected date", () => {
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test" }), {
      wrapper: createWrapper(),
    })
    const newDate = dayjs.tz("2025-02-10", "YYYY-MM-DD", NZ_TIMEZONE).toDate()

    act(() => {
      result.current.setDate(newDate)
    })

    expect(result.current.selectedDate).toEqual(newDate)
  })

  it("should clear the date", () => {
    const initialDate = dayjs.tz("2025-01-10", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test", initialDate }), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.clearDate()
    })

    expect(result.current.selectedDate).toEqual(initialDate)
  })

  it("should set date to today", () => {
    const { result } = renderHook(() => useCalendarSelectPopup({ popupId: "test" }), {
      wrapper: createWrapper(),
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
      { wrapper: createWrapper() },
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
      wrapper: createWrapper(),
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
      wrapper: createWrapper(),
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
      { wrapper: createWrapper() },
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
      { wrapper: createWrapper() },
    )

    act(() => {
      singleResult.current.setToday()
    })

    expect(singleResult.current.selectedDate).toBeInstanceOf(Date)
    expect(singleResult.current.selectedDate?.getDate()).toBe(
      dayjs().tz(NZ_TIMEZONE).toDate().getDate(),
    )

    const { result: rangeResult } = renderHook(
      () =>
        useCalendarSelectPopup({
          popupId: "test-range",
          enableRange: true,
          initialDate: [undefined, undefined],
        }),
      { wrapper: createWrapper() },
    )

    act(() => {
      rangeResult.current.setToday()
    })

    const [startDate, endDate] = rangeResult.current.selectedDate as [Date?, Date?]
    expect(startDate).toBeInstanceOf(Date)
    expect(startDate?.getDate()).toBe(dayjs().tz(NZ_TIMEZONE).toDate().getDate())
    expect(endDate).toBeUndefined()
  })

  it("should handle setDate with null and trigger early return", () => {
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
      { wrapper: createWrapper() },
    )

    act(() => {
      result.current.setDate(null)
    })

    expect(result.current.selectedDate).toEqual(initialDate)
    expect(onDateSelect).not.toHaveBeenCalled()
  })
})
