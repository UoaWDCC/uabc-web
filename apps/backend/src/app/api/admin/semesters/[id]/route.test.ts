import { AUTH_COOKIE_NAME } from "@repo/shared"
import { gameSessionMock, gameSessionScheduleMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { DELETE, PATCH } from "./route"

describe("/api/admin/semesters/[id]", async () => {
  const semesterDataService = new SemesterDataService()
  const gameSessionDataService = new GameSessionDataService()
  const bookingDataService = new BookingDataService()

  const cookieStore = await cookies()

  describe("DELETE", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should delete semester if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(semesterDataService.getSemesterById(newSemester.id)).rejects.toThrow("Not Found")
    })

    it("should delete semester and related documents if user is admin and deleteRelatedDocs is true", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule({
        ...gameSessionScheduleMock,
        semester: newSemester,
      })
      const newGameSession = await gameSessionDataService.createGameSession({
        ...gameSessionMock,
        gameSessionSchedule: newGameSessionSchedule,
      })
      const newBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: newGameSession,
      })

      const res = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(semesterDataService.getSemesterById(newSemester.id)).rejects.toThrow("Not Found")
      await expect(
        gameSessionDataService.getGameSessionScheduleById(newGameSessionSchedule.id),
      ).rejects.toThrow("Not Found")
      await expect(gameSessionDataService.getGameSessionById(newGameSession.id)).rejects.toThrow(
        "Not Found",
      )
      await expect(bookingDataService.getBookingById(newBooking.id)).rejects.toThrow("Not Found")
    })

    it("should return 404 if semester is non-existent", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: "non-existent" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toEqual("Semester not found")
    })

    it("should handle errors and return 500 status", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      vi.spyOn(SemesterDataService.prototype, "deleteSemester").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const res = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: "test" }),
      })

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })

    it("should rollback transaction if error occurs in transaction", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule({
        ...gameSessionScheduleMock,
        semester: newSemester,
      })
      const newGameSession = await gameSessionDataService.createGameSession({
        ...gameSessionMock,
        gameSessionSchedule: newGameSessionSchedule,
      })
      const newBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: newGameSession,
      })

      vi.spyOn(SemesterDataService.prototype, "deleteRelatedDocsForSemester").mockRejectedValueOnce(
        new Error("Cascade deletion failed"),
      )

      await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: "test" }),
      })

      const existingSemester = await semesterDataService.getSemesterById(newSemester.id)
      const existingGameSessionSchedule = await gameSessionDataService.getGameSessionScheduleById(
        newGameSessionSchedule.id,
      )
      const existingGameSession = await gameSessionDataService.getGameSessionById(newGameSession.id)
      const existingBooking = await bookingDataService.getBookingById(newBooking.id)
      expect(existingSemester).toBeDefined()
      expect(existingGameSessionSchedule).toBeDefined()
      expect(existingGameSession).toBeDefined()
      expect(existingBooking).toBeDefined()
    })
  })

  describe("PATCH", () => {
    it("should return a 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await PATCH({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return a 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await PATCH({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should update semester if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const updateSemester = { name: "Semester 2 2025" }

      const res = await PATCH(createMockNextRequest("", "PATCH", updateSemester), {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      const fetchedUpdatedSemester = await semesterDataService.getSemesterById(newSemester.id)
      expect(fetchedUpdatedSemester.name).toEqual(updateSemester.name)
    })

    it("should return 400 when invalid request body", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await PATCH(
        createMockNextRequest("", "PATCH", { ...semesterCreateMock, bookingOpenDay: "day" }),
        { params: Promise.resolve({ id: newSemester.id }) },
      )

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.bookingOpenDay[0]).toEqual(
        "Invalid enum value. Expected 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday', received 'day'",
      )
    })

    it("should return a 404 error if the semester does not exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await PATCH(createMockNextRequest("", "PATCH", { name: "Updated Semester" }), {
        params: Promise.resolve({ id: "does not exist" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toEqual("Semester not found")
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await PATCH(createMockNextRequest("", "PATCH", { name: "Something" }), {
        params: Promise.reject(new Error("Param parsing failed")),
      })

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual("Internal Server Error")
    })
  })
})
