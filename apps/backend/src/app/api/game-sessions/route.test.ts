import type { GameSession, GameSessionSchedule } from "@repo/shared/payload-types"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import {
  gameSessionCreateMock,
  oneOffGameSessionCreateMock,
} from "@/test-config/mocks/GameSession.mock"
import { gameSessionScheduleMock } from "@/test-config/mocks/GameSessionSchedule.mock"
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

    it("should normalise a game session's name/location with parent schedule's values", async () => {
      // Create a schedule with specific name/location
      const schedule =
        await gameSessionDataService.createGameSessionSchedule(gameSessionScheduleMock)

      await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        gameSessionSchedule: schedule,
        name: "this should not be the name",
        location: "this should not be the location",
      })

      const req = createMockNextRequest("/api/game-sessions?limit=10&page=1")
      const res = await GET(req)
      const json = await res.json()

      const found = json.data.docs.find(
        (doc: GameSession) => (doc.gameSessionSchedule as GameSessionSchedule)?.id === schedule.id,
      )
      expect(found).toBeDefined()
      expect(found.name).toBe(gameSessionScheduleMock.name)
      expect(found.location).toBe(gameSessionScheduleMock.location)
    })

    it("should set name/location to null if schedule is not found", async () => {
      await gameSessionDataService.createGameSession({
        ...oneOffGameSessionCreateMock,
        gameSessionSchedule: gameSessionScheduleMock.id,
      })

      const req = createMockNextRequest("/api/game-sessions?limit=10&page=1")
      const res = await GET(req)
      const json = await res.json()

      const found = json.data.docs.find(
        (doc: GameSession) => doc.gameSessionSchedule === gameSessionScheduleMock.id,
      )
      expect(found).toBeDefined()
      expect(found.name).toBe(oneOffGameSessionCreateMock.name)
      expect(found.location).toBe(oneOffGameSessionCreateMock.location)
    })
  })
})
