import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"
import { DELETE } from "./route"

describe("/api/admin/semesters/[id]", async () => {
  const semesterDataService = new SemesterDataService()
  const cookieStore = await cookies()

  describe("DELETE", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const res = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const res = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should delete semester if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const res = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(semesterDataService.getSemesterById(newSemester.id)).rejects.toThrow("Not Found")
    })

    it("should return 404 if semester is non-existent", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: "non-existent" }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })
  })
})
