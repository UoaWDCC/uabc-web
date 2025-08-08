import { getReasonPhrase, StatusCodes } from "http-status-codes"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { GET } from "./route"

describe("/api/game-sessions", async () => {
  const gameSessionDataService = new GameSessionDataService()

  describe("GET", () => {
    it("should return paginated game sessions", async () => {
      const gameSessionsToCreate = Array.from({ length: 15 }, (_, _i) => ({
        ...gameSessionCreateMock,
      }))
      await Promise.all(
        gameSessionsToCreate.map((u) => gameSessionDataService.createGameSession(u)),
      )

      const req = createMockNextRequest("/api/admin/game-sessions?limit=10&page=2")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.docs.length).toBeLessThanOrEqual(10)
      expect(json.data.page).toBe(2)
      expect(json.data.limit).toBe(10)
      expect(json.data.totalDocs).toBeGreaterThanOrEqual(15)
      expect(json.data.totalPages).toBeGreaterThanOrEqual(2)
    })

    it("should use default pagination if params are not specified", async () => {
      const req = createMockNextRequest("/api/game-sessions")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.page).toBe(1)
      expect(json.data.limit).toBe(10)
    })

    it("should return 400 if limit or page is out of range", async () => {
      const req = createMockNextRequest("/api/game-sessions?limit=999&page=-5")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toBe("Invalid query parameters")
      expect(json.details).toBeDefined()
    })

    it("should return 400 if query params are invalid", async () => {
      const req = createMockNextRequest("/api/game-sessions?limit=abc&page=def")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toBe("Invalid query parameters")
      expect(json.details).toBeDefined()
    })

    it("should handle errors and return 500 status", async () => {
      vi.spyOn(GameSessionDataService.prototype, "getPaginatedGameSessions").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const req = createMockNextRequest("/api/game-sessions?limit=10&page=1")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })

    it("should return paginated game sessions with normalized fields from schedules", async () => {
      // Create a game session schedule
      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )

      // Create a game session linked to the schedule with empty name/location
      const gameSessionWithSchedule = {
        ...gameSessionCreateMock,
        gameSessionSchedule: newGameSessionSchedule.id,
        name: null,
        location: null,
      }
      await gameSessionDataService.createGameSession(gameSessionWithSchedule)

      // Call the API route
      const req = createMockNextRequest("/api/game-sessions?limit=10&page=1")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()

      // Find the game session with our schedule
      const sessionWithSchedule = json.data.docs.find(
        (doc: any) => doc.gameSessionSchedule?.id === newGameSessionSchedule.id,
      )

      // Verify that the response contains normalized fields from the schedule
      expect(sessionWithSchedule).toBeDefined()
      expect(sessionWithSchedule.name).toBe(gameSessionScheduleCreateMock.name)
      expect(sessionWithSchedule.location).toBe(gameSessionScheduleCreateMock.location)
    })
  })
})
