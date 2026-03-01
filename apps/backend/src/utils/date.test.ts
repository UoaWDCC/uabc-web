import {
  formatDate,
  formatTime,
  GameSessionStatus,
  getDateTimeStatus,
  getDaysBetweenWeekdays,
  getGameSessionOpenDay,
  isoToTimeInput,
  isSameDate,
  Weekday,
} from "@repo/shared"
import { semesterMock } from "@repo/shared/mocks"
import type { Semester } from "@repo/shared/payload-types"
import { vi } from "vitest"

describe("isoToTimeInput", () => {
  it("should return empty string for undefined", () => {
    expect(isoToTimeInput(undefined)).toBe("")
  })

  it("should return empty string for empty string", () => {
    expect(isoToTimeInput("")).toBe("")
  })

  it("should return empty string for an invalid date string", () => {
    expect(isoToTimeInput("not-a-date")).toBe("")
  })

  it("should format a UTC morning time correctly", () => {
    expect(isoToTimeInput("2024-01-01T09:30:00.000Z")).toBe("09:30")
  })

  it("should format a UTC afternoon time correctly", () => {
    expect(isoToTimeInput("2024-01-01T14:05:00.000Z")).toBe("14:05")
  })

  it("should format midnight correctly", () => {
    expect(isoToTimeInput("2024-01-01T00:00:00.000Z")).toBe("00:00")
  })

  it("should format the end of day correctly", () => {
    expect(isoToTimeInput("2024-01-01T23:59:00.000Z")).toBe("23:59")
  })

  it("should pad single-digit hours and minutes with a leading zero", () => {
    expect(isoToTimeInput("2024-06-15T08:05:00.000Z")).toBe("08:05")
  })

  it("should use UTC time regardless of the date's timezone offset", () => {
    expect(isoToTimeInput("2024-01-01T09:00:00+05:00")).toBe("04:00")
  })
})

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

describe("isSameDate", () => {
  it("should return true for dates on the same day with different times", () => {
    const date1 = new Date("2024-01-15T10:30:00Z")
    const date2 = new Date("2024-01-15T15:45:00Z")
    expect(isSameDate(date1, date2)).toBe(true)
  })

  it("should return false for dates on different days", () => {
    const date1 = new Date("2024-01-15T10:30:00Z")
    const date2 = new Date("2024-01-16T10:30:00Z")
    expect(isSameDate(date1, date2)).toBe(false)
  })

  it("should handle string dates", () => {
    const date1 = "2024-01-15T10:30:00Z"
    const date2 = "2024-01-15T15:45:00Z"
    expect(isSameDate(date1, date2)).toBe(true)
  })

  it("should handle mixed date types (Date and string)", () => {
    const date1 = new Date("2024-01-15T10:30:00Z")
    const date2 = "2024-01-15T15:45:00Z"
    expect(isSameDate(date1, date2)).toBe(true)
  })

  it("should handle timestamp numbers", () => {
    const date1 = new Date("2024-01-15T10:30:00Z").getTime()
    const date2 = new Date("2024-01-15T15:45:00Z").getTime()
    expect(isSameDate(date1, date2)).toBe(true)
  })

  it("should be timezone-safe", () => {
    // Same moment in time, different timezone representations
    const date1 = new Date("2024-01-15T10:30:00Z") // UTC
    const date2 = new Date("2024-01-15T11:30:00+01:00") // UTC+1
    expect(isSameDate(date1, date2)).toBe(true)
  })

  it("should handle edge cases around midnight", () => {
    const date1 = new Date("2024-01-15T23:59:59Z")
    const date2 = new Date("2024-01-15T00:00:01Z")
    expect(isSameDate(date1, date2)).toBe(true)
  })

  it("should return false for dates across month boundaries", () => {
    const date1 = new Date("2024-01-31T23:59:59Z")
    const date2 = new Date("2024-02-01T00:00:01Z")
    expect(isSameDate(date1, date2)).toBe(false)
  })

  it("should return false for dates across year boundaries", () => {
    const date1 = new Date("2023-12-31T23:59:59Z")
    const date2 = new Date("2024-01-01T00:00:01Z")
    expect(isSameDate(date1, date2)).toBe(false)
  })
})

