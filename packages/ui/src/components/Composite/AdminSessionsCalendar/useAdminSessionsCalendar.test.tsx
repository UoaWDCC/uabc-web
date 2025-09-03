import { act, renderHook } from "@testing-library/react"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { vi } from "vitest"
import { useAdminSessionsCalendar } from "./useAdminSessionsCalendar"

const defaultOptions = {
  dateParamKey: "date",
  initialDate: new Date("2025-01-21"),
}

describe("useAdminSessionsCalendar", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("uses initial date when no date param is provided", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar(defaultOptions), {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(result.current.selectedDate).toEqual(new Date("2025-01-21"))
  })

  it("updates selected date when setSelectedDate is called", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar(defaultOptions), {
      wrapper: withNuqsTestingAdapter(),
    })

    const newDate = new Date("2025-02-15")

    act(() => {
      result.current.setSelectedDate(newDate)
    })

    expect(result.current.selectedDate).toEqual(new Date("2025-02-15"))
  })

  it("goes to today when goToToday is called", () => {
    const { result } = renderHook(() => useAdminSessionsCalendar(defaultOptions), {
      wrapper: withNuqsTestingAdapter(),
    })

    act(() => {
      result.current.goToToday()
    })

    const today = new Date()
    expect(result.current.selectedDate.getDate()).toBe(today.getDate())
    expect(result.current.selectedDate.getMonth()).toBe(today.getMonth())
    expect(result.current.selectedDate.getFullYear()).toBe(today.getFullYear())
  })

  it("uses custom date param key when provided", () => {
    const options = {
      ...defaultOptions,
      dateParamKey: "selectedDate",
    }

    const { result } = renderHook(() => useAdminSessionsCalendar(options), {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(result.current.selectedDate).toEqual(new Date("2025-01-21"))
  })
})
