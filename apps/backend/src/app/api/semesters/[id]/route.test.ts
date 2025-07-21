import { getReasonPhrase, StatusCodes } from "http-status-codes"
import type { NextRequest } from "next/server"
import { describe, expect, it, vi } from "vitest"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { GET } from "./route"

const semesterDataService = new SemesterDataService()

describe("/api/semesters/[id]", () => {
  describe("GET", () => {
    it("should return semester data when semester exists", async () => {
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      const data = await res.json()
      expect(data.data).toEqual(newSemester)
    })

    it("should return 404 when semester does not exist", async () => {
      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: "non-existent" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const data = await res.json()
      expect(data.error).toBe("Semester not found")
    })

    it("should handle errors and return 500 status", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const mockGetSemesterById = vi
        .spyOn(SemesterDataService.prototype, "getSemesterById")
        .mockRejectedValueOnce(new Error("Database error"))

      const response = await GET({} as NextRequest, {
        params: Promise.resolve({ id: "any-id" }),
      })

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await response.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(mockGetSemesterById).toHaveBeenCalledWith("any-id")
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
