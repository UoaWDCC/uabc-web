import { AUTH_COOKIE_NAME } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { userCreateMock } from "@/test-config/mocks/User.mock"
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
      const req = createMockNextRequest("/api/admin/users?limit=5&page=1", "GET")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it("should return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const req = createMockNextRequest("/api/admin/users?limit=5&page=1", "GET")
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
      const req = createMockNextRequest("/api/admin/users?limit=10&page=2", "GET")
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
      const req = createMockNextRequest("/api/admin/users", "GET")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.page).toBe(1)
      expect(json.data.limit).toBe(10)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should clamp limit and page to valid ranges", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextRequest("/api/admin/users?limit=999&page=-5", "GET")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.limit).toBe(100)
      expect(json.data.page).toBe(1)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should handle errors and return 500 status", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      vi.spyOn(UserDataService.prototype, "getPaginatedUsers").mockRejectedValueOnce(
        new Error("Database error"),
      )
      const error = new Error("Database error")
      const req = createMockNextRequest("/api/admin/users", "GET")
      const res = await GET(req)
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})