describe("formatTime", () => {
  it("should format morning time correctly", () => {
    expect(formatTime("2025-01-21T09:30:00Z")).toBe("9:30 AM")
  })

  it("should format afternoon time correctly", () => {
    expect(formatTime("2025-01-21T14:30:00Z")).toBe("2:30 PM")
  })

  it("should format evening time correctly", () => {
    expect(formatTime("2025-01-21T19:30:00Z")).toBe("7:30 PM")
  })

  it("should format midnight correctly", () => {
    expect(formatTime("2025-01-21T00:00:00Z")).toBe("12:00 AM")
  })

  it("should format noon correctly", () => {
    expect(formatTime("2025-01-21T12:00:00Z")).toBe("12:00 PM")
  })

  it("should handle different timezone formats", () => {
    expect(formatTime("2025-01-21T19:30:00+00:00")).toBe("7:30 PM")
    expect(formatTime("2025-01-21T19:30:00.000Z")).toBe("7:30 PM")
  })
})

describe("formatDate", () => {
  it("should format date correctly", () => {
    expect(formatDate(new Date("2025-01-21T19:30:00Z"))).toBe("Tuesday, 21/01/25")
  })

  it("should format different dates correctly", () => {
    expect(formatDate(new Date("2025-12-25T12:00:00Z"))).toBe("Thursday, 25/12/25")
    expect(formatDate(new Date("2025-06-15T09:30:00Z"))).toBe("Sunday, 15/06/25")
  })
})

describe("getDateTimeStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should return UPCOMING when now is before startTime", () => {
    const startTime = "2025-01-21T10:00:00Z" // Session starts at 10:00 AM UTC on Jan 21, 2025
    const endTime = "2025-01-21T12:00:00Z" // Session ends at 12:00 PM UTC on Jan 21, 2025
    vi.setSystemTime(new Date("2025-01-20T10:00:00Z")) // Set current time to 10:00 AM UTC on Jan 20, 2025 (before start time)
    expect(getDateTimeStatus(startTime, endTime)).toBe(GameSessionStatus.UPCOMING)
  })

  it("should return ONGOING when now is between startTime and endTime", () => {
    const startTime = "2025-01-21T10:00:00Z" // Session starts at 10:00 AM UTC on Jan 21, 2025
    const endTime = "2025-01-21T12:00:00Z" // Session ends at 12:00 PM UTC on Jan 21, 2025
    vi.setSystemTime(new Date("2025-01-21T11:00:00Z")) // Set current time to 11:00 AM UTC on Jan 21, 2025 (during session)
    expect(getDateTimeStatus(startTime, endTime)).toBe(GameSessionStatus.ONGOING)
  })

  it("should return PAST when now is after endTime", () => {
    const startTime = "2025-01-21T10:00:00Z" // Session starts at 10:00 AM UTC on Jan 21, 2025
    const endTime = "2025-01-21T12:00:00Z" // Session ends at 12:00 PM UTC on Jan 21, 2025
    vi.setSystemTime(new Date("2025-01-21T13:00:00Z")) // Set current time to 1:00 PM UTC on Jan 21, 2025 (after end time)
    expect(getDateTimeStatus(startTime, endTime)).toBe(GameSessionStatus.PAST)
  })

  it("should return ONGOING when now is exactly at startTime", () => {
    const startTime = "2025-01-21T10:00:00Z" // Session starts at 10:00 AM UTC on Jan 21, 2025
    const endTime = "2025-01-21T12:00:00Z" // Session ends at 12:00 PM UTC on Jan 21, 2025
    vi.setSystemTime(new Date("2025-01-21T10:00:00Z")) // Set current time to exactly 10:00 AM UTC on Jan 21, 2025 (start of session)
    expect(getDateTimeStatus(startTime, endTime)).toBe(GameSessionStatus.ONGOING)
  })

  it("should return ONGOING when now is exactly at endTime", () => {
    const startTime = "2025-01-21T10:00:00Z" // Session starts at 10:00 AM UTC on Jan 21, 2025
    const endTime = "2025-01-21T12:00:00Z" // Session ends at 12:00 PM UTC on Jan 21, 2025
    vi.setSystemTime(new Date("2025-01-21T12:00:00Z")) // Set current time to exactly 12:00 PM UTC on Jan 21, 2025 (end of session)
    expect(getDateTimeStatus(startTime, endTime)).toBe(GameSessionStatus.ONGOING)
  })

  it("should handle startTime and endTime on different days", () => {
    const startTime = "2025-01-20T22:00:00Z" // Session starts at 10:00 PM UTC on Jan 20, 2025
    const endTime = "2025-01-21T02:00:00Z" // Session ends at 2:00 AM UTC on Jan 21, 2025
    vi.setSystemTime(new Date("2025-01-21T01:00:00Z")) // Set current time to 1:00 AM UTC on Jan 21, 2025 (during multi-day session)
    expect(getDateTimeStatus(startTime, endTime)).toBe(GameSessionStatus.ONGOING)
  })
})
