import { calculateOpenDate, getDaysBetweenWeekdays, Weekday } from "@repo/shared"

describe("getDaysBetweenWeekdays", () => {
  it("should return 0 when fromDay and toDay are the same", () => {
    expect(getDaysBetweenWeekdays(Weekday.MONDAY, Weekday.MONDAY)).toBe(0)
    expect(getDaysBetweenWeekdays(Weekday.SUNDAY, Weekday.SUNDAY)).toBe(0)
  })

  it("should return correct days for consecutive days", () => {
    expect(getDaysBetweenWeekdays(Weekday.MONDAY, Weekday.TUESDAY)).toBe(1)
    expect(getDaysBetweenWeekdays(Weekday.TUESDAY, Weekday.WEDNESDAY)).toBe(1)
    expect(getDaysBetweenWeekdays(Weekday.SATURDAY, Weekday.SUNDAY)).toBe(1)
  })

  it("should return correct days for days that wrap around the week", () => {
    expect(getDaysBetweenWeekdays(Weekday.SUNDAY, Weekday.MONDAY)).toBe(1)
    expect(getDaysBetweenWeekdays(Weekday.SATURDAY, Weekday.MONDAY)).toBe(2)
    expect(getDaysBetweenWeekdays(Weekday.FRIDAY, Weekday.MONDAY)).toBe(3)
  })

  it("should return correct days for reverse direction", () => {
    expect(getDaysBetweenWeekdays(Weekday.TUESDAY, Weekday.MONDAY)).toBe(6)
    expect(getDaysBetweenWeekdays(Weekday.MONDAY, Weekday.SUNDAY)).toBe(6)
    expect(getDaysBetweenWeekdays(Weekday.WEDNESDAY, Weekday.MONDAY)).toBe(5)
  })

  test.each(Object.values(Weekday))("should handle all weekday combinations", (fromDay) => {
    for (const toDay of Object.values(Weekday)) {
      const result = getDaysBetweenWeekdays(fromDay, toDay)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(7)
    }
  })
})

describe("calculateOpenDate", () => {
  it("should calculate the correct booking open date for a session on Monday with booking open on Friday", () => {
    // Session on Monday at 2 PM
    const startTime = new Date(Date.UTC(2024, 0, 15, 14, 0, 0)) // Monday
    const openDay = Weekday.FRIDAY
    const openTime = new Date(Date.UTC(2024, 0, 1, 9, 0, 0)) // 9 AM

    const result = calculateOpenDate(startTime, openDay, openTime)

    // Should be Friday before the session (Jan 12, 2024 at 9 AM)
    const expected = new Date(Date.UTC(2024, 0, 12, 9, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should calculate the correct booking open date for a session on Sunday with booking open on Wednesday", () => {
    // Session on Sunday at 3 PM
    const startTime = new Date(Date.UTC(2024, 0, 21, 15, 0, 0)) // Sunday
    const openDay = Weekday.WEDNESDAY
    const openTime = new Date(Date.UTC(2024, 0, 1, 10, 0, 0)) // 10 AM

    const result = calculateOpenDate(startTime, openDay, openTime)

    // Should be Wednesday before the session (Jan 17, 2024 at 10 AM)
    const expected = new Date(Date.UTC(2024, 0, 17, 10, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should calculate the correct booking open date when session and open day are the same", () => {
    // Session on Tuesday at 1 PM
    const startTime = new Date(Date.UTC(2024, 0, 16, 13, 0, 0)) // Tuesday
    const openDay = Weekday.TUESDAY
    const openTime = new Date(Date.UTC(2024, 0, 1, 8, 0, 0)) // 8 AM

    const result = calculateOpenDate(startTime, openDay, openTime)

    // Should be the same day as session (Jan 16, 2024 at 8 AM)
    const expected = new Date(Date.UTC(2024, 0, 16, 8, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should handle different time zones correctly", () => {
    // Session on Thursday at 6 PM
    const startTime = new Date(Date.UTC(2024, 0, 18, 18, 0, 0)) // Thursday
    const openDay = Weekday.MONDAY
    const openTime = new Date(Date.UTC(2024, 0, 1, 12, 0, 0)) // 12 PM

    const result = calculateOpenDate(startTime, openDay, openTime)

    // Should be Monday before the session (Jan 15, 2024 at 12 PM)
    const expected = new Date(Date.UTC(2024, 0, 15, 12, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should preserve the time from openTime parameter", () => {
    // Session on Saturday at 4 PM
    const startTime = new Date(Date.UTC(2024, 0, 20, 16, 0, 0)) // Saturday
    const openDay = Weekday.THURSDAY
    const openTime = new Date(Date.UTC(2024, 0, 1, 14, 30, 45)) // 2:30:45 PM

    const result = calculateOpenDate(startTime, openDay, openTime)

    // Should be Thursday before the session with exact time from openTime
    const expected = new Date(Date.UTC(2024, 0, 18, 14, 30, 45))
    expect(result).toEqual(expected)
  })
})
