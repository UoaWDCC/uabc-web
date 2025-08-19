import { AUTH_COOKIE_NAME, Weekday } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { POST } from "./route"

describe("api/admin/game-sessions", async () => {
  const gameSessionDataService = new GameSessionDataService()
  const semesterDataService = new SemesterDataService()
  const cookieStore = await cookies()

  describe("POST", () => {
    it("should return a 401 status if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const res = await POST(createMockNextRequest("", "POST", gameSessionCreateMock))

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return a 401 status if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const res = await POST(createMockNextRequest("", "POST", gameSessionCreateMock))

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should allow admins to create a game session", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const semester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await POST(
        createMockNextRequest("", "POST", { ...gameSessionCreateMock, semester }),
      )

      expect(res.status).toBe(StatusCodes.CREATED)
      const data = (await res.json()).data
      const fetchedGameSession = await gameSessionDataService.getGameSessionById(data.id)
      expect(data).toEqual(fetchedGameSession)
      // Ensure that the openTime field is also correct
      const openDate = new Date(fetchedGameSession.openTime)
      const semesterBookingOpenDay = Object.values(Weekday).indexOf(
        semester.bookingOpenDay as Weekday,
      )
      const semesterBookingOpenTime = new Date(semester.bookingOpenTime)
      expect(openDate.getUTCDay() === semesterBookingOpenDay).toBe(true)
      expect(openDate.getUTCHours() === semesterBookingOpenTime.getUTCHours()).toBe(true)
      expect(openDate.getUTCMinutes() === semesterBookingOpenTime.getUTCMinutes()).toBe(true)
    })

    it("should return a 400 status when request body is invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await POST(
        createMockNextRequest("", "POST", {
          ...gameSessionCreateMock,
          capacity: undefined,
        }),
      )

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.capacity[0]).toEqual("Required")
    })

    it("should raise an error if invalid date is used", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await POST(
        createMockNextRequest("", "POST", {
          ...gameSessionCreateMock,
          startTime: "NOT A DATE",
        }),
      )

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.startTime[0]).toEqual(
        "Invalid date format, should be in ISO 8601 format",
      )
    })

    it("should return a 500 for an internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      vi.spyOn(GameSessionDataService.prototype, "createGameSession").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const res = await POST(createMockNextRequest("", "POST", gameSessionCreateMock))

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual("Internal Server Error")
    })
  })
})
