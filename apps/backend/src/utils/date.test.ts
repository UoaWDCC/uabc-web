import { getDaysBetweenWeekdays, getGameSessionOpenDay, Weekday } from "@repo/shared"
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

describe("getGameSessionOpenDay", () => {
  it("should calculate the correct open date for a session on Monday with booking open on Friday", () => {
    const semester: Semester = {
      ...semesterMock,
      bookingOpenDay: Weekday.friday,
      bookingOpenTime: new Date(Date.UTC(1970, 0, 1, 9, 0, 0)).toISOString(), // 9 AM
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
      bookingOpenTime: new Date(Date.UTC(1970, 0, 1, 10, 0, 0)).toISOString(), // 10 AM
    }
    const startTime = new Date(Date.UTC(2024, 0, 21, 15, 0, 0)) // Sunday

    const result = getGameSessionOpenDay(semester, startTime)
    // Should be 4 days before (Jan 17, 2024 at 10 AM)
    const expected = new Date(Date.UTC(2024, 0, 17, 10, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should calculate the open date for the same day when session and open day are the same but open time is earlier", () => {
    const semester: Semester = {
      ...semesterMock,
      bookingOpenDay: Weekday.tuesday,
      bookingOpenTime: new Date(Date.UTC(1970, 0, 1, 8, 0, 0)).toISOString(), // 8 AM
    }
    const startTime = new Date(Date.UTC(2024, 0, 16, 13, 0, 0)) // Tuesday 1pm

    const result = getGameSessionOpenDay(semester, startTime)
    const expected = new Date(Date.UTC(2024, 0, 16, 8, 0, 0)) // Same day at 8 AM
    expect(result).toEqual(expected)
  })

  it("should calculate the open date a week earlier when session and open day are the same but open time is later", () => {
    const semester: Semester = {
      ...semesterMock,
      bookingOpenDay: Weekday.tuesday,
      bookingOpenTime: new Date(Date.UTC(1970, 0, 1, 8, 0, 0)).toISOString(), // 8 AM
    }
    const startTime = new Date(Date.UTC(2024, 0, 16, 7, 0, 0)) // Tuesday 7am

    const result = getGameSessionOpenDay(semester, startTime)
    const expected = new Date(Date.UTC(2024, 0, 9, 8, 0, 0))
    expect(result).toEqual(expected)
  })

  it("should preserve the time from bookingOpenTime parameter", () => {
    const semester: Semester = {
      ...semesterMock,
      bookingOpenDay: Weekday.thursday,
      bookingOpenTime: new Date(Date.UTC(1970, 0, 1, 14, 30, 45)).toISOString(), // 2:30:45 PM
    }
    const startTime = new Date(Date.UTC(2024, 0, 20, 16, 0, 0)) // Saturday

    const result = getGameSessionOpenDay(semester, startTime)
    const expected = new Date(Date.UTC(2024, 0, 18, 14, 30, 45)) // Thursday
    expect(result).toEqual(expected)
  })

  it("should handle bookingOpenTime as a string", () => {
    const semester: Semester = {
      ...semesterMock,
      bookingOpenDay: Weekday.monday,
      bookingOpenTime: "1970-01-01T12:00:00.000Z", // 12 PM
    }
    const startTime = new Date(Date.UTC(2024, 0, 18, 18, 0, 0)) // Thursday

    const result = getGameSessionOpenDay(semester, startTime)
    // Should be 3 days before (Jan 15, 2024 at 12 PM)
    const expected = new Date(Date.UTC(2024, 0, 15, 12, 0, 0)) // Monday
    expect(result).toEqual(expected)
  })
})
