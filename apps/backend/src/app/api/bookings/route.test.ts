import { AUTH_COOKIE_NAME, type CreateBookingRequestBodyType, PlayLevel } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { adminToken } from "@/test-config/vitest.setup"
import { POST } from "./route"

describe("/api/bookings", async () => {
  const cookieStore = await cookies()
  const gameSessionDataService = new GameSessionDataService()

  describe("POST", () => {
    it("should return a 200 if the booking is valid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)

      const req = createMockNextRequest("/api/bookings", "POST", {
        gameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequestBodyType)

      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.CREATED)
      expect((await res.json()).data.id).toBeDefined()
    })
  })
})
