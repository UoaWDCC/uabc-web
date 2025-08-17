import { getReasonPhrase, StatusCodes } from "http-status-codes"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { GET } from "./route"

describe("/api/semesters/current", () => {
  const semesterDataService = new SemesterDataService()

  describe("GET", () => {
    it("should return the current semester when one exists", async () => {
      const currentDate = new Date()
      const startDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
      const endDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // 1 day from now

      const currentSemesterData = {
        ...semesterCreateMock,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }

      const currentSemester = await semesterDataService.createSemester(currentSemesterData)

      const response = await GET()

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data).toEqual(currentSemester)
    })

    it("should return 404 when no current semester exists", async () => {
      // Create a semester that's in the past
      const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      const pastSemesterData = {
        ...semesterCreateMock,
        startDate: new Date(pastDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        endDate: pastDate.toISOString(),
      }

      await semesterDataService.createSemester(pastSemesterData)

      const response = await GET()

      expect(response.status).toBe(StatusCodes.NOT_FOUND)
      const json = await response.json()
      expect(json.error).toBe("No current semester found")
    })

    it("should handle database errors and return 500 status", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const mockGetCurrentSemester = vi
        .spyOn(SemesterDataService.prototype, "getCurrentSemester")
        .mockRejectedValueOnce(new Error("Database connection error"))

      const response = await GET()

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await response.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(mockGetCurrentSemester).toHaveBeenCalledWith()
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})
