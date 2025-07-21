import { AUTH_COOKIE_NAME } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { GET, POST } from "./route"

describe("/api/admin/game-session-schedules", async () => {
  const gameSessionDataService = new GameSessionDataService()
  const cookieStore = await cookies()

  describe("GET", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const res = await GET(
        createMockNextRequest("/api/admin/game-session-schedules?limit=5&page=1"),
      )

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const res = await GET(
        createMockNextRequest("/api/admin/game-session-schedules?limit=5&page=1"),
      )

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return paginated schedules for admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const schedulesToCreate = Array.from({ length: 15 }, (_, i) => ({
        ...gameSessionScheduleCreateMock,
        email: `user${i}@test.com`,
      }))
      await Promise.all(
        schedulesToCreate.map((s) => gameSessionDataService.createGameSessionSchedule(s)),
      )
      const res = await GET(
        createMockNextRequest("/api/admin/game-session-schedules?limit=10&page=2"),
      )
      const json = await res.json()

      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data.docs.length).toBeLessThanOrEqual(10)
      expect(json.data.page).toBe(2)
      expect(json.data.limit).toBe(10)
      expect(json.data.totalDocs).toBeGreaterThanOrEqual(15)
      expect(json.data.totalPages).toBeGreaterThanOrEqual(2)
    })

    it("should use default pagination if params are missing", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await GET(createMockNextRequest(""))
      const json = await res.json()

      expect(res.status).toBe(StatusCodes.OK)
      expect(json.data.page).toBe(1)
      expect(json.data.limit).toBe(10)
    })

    it("should return 400 if limit or page is out of range", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await GET(
        createMockNextRequest("/api/admin/game-session-schedules?limit=999&page=-5"),
      )
      const json = await res.json()

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(json.error).toBe("Invalid query parameters")
      expect(json.details).toBeDefined()
    })

    it("should handle errors and return 500 status", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      vi.spyOn(
        GameSessionDataService.prototype,
        "getPaginatedGameSessionSchedules",
      ).mockRejectedValueOnce(new Error("Database error"))

      const res = await GET(
        createMockNextRequest("/api/admin/game-session-schedules?limit=10&page=1"),
      )

      const json = await res.json()
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })

  describe("POST", () => {
    it("should return 401 if user is casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const res = await POST(createMockNextRequest("", "POST", gameSessionScheduleCreateMock))

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const res = await POST(createMockNextRequest("", "POST", gameSessionScheduleCreateMock))

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should create game session schedule if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await POST(createMockNextRequest("", "POST", gameSessionScheduleCreateMock))
      const json = await res.json()

      const fetchedGameSessionSchedule = await gameSessionDataService.getGameSessionScheduleById(
        json.data.id,
      )
      expect(res.status).toBe(StatusCodes.CREATED)
      expect(json.data).toEqual(fetchedGameSessionSchedule)
    })

    it("should return 400 if request body is invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await POST(
        createMockNextRequest("", "POST", {
          ...gameSessionScheduleCreateMock,
          day: undefined,
        }),
      )
      const json = await res.json()

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(json.error).toBe("Invalid request body")
      expect(json.details).toBeDefined()
    })

    it("should return 400 if invalid date is provided", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await POST(
        createMockNextRequest("", "POST", {
          ...gameSessionScheduleCreateMock,
          startTime: "invalid-date",
        }),
      )
      const json = await res.json()

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.startTime[0]).toEqual(
        "Invalid date format, should be in ISO 8601 format",
      )
    })

    it("should return 500 for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      vi.spyOn(GameSessionDataService.prototype, "createGameSessionSchedule").mockRejectedValueOnce(
        new Error("Database error"),
      )
      const res = await POST(createMockNextRequest("", "POST", gameSessionScheduleCreateMock))

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })
})
