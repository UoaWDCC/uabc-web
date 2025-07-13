import { AUTH_COOKIE_NAME } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { POST } from "./route"

describe("/api/admin/semesters", async () => {
  const semesterDataService = new SemesterDataService()
  const cookieStore = await cookies()

  describe("POST", () => {
    it("should return a 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const res = await POST(createMockNextRequest("", "POST", semesterCreateMock))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return a 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const res = await POST(createMockNextRequest("", "POST", semesterCreateMock))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should create a semester if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await POST(createMockNextRequest("", "POST", semesterCreateMock))
      expect(res.status).toBe(StatusCodes.CREATED)
      const json = (await res.json()).data
      const fetchedSemester = await semesterDataService.getSemesterById(json.id)
      expect(json).toEqual(fetchedSemester)
    })

    it("should return 400 when invalid request body", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await POST(
        createMockNextRequest("", "POST", { ...semesterCreateMock, name: undefined }),
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.name[0]).toEqual("Required")
    })

    it("should error if an invalid date is provided", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await POST(
        createMockNextRequest("", "POST", { ...semesterCreateMock, startDate: "invalid date" }),
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.startDate[0]).toEqual(
        "Invalid date format, should be in ISO 8601 format",
      )
    })

    it("should return 500 for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      vi.spyOn(SemesterDataService.prototype, "createSemester").mockRejectedValueOnce(
        new Error("Database error"),
      )
      const res = await POST(createMockNextRequest("", "POST", semesterCreateMock))
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })
})
