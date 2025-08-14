import { getReasonPhrase, StatusCodes } from "http-status-codes"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { GET } from "./route"

describe("/api/game-sessions/current", () => {
  const semesterDataService = new SemesterDataService()
  const gameSessionDataService = new GameSessionDataService()

  describe("GET", () => {
    it("should return current sessions for the current semester", async () => {
      const currentDate = new Date()
      const startDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
      const endDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)

      const currentSemester = await semesterDataService.createSemester({
        ...semesterCreateMock,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })

      const session = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: currentSemester,
        openTime: new Date(currentDate.getTime() - 60 * 60 * 1000).toISOString(),
        endTime: new Date(currentDate.getTime() + 60 * 60 * 1000).toISOString(),
      })

      const res = await GET()

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data).toHaveLength(1)
      expect(json.data[0].id).toBe(session.id)
      expect(json.data[0].capacity).toBe(session.capacity)
      expect(json.data[0].casualCapacity).toBe(session.casualCapacity)
      expect(json.data[0].attendees).toBe(0)
      expect(json.data[0].casualAttendees).toBe(0)
    })

    it("should return 404 when no current semester exists", async () => {
      const res = await GET()

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toBe("No current semester found")
    })

    it("should handle errors and return 500 status", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const currentSemester = await semesterDataService.createSemester(semesterCreateMock)
      vi.spyOn(SemesterDataService.prototype, "getCurrentSemester").mockResolvedValueOnce(
        currentSemester,
      )
      vi.spyOn(
        GameSessionDataService.prototype,
        "getGameSessionsBySemesterId",
      ).mockRejectedValueOnce(new Error("Database error"))

      const res = await GET()
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      consoleErrorSpy.mockRestore()
    })
  })
})
