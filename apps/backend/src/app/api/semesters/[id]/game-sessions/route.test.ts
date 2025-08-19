import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { describe, expect, it, vi } from "vitest"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { GET } from "./route"

describe("/api/semesters/[id]/game-sessions", () => {
  const semesterDataService = new SemesterDataService()
  const gameSessionDataService = new GameSessionDataService()

  describe("GET", () => {
    it("should return game sessions for a valid semester", async () => {
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const newSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: newSemester,
      })

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data).toEqual([newSession])
    })

    it("should return 404 when semester does not exist", async () => {
      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: "non-existent" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const data = await res.json()
      expect(data.error).toBe("Semester not found")
    })

    it("should handle errors and return 500 status", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      vi.spyOn(SemesterDataService.prototype, "getSemesterById").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: "any-id" }),
      })

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const data = await res.json()
      expect(data.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })
})
