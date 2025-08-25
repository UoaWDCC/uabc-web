import type { Weekday } from "@repo/shared"
import { gameSessionScheduleMock, semesterMock } from "@repo/shared/mocks"
import { describe, expect, it } from "vitest"
import {
  createGameSessionTimes,
  getVerificationCodeCoolDownDate,
  getVerificationCodeExpiryDate,
  getWeeklySessionDates,
} from "./DateUtils"

describe("DateUtils", () => {
  describe("getWeeklySessionDates", () => {
    it("returns correct weekly dates excluding mid-semester break", async () => {
      const semester = {
        ...semesterMock,
        startDate: "2025-03-01", // Saturday
        endDate: "2025-04-05", // Saturday
        breakStart: "2025-03-15",
        breakEnd: "2025-03-21",
      }

      const result = getWeeklySessionDates("monday" as Weekday, semester)

      const expected = [
        new Date("2025-03-03"), // before break
        new Date("2025-03-10"),
        new Date("2025-03-24"), // after break
        new Date("2025-03-31"),
      ]

      expect(result.map((d: Date) => d.toISOString().split("T")[0])).toEqual(
        expected.map((d) => d.toISOString().split("T")[0]),
      )
    })

    it("returns empty array if no sessions fall outside break", () => {
      const semester = {
        ...semesterMock,
        startDate: "2025-03-01",
        endDate: "2025-03-10",
        breakStart: "2025-03-01",
        breakEnd: "2025-03-10",
      }

      const result = getWeeklySessionDates("monday" as Weekday, semester)
      expect(result).toEqual([])
    })
  })

  describe("createGameSessionTimes", () => {
    it("creates correct start and end timestamps from given date and schedule", () => {
      const schedule = {
        ...gameSessionScheduleMock,
        startTime: "2025-01-01T18:00:00.000Z",
        endTime: "2025-01-01T20:00:00.000Z",
        day: "monday" as Weekday,
      }

      const date = new Date("2025-03-10T00:00:00.000Z") // Monday

      const result = createGameSessionTimes(schedule, date)

      expect(result).toEqual({
        startTime: "2025-03-10T18:00:00.000Z",
        endTime: "2025-03-10T20:00:00.000Z",
      })
    })

    it("handles different date and keeps time from schedule", () => {
      const schedule = {
        ...gameSessionScheduleMock,
        startTime: "2025-01-01T09:30:00.000Z",
        endTime: "2025-01-01T11:00:00.000Z",
        day: "wednesday" as Weekday,
      }

      const date = new Date("2025-03-12T00:00:00.000Z") // Wednesday

      const result = createGameSessionTimes(schedule, date)

      expect(result).toEqual({
        startTime: "2025-03-12T09:30:00.000Z",
        endTime: "2025-03-12T11:00:00.000Z",
      })
    })
  })

  describe("getVerificationCodeExpiryDate", () => {
    it("returns a date 10 minutes from now", () => {
      const now = new Date()
      const expiryDate = getVerificationCodeExpiryDate(now)

      expect(expiryDate instanceof Date).toBe(true)
      expect(expiryDate.getTime()).toEqual(now.getTime() + 10 * 60 * 1000)
    })

    it("handles no parameter", () => {
      const now = new Date()
      const expiryDate = getVerificationCodeExpiryDate()

      expect(expiryDate instanceof Date).toBe(true)
      expect(expiryDate.getTime()).toBeGreaterThanOrEqual(now.getTime() + 10 * 59 * 1000) // Allowing 1 second
      expect(expiryDate.getTime()).toBeLessThanOrEqual(now.getTime() + 10 * 61 * 1000) // Allowing 1 second
    })
  })

  describe("getVerificationCodeCoolDownDate", () => {
    it("returns a date 5 minutes from now", () => {
      const now = new Date()
      const coolDownDate = getVerificationCodeCoolDownDate(now)

      expect(coolDownDate instanceof Date).toBe(true)
      expect(coolDownDate.getTime()).toEqual(now.getTime() + 5 * 60 * 1000)
    })

    it("handles no parameters", () => {
      const now = new Date()
      const coolDownDate = getVerificationCodeCoolDownDate()

      expect(coolDownDate instanceof Date).toBe(true)
      expect(coolDownDate.getTime()).toBeGreaterThanOrEqual(now.getTime() + 5 * 59 * 1000) // Allowing 1
      expect(coolDownDate.getTime()).toBeLessThanOrEqual(now.getTime() + 5 * 61 * 1000) // Allowing 1 second
    })
  })
})
