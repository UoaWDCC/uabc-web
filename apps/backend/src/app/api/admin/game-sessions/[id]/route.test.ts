import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { DELETE } from "./route"

const baseRoute = "/api/admin/game-sessions"

describe(`${baseRoute}/[id]`, async () => {
  const gameSessionDataService = new GameSessionDataService()
  const cookieStore = await cookies()

  describe("DELETE", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: newGameSession.id }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: newGameSession.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should delete gameSession if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: newGameSession.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(gameSessionDataService.getGameSessionById(newGameSession.id)).rejects.toThrow(
        "Not Found",
      )
    })

    it("should return 404 if gameSession is non-existent", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: "non-existent" }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.reject(new Error("Param parsing failed")),
      })
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual("Internal Server Error")
    })
  })
})
