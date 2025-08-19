import {
  calculateOpenDate,
  getDaysBetweenWeekdays,
  getGameSessionOpenDay,
  Weekday,
} from "@repo/shared"
import { semesterMock } from "@repo/shared/mocks"
import type { Semester } from "@repo/shared/payload-types"

describe("getDaysBetweenWeekdays", () => {
  it("should return 0 when fromDay and toDay are the same", () => {
    expect(getDaysBetweenWeekdays(Weekday.monday, Weekday.monday)).toBe(0)
    expect(getDaysBetweenWeekdays(Weekday.sunday, Weekday.sunday)).toBe(0)
  })

  it("should return correct days for consecutive days", () => {
    expect(getDaysBetweenWeekdays(Weekday.monday, Weekday.tuesday)).toBe(1)
    expect(getDaysBetweenWeekdays(Weekday.tuesday, Weekday.wednesday)).toBe(1)
    expect(getDaysBetweenWeekdays(Weekday.saturday, Weekday.sunday)).toBe(1)
  })

  it("should return correct days for days that wrap around the week", () => {
    expect(getDaysBetweenWeekdays(Weekday.sunday, Weekday.monday)).toBe(1)
    expect(getDaysBetweenWeekdays(Weekday.saturday, Weekday.monday)).toBe(2)
    expect(getDaysBetweenWeekdays(Weekday.friday, Weekday.monday)).toBe(3)
  })

  it("should return correct days for reverse direction", () => {
    expect(getDaysBetweenWeekdays(Weekday.tuesday, Weekday.monday)).toBe(6)
    expect(getDaysBetweenWeekdays(Weekday.monday, Weekday.sunday)).toBe(6)
    expect(getDaysBetweenWeekdays(Weekday.wednesday, Weekday.monday)).toBe(5)
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
    const openDay = Weekday.friday
    const openTime = new Date(Date.UTC(2024, 0, 1, 9, 0, 0)) // 9 AM

    const result = calculateOpenDate(startTime, openDay, openTime)

    // Should be Friday before the session (Jan 12, 2024 at 9 AM)
    const expected = new Date(Date.UTC(2024, 0, 12, 9, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should calculate the correct booking open date for a session on Sunday with booking open on Wednesday", () => {
    // Session on Sunday at 3 PM
    const startTime = new Date(Date.UTC(2024, 0, 21, 15, 0, 0)) // Sunday
    const openDay = Weekday.wednesday
    const openTime = new Date(Date.UTC(2024, 0, 1, 10, 0, 0)) // 10 AM

    const result = calculateOpenDate(startTime, openDay, openTime)

    // Should be Wednesday before the session (Jan 17, 2024 at 10 AM)
    const expected = new Date(Date.UTC(2024, 0, 17, 10, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should calculate the correct booking open date when session and open day are the same", () => {
    // Session on Tuesday at 1 PM
    const startTime = new Date(Date.UTC(2024, 0, 16, 13, 0, 0)) // Tuesday
    const openDay = Weekday.tuesday
    const openTime = new Date(Date.UTC(2024, 0, 1, 8, 0, 0)) // 8 AM

    const result = calculateOpenDate(startTime, openDay, openTime)

    // Should be the same day as session (Jan 16, 2024 at 8 AM)
    const expected = new Date(Date.UTC(2024, 0, 16, 8, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should handle different time zones correctly", () => {
    // Session on Thursday at 6 PM
    const startTime = new Date(Date.UTC(2024, 0, 18, 18, 0, 0)) // Thursday
    const openDay = Weekday.monday
    const openTime = new Date(Date.UTC(2024, 0, 1, 12, 0, 0)) // 12 PM

    const result = calculateOpenDate(startTime, openDay, openTime)

    // Should be Monday before the session (Jan 15, 2024 at 12 PM)
    const expected = new Date(Date.UTC(2024, 0, 15, 12, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should preserve the time from openTime parameter", () => {
    // Session on Saturday at 4 PM
    const startTime = new Date(Date.UTC(2024, 0, 20, 16, 0, 0)) // Saturday
    const openDay = Weekday.thursday
    const openTime = new Date(Date.UTC(2024, 0, 1, 14, 30, 45)) // 2:30:45 PM

    const result = calculateOpenDate(startTime, openDay, openTime)

    // Should be Thursday before the session with exact time from openTime
    const expected = new Date(Date.UTC(2024, 0, 18, 14, 30, 45))
    expect(result).toEqual(expected)
  })
})

describe("getGameSessionOpenDay", () => {
  it("should calculate the correct open date for a session on Monday with booking open on Friday", () => {
    const semester: Semester = {
      ...semesterMock,
      bookingOpenDay: Weekday.friday,
      bookingOpenTime: new Date(Date.UTC(2024, 0, 1, 9, 0, 0)).toISOString(), // 9 AM
    }
    const startTime = new Date(Date.UTC(2024, 0, 15, 14, 0, 0)) // Monday

    const result = getGameSessionOpenDay(semester, startTime)
    const expected = new Date(Date.UTC(2024, 0, 12, 9, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should calculate the correct open date for a session on Sunday with booking open on Wednesday", () => {
    const semester: Semester = {
      ...semesterMock,
      bookingOpenDay: Weekday.wednesday,
      bookingOpenTime: new Date(Date.UTC(2024, 0, 1, 10, 0, 0)).toISOString(), // 10 AM
    }
    const startTime = new Date(Date.UTC(2024, 0, 21, 15, 0, 0)) // Sunday

    const result = getGameSessionOpenDay(semester, startTime)
    const expected = new Date(Date.UTC(2024, 0, 17, 10, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should calculate the correct open date when session and open day are the same", () => {
    const semester: Semester = {
      ...semesterMock,
      bookingOpenDay: Weekday.tuesday,
      bookingOpenTime: new Date(Date.UTC(2024, 0, 1, 8, 0, 0)).toISOString(), // 8 AM
    }
    const startTime = new Date(Date.UTC(2024, 0, 16, 13, 0, 0)) // Tuesday

    const result = getGameSessionOpenDay(semester, startTime)
    const expected = new Date(Date.UTC(2024, 0, 16, 8, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should preserve the time from bookingOpenTime parameter", () => {
    const semester: Semester = {
      ...semesterMock,
      bookingOpenDay: Weekday.thursday,
      bookingOpenTime: new Date(Date.UTC(2024, 0, 1, 14, 30, 45)).toISOString(), // 2:30:45 PM
    }
    const startTime = new Date(Date.UTC(2024, 0, 20, 16, 0, 0)) // Saturday

    const result = getGameSessionOpenDay(semester, startTime)
    const expected = new Date(Date.UTC(2024, 0, 18, 14, 30, 45)) // Thursday before
    expect(result).toEqual(expected)
  })

  it("should handle bookingOpenTime as a string", () => {
    const semester: Semester = {
      ...semesterMock,
      bookingOpenDay: Weekday.monday,
      bookingOpenTime: "2024-01-01T12:00:00.000Z",
    }
    const startTime = new Date(Date.UTC(2024, 0, 18, 18, 0, 0)) // Thursday

    const result = getGameSessionOpenDay(semester, startTime)
    const expected = new Date(Date.UTC(2024, 0, 15, 12, 0, 0)) // Monday before
    expect(result).toEqual(expected)
  })
})
