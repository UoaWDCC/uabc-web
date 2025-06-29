import { getReasonPhrase, StatusCodes } from "http-status-codes"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { GET } from "./route"

const semesterDataService = new SemesterDataService()

describe("/api/semesters", () => {
  describe("GET", () => {
    it("should return all semesters", async () => {
      const semester1 = await semesterDataService.createSemester(semesterCreateMock)
      const semester2 = await semesterDataService.createSemester(semesterCreateMock)

      const response = await GET()
      const json = await response.json()

      expect(response.status).toBe(StatusCodes.OK)
      expect(json.data).toHaveLength(2)
      expect(json.data).toEqual(expect.arrayContaining([semester1, semester2]))
    })

    it("should return empty array when no semesters exist", async () => {
      const response = await GET()
      const json = await response.json()

      expect(response.status).toBe(StatusCodes.OK)
      expect(json.data).toHaveLength(0)
    })

    it("should handle errors and return 500 status", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const mockGetAllSemesters = vi
        .spyOn(SemesterDataService.prototype, "getAllSemesters")
        .mockRejectedValueOnce(new Error("Database error"))

      const response = await GET()
      const json = await response.json()

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(mockGetAllSemesters).toHaveBeenCalledWith()
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})
