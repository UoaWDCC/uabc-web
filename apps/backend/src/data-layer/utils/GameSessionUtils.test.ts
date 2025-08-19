import { MembershipType } from "@repo/shared"
import { casualUserMock, memberUserMock } from "@repo/shared/mocks"
import type { User } from "@repo/shared/payload-types"
import { bookingMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionMock } from "@/test-config/mocks/GameSession.mock"
import { gameSessionScheduleMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { countAttendees, getSessionProperties } from "./GameSessionUtils"

describe("GameSessionUtils", () => {
  describe("getSessionProperties", () => {
    it("should extract properties from gameSessionSchedule when available", () => {
      const sessionWithSchedule = {
        ...gameSessionMock,
        gameSessionSchedule: gameSessionScheduleMock,
        location: "Fallback Location",
        name: "Fallback Name",
      }

      const result = getSessionProperties(sessionWithSchedule)

      expect(result).toEqual({
        location: gameSessionScheduleMock.location,
        name: gameSessionScheduleMock.name,
      })
    })

    it("should fall back to session properties when gameSessionSchedule is not available", () => {
      const sessionWithoutSchedule = {
        ...gameSessionMock,
        gameSessionSchedule: null,
        location: "Fallback Location",
        name: "Fallback Name",
      }

      const result = getSessionProperties(sessionWithoutSchedule)

      expect(result).toEqual({
        location: "Fallback Location",
        name: "Fallback Name",
      })
    })

    it("should fall back to session properties when gameSessionSchedule is a string", () => {
      const sessionWithStringSchedule = {
        ...gameSessionMock,
        gameSessionSchedule: "schedule-id-string",
        location: "Fallback Location",
        name: "Fallback Name",
      }

      const result = getSessionProperties(sessionWithStringSchedule)

      expect(result).toEqual({
        location: "Fallback Location",
        name: "Fallback Name",
      })
    })

    it("should fall back to session properties when gameSessionSchedule is undefined", () => {
      const sessionWithUndefinedSchedule = {
        ...gameSessionMock,
        gameSessionSchedule: undefined,
        location: "Fallback Location",
        name: "Fallback Name",
      }

      const result = getSessionProperties(sessionWithUndefinedSchedule)

      expect(result).toEqual({
        location: "Fallback Location",
        name: "Fallback Name",
      })
    })
  })

  describe("countAttendees", () => {
    it("should count attendees and casual attendees correctly", () => {
      const bookings = [
        {
          ...bookingMock,
          id: "booking-1",
          user: casualUserMock,
          gameSession: "session-1",
        },
        {
          ...bookingMock,
          id: "booking-2",
          user: memberUserMock,
          gameSession: "session-1",
        },
        {
          ...bookingMock,
          id: "booking-3",
          user: casualUserMock,
          gameSession: "session-2",
        },
      ]

      const result = countAttendees(bookings)

      expect(result.get("session-1")).toEqual({
        attendees: 1, // member user
        casualAttendees: 1, // casual user
      })
      expect(result.get("session-2")).toEqual({
        attendees: 0,
        casualAttendees: 1, // casual user
      })
    })

    it("should handle bookings with gameSession as object", () => {
      const bookings = [
        {
          ...bookingMock,
          id: "booking-1",
          user: casualUserMock,
          gameSession: { ...gameSessionMock, id: "session-1" },
        },
        {
          ...bookingMock,
          id: "booking-2",
          user: memberUserMock,
          gameSession: { ...gameSessionMock, id: "session-1" },
        },
      ]

      const result = countAttendees(bookings)

      expect(result.get("session-1")).toEqual({
        attendees: 1, // member user
        casualAttendees: 1, // casual user
      })
    })

    it("should handle empty bookings array", () => {
      const result = countAttendees([])

      expect(result.size).toBe(0)
    })

    it("should handle bookings with multiple sessions", () => {
      const bookings = [
        {
          ...bookingMock,
          id: "booking-1",
          user: casualUserMock,
          gameSession: "session-1",
        },
        {
          ...bookingMock,
          id: "booking-2",
          user: memberUserMock,
          gameSession: "session-1",
        },
        {
          ...bookingMock,
          id: "booking-3",
          user: casualUserMock,
          gameSession: "session-2",
        },
        {
          ...bookingMock,
          id: "booking-4",
          user: memberUserMock,
          gameSession: "session-2",
        },
        {
          ...bookingMock,
          id: "booking-5",
          user: memberUserMock,
          gameSession: "session-3",
        },
      ]

      const result = countAttendees(bookings)

      expect(result.get("session-1")).toEqual({
        attendees: 1,
        casualAttendees: 1,
      })
      expect(result.get("session-2")).toEqual({
        attendees: 1,
        casualAttendees: 1,
      })
      expect(result.get("session-3")).toEqual({
        attendees: 1,
        casualAttendees: 0,
      })
    })

    it("should throw error when user is not an object", () => {
      const bookings = [
        {
          ...bookingMock,
          id: "booking-1",
          user: "invalid-user-string",
          gameSession: "session-1",
        },
      ]

      expect(() => countAttendees(bookings)).toThrow(
        "Invalid user object in booking booking-1: expected User object but got string",
      )
    })

    it("should throw error when user is undefined", () => {
      const bookings = [
        {
          ...bookingMock,
          id: "booking-1",
          user: undefined as unknown as User,
          gameSession: "session-1",
        },
      ]

      expect(() => countAttendees(bookings)).toThrow(
        "Invalid user object in booking booking-1: expected User object but got undefined",
      )
    })

    it("should handle user with casual role", () => {
      const casualUser = { ...casualUserMock, role: MembershipType.casual }
      const bookings = [
        {
          ...bookingMock,
          id: "booking-1",
          user: casualUser,
          gameSession: "session-1",
        },
      ]

      const result = countAttendees(bookings)

      expect(result.get("session-1")).toEqual({
        attendees: 0,
        casualAttendees: 1,
      })
    })

    it("should handle user with member role", () => {
      const memberUser = { ...memberUserMock, role: MembershipType.member }
      const bookings = [
        {
          ...bookingMock,
          id: "booking-1",
          user: memberUser,
          gameSession: "session-1",
        },
      ]

      const result = countAttendees(bookings)

      expect(result.get("session-1")).toEqual({
        attendees: 1,
        casualAttendees: 0,
      })
    })

    it("should handle user with admin role", () => {
      const adminUser = { ...memberUserMock, role: MembershipType.admin }
      const bookings = [
        {
          ...bookingMock,
          id: "booking-1",
          user: adminUser,
          gameSession: "session-1",
        },
      ]

      const result = countAttendees(bookings)

      expect(result.get("session-1")).toEqual({
        attendees: 1, // admin counts as regular attendee
        casualAttendees: 0,
      })
    })
  })
})
