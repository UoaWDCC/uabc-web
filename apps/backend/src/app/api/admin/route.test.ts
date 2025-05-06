import { StatusCodes } from "http-status-codes"

import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { createMockNextPostRequest } from "@/test-config/backend-utils"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { POST } from "./route"

describe("tests /api/admin/semesters", () => {
  const semesterDataService = new SemesterDataService()

  describe("POST /api/admin/semesters", () => {
    it("should create a semester", async () => {
      const res = await POST(createMockNextPostRequest("", semesterCreateMock))
      expect(res.status).toBe(StatusCodes.CREATED)

      const json = await res.json()
      const fetchedSemester = await semesterDataService.getSemesterById(json.id)
      expect(json).toEqual(fetchedSemester)
    })

    it("should error when missing required fields", async () => {
      const res = await POST(
        createMockNextPostRequest("", { ...semesterCreateMock, name: undefined }),
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.name[0]).toEqual("Required")
    })

    it("should error if an invalid date is provided", async () => {
      const res = await POST(
        createMockNextPostRequest("", { ...semesterCreateMock, startDate: "invalid date" }),
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.startDate[0]).toEqual(
        "Invalid date format, should be in ISO 8601 format",
      )
    })
  })
})
