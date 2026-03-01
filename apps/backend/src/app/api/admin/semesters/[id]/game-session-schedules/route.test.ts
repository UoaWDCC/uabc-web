import { AUTH_COOKIE_NAME } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("/api/admin/semesters/[id]/game-session-schedules", async () => {
  const semesterDataService = new SemesterDataService()
  const gameSessionDataService = new GameSessionDataService()
  const cookieStore = await cookies()

  describe("GET", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return schedules for a semester if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      await gameSessionDataService.createGameSessionSchedule({
        ...gameSessionScheduleCreateMock,
        semester: newSemester,
      })
      await gameSessionDataService.createGameSessionSchedule({
        ...gameSessionScheduleCreateMock,
        semester: newSemester,
      })

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(Array.isArray(json.data)).toBe(true)
      expect(json.data).toHaveLength(2)
      expect(json.data[0].semester.id).toBe(newSemester.id)
    })

    it("should return an empty array if the semester has no schedules", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data).toEqual([])
    })

    it("should return 404 if semester does not exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: "does not exist" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toBe("Semester not found")
    })

    it("should handle errors and return 500 status", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      vi.spyOn(
        GameSessionDataService.prototype,
        "getGameSessionSchedulesBySemesterId",
      ).mockRejectedValueOnce(new Error("Database error"))
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const res = await GET(createMockNextRequest(), {
        params: Promise.resolve({ id: newSemester.id }),
      })

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })
})
