import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { POST } from "./route"

describe("/api/admin/game-session-schedules", async () => {
  const gameSessionDataService = new GameSessionDataService()
  const cookieStore = await cookies()

  describe("POST", () => {
    it("should return 401 if user is casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const req = createMockNextRequest(
        "/api/admin/game-session-schedules",
        "POST",
        gameSessionScheduleCreateMock,
      )
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const req = createMockNextRequest(
        "/api/admin/game-session-schedules",
        "POST",
        gameSessionScheduleCreateMock,
      )
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should create game session schedule if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextRequest(
        "/api/admin/game-session-schedules",
        "POST",
        gameSessionScheduleCreateMock,
      )
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.CREATED)

      const json = await res.json()
      const fetchedGameSessionSchedule = await gameSessionDataService.getGameSessionScheduleById(
        json.data.id,
      )
      expect(json.data).toEqual(fetchedGameSessionSchedule)
    })

    it("should return 400 if request body is invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextRequest("/api/admin/game-session-schedules", "POST", {
        ...gameSessionScheduleCreateMock,
        name: undefined,
      })
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)

      const json = await res.json()
      expect(json.error).toBe("Invalid request body")
      expect(json.details).toBeDefined()
    })

    it("should return 400 if invalid date is provided", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextRequest("/api/admin/game-session-schedules", "POST", {
        ...gameSessionScheduleCreateMock,
        startTime: "invalid date",
      })
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)

      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.startTime[0]).toEqual(
        "Invalid date format, should be in ISO 8601 format",
      )
    })
  })
})
