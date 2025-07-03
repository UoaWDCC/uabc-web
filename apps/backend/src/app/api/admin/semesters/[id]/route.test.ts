import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"
import { DELETE, PATCH } from "./route"

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

  describe("PATCH", () => {
    it("should return a 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const res = await PATCH({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return a 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const res = await PATCH({} as NextRequest, {
        params: Promise.resolve({ id: newSemester.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should update semester if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const updateSemester = { name: "Semester 2 2025" }
      const res = await PATCH(createMockNextRequest("", "PATCH", updateSemester), {
        params: Promise.resolve({ id: newSemester.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const fetchedUpdatedSemester = await semesterDataService.getSemesterById(newSemester.id)
      expect(fetchedUpdatedSemester.name).toEqual(updateSemester.name)
      expect(newSemester.name).not.toEqual(updateSemester.name)
    })

    it("should return 400 when invalid request body", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const res = await PATCH(
        createMockNextRequest("", "PATCH", { ...semesterCreateMock, bookingOpenDay: "day" }),
        { params: Promise.resolve({ id: newSemester.id }) },
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.bookingOpenDay[0]).toEqual(
        "Invalid enum value. Expected 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', received 'day'",
      )
    })

    it("should return a 404 error if the semester does not exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(createMockNextRequest("", "PATCH", { name: "Updated Semester" }), {
        params: Promise.resolve({ id: "does not exist" }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toEqual("Semester not found")
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(createMockNextRequest("", "PATCH", { name: "Something" }), {
        params: Promise.reject(new Error("Param parsing failed")),
      })
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual("Internal Server Error")
    })
  })
})
