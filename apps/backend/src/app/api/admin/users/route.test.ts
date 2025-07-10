import { AUTH_COOKIE_NAME } from "@repo/shared"
import { userCreateMock } from "@repo/shared/test-config/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("/api/admin/users", async () => {
  const userDataService = new UserDataService()
  const cookieStore = await cookies()
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe("GET", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const req = createMockNextRequest("/api/admin/users?limit=5&page=1")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it("should return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const req = createMockNextRequest("/api/admin/users?limit=5&page=1")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it("should return paginated users for admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const usersToCreate = Array.from({ length: 15 }, (_, i) => ({
        ...userCreateMock,
        email: `user${i}@test.com`,
      }))
      await Promise.all(usersToCreate.map((u) => userDataService.createUser(u)))
      const req = createMockNextRequest("/api/admin/users?limit=10&page=2")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.docs.length).toBeLessThanOrEqual(10)
      expect(json.data.page).toBe(2)
      expect(json.data.limit).toBe(10)
      expect(json.data.totalDocs).toBeGreaterThanOrEqual(15)
      expect(json.data.totalPages).toBeGreaterThanOrEqual(2)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should use default pagination if params are missing", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextRequest("/api/admin/users")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.page).toBe(1)
      expect(json.data.limit).toBe(10)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should return 400 if limit or page is out of range", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextRequest("/api/admin/users?limit=999&page=-5")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toBe("Invalid query parameters")
      expect(json.details).toBeDefined()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should handle errors and return 500 status", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      vi.spyOn(UserDataService.prototype, "getPaginatedUsers").mockRejectedValueOnce(
        new Error("Database error"),
      )
      const req = createMockNextRequest("/api/admin/users?limit=10&page=1")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it("should return 400 if query params are invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextRequest("/api/admin/users?limit=abc&page=def")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toBe("Invalid query parameters")
      expect(json.details).toBeDefined()
    })

    it("should return 401 if no token is provided", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, "")
      const req = createMockNextRequest("/api/admin/users?limit=5&page=1")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No token provided" })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it("should return 401 if token is invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, "invalid.token.value")
      const req = createMockNextRequest("/api/admin/users?limit=5&page=1")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "Invalid JWT token" })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it("should return 401 if token is malformed", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, "not-a-jwt")
      const req = createMockNextRequest("/api/admin/users?limit=5&page=1")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "Invalid JWT token" })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})
