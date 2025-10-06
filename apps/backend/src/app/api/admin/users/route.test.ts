import { AUTH_COOKIE_NAME } from "@repo/shared"
import { userCreateMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { GET, POST } from "./route"

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
    })

    it("should return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const req = createMockNextRequest("/api/admin/users?limit=5&page=1")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
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
    })

    it("should allow queries to name and email", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const emailTestUser = await userDataService.createUser({
        ...userCreateMock,
        email: "abcd@defg.com",
      })
      const nameTestUser = await userDataService.createUser({
        ...userCreateMock,
        email: "eufheiu@straight.zhao",
        firstName: "foo",
        lastName: "bar",
      })

      const reqByEmail = createMockNextRequest(
        "/api/admin/users?limit=10&page=1&query=abcd@defg.com",
      )
      const resByEmail = await GET(reqByEmail)
      const emailResJson = await resByEmail.json()
      expect(emailResJson.data.docs).toStrictEqual([emailTestUser])

      const reqByName = createMockNextRequest("/api/admin/users?query=foo bar")
      const resByName = await GET(reqByName)
      const nameResJson = await resByName.json()
      expect(nameResJson.data.docs).toStrictEqual([nameTestUser])
    })

    it("should handle empty query strings", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await GET(createMockNextRequest("/api/admin/users?query="))

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.docs.length).toBeGreaterThan(0) // Should return all users
    })

    it("should allow field-based filtering", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const levelTestUser1 = await userDataService.createUser({
        ...userCreateMock,
        playLevel: "beginner",
      })
      const levelTestUser2 = await userDataService.createUser({
        ...userCreateMock,
        email: "straight2@zhao.com",
        playLevel: "intermediate",
      })
      const levelTestUser3 = await userDataService.createUser({
        ...userCreateMock,
        email: "straight3@zhao.com",
        playLevel: "advanced",
      })

      const req = createMockNextRequest(
        `/api/admin/users?limit=10&page=1&filter=${encodeURIComponent(
          JSON.stringify({ playLevel: ["beginner", "advanced"] }),
        )}`,
      )
      const res = await GET(req)
      const json = await res.json()

      expect(json.data.docs.length).toBeGreaterThanOrEqual(2)
      expect(json.data.docs).toStrictEqual(expect.arrayContaining([levelTestUser1]))
      expect(json.data.docs).toStrictEqual(expect.arrayContaining([levelTestUser3]))
      const returnedIds = json.data.docs.map((u: { id: string }) => u.id)
      expect(returnedIds).not.toContain(levelTestUser2.id)
    })

    it("should handle empty filter arrays", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await GET(createMockNextRequest("/api/admin/users?filter="))

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.docs.length).toBeGreaterThan(0)
    })

    it("should handle query strings and filters together", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const combinedTestUser = await userDataService.createUser({
        ...userCreateMock,
        email: "1abcd@defg.com",
        playLevel: "beginner",
      })
      await userDataService.createUser({
        ...userCreateMock,
        email: "2abcd@defg.com",
        playLevel: "intermediate",
      })

      const req = createMockNextRequest(
        `/api/admin/users?query=1abcd&filter=${encodeURIComponent(
          JSON.stringify({ playLevel: ["beginner"] }),
        )}`,
      )
      const res = await GET(req)
      const json = await res.json()

      expect(json.data.docs).toStrictEqual([combinedTestUser])
    })

    it("should use default pagination if params are missing", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await GET(createMockNextRequest())

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.page).toBe(1)
      expect(json.data.limit).toBe(10)
    })

    it("should return 400 if limit or page is out of range", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const req = createMockNextRequest("/api/admin/users?limit=999&page=-5")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toBe("Invalid query parameters")
      expect(json.details).toBeDefined()
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
    })
  })

  describe("POST", () => {
    it("should return a 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const res = await POST(createMockNextRequest("api/admin/users", "POST", userCreateMock))

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return a 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const res = await POST(createMockNextRequest("api/admin/users", "POST", userCreateMock))

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should create a semester if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await POST(createMockNextRequest("api/admin/users", "POST", userCreateMock))

      expect(res.status).toBe(StatusCodes.CREATED)
      const json = (await res.json()).data
      const fetchedUser = await userDataService.getUserById(json.id)
      expect(json).toEqual(fetchedUser)
    })

    it("should return 400 when invalid request body", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await POST(
        createMockNextRequest("api/admin/users", "POST", {
          ...userCreateMock,
          firstName: undefined,
        }),
      )

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
      expect(json.details.fieldErrors.firstName[0]).toEqual("Required")
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      vi.spyOn(UserDataService.prototype, "createUser").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const res = await POST(createMockNextRequest("/api/auth/register", "POST"))

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})
