import { getReasonPhrase, StatusCodes } from "http-status-codes"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { GET } from "./route"

const gameSessionDataService = new GameSessionDataService()

describe("/api/game-sessions/[id]", () => {
  describe("GET", () => {
    it("should return game session data when game session exists", async () => {
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)

      const res = await GET(createMockNextRequest("/api/gameSessions"), {
        params: Promise.resolve({ id: newGameSession.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data).toEqual(newGameSession)
    })

    it("should return 404 when game session does not exist", async () => {
      const res = await GET(createMockNextRequest("/api/gameSessions"), {
        params: Promise.resolve({ id: "non-existent" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const data = await res.json()
      expect(data.error).toBe("Game session not found")
    })

    it("should handle errors and return 500 status", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const mockGetGameSessionById = vi
        .spyOn(GameSessionDataService.prototype, "getGameSessionById")
        .mockRejectedValueOnce(new Error("Database error"))

      const res = await GET(createMockNextRequest("/api/gameSessions"), {
        params: Promise.resolve({ id: "any-id" }),
      })
      const json = await res.json()

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(mockGetGameSessionById).toHaveBeenCalledWith("any-id")
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
