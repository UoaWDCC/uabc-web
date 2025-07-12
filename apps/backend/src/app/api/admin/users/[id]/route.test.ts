import { AUTH_COOKIE_NAME } from "@repo/shared"
import {
  ADMIN_USER_UID,
  CASUAL_USER_UID,
  MEMBER_USER_UID,
  userCreateMock,
} from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { DELETE, GET, PATH } from "./route"

const baseRoute = "/api/admin/users"

describe(`${baseRoute}/[id]`, async () => {
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
      const newUser = await userDataService.createUser(userCreateMock)
      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: newUser.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
      expect(consoleErrorSpy).toHaveBeenCalledWith("Authentication error:", expect.any(Error))
    })

    it("should return 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const newUser = await userDataService.createUser(userCreateMock)
      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: newUser.id }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
      expect(consoleErrorSpy).toHaveBeenCalledWith("Authentication error:", expect.any(Error))
    })

    it("should return user data if user is admin and user exists", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newUser = await userDataService.createUser(userCreateMock)
      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: newUser.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data).toEqual(newUser)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should return 404 if user does not exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: "non-existent-id" }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect(await res.json()).toStrictEqual({ error: "User not found" })
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should return existing admin user by ID", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: ADMIN_USER_UID }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.id).toBe(ADMIN_USER_UID)
      expect(json.data.role).toBe("admin")
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should return existing casual user by ID", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: CASUAL_USER_UID }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.id).toBe(CASUAL_USER_UID)
      expect(json.data.role).toBe("casual")
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should return existing member user by ID", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: MEMBER_USER_UID }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.id).toBe(MEMBER_USER_UID)
      expect(json.data.role).toBe("member")
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should return 500 and log error if an unexpected error occurs", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const error = new Error("Unexpected error")
      const mockGetUserById = vi
        .spyOn(UserDataService.prototype, "getUserById")
        .mockRejectedValueOnce(error)

      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: "any-id" }),
      })
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(await res.json()).toStrictEqual({ error: "Internal Server Error" })
      expect(mockGetUserById).toHaveBeenCalledWith("any-id")
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    })
  })
  
  describe("DELETE", () => {
    it("should return 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: "some-id" }),
      })

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: "some-id" }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should delete specified user if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newUser = await userDataService.createUser(userCreateMock)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: newUser.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(userDataService.getUserById(newUser.id)).rejects.toThrow(
        getReasonPhrase(StatusCodes.NOT_FOUND),
      )
    })

    it("should return 404 if user is non-existent", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.resolve({ id: "non-existent" }),
      })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await DELETE(createMockNextRequest(baseRoute, "DELETE"), {
        params: Promise.reject(new Error("Param parsing failed")),
      })
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })

  describe("PATCH", () => {
    const updateUser = { firstName: "Test" }

    it("should return a 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const res = await PATCH(createMockNextRequest("/api/admin/users", "PATCH", updateUser), {
        params: Promise.resolve({ id: "test" }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return a 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const res = await PATCH(createMockNextRequest("/api/admin/users", "PATCH", updateUser), {
        params: Promise.resolve({ id: "test" }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should update user if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newUser = await userDataService.createUser(userCreateMock)
      const res = await PATCH(createMockNextRequest("/api/admin/users", "PATCH", updateUser), {
        params: Promise.resolve({ id: newUser.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const fetchedUpdatedUser = await userDataService.getUserById(newUser.id)
      expect(fetchedUpdatedUser.firstName).toEqual(updateUser.firstName)
    })

    it("should return 400 when invalid request body", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const newUser = await userDataService.createUser(userCreateMock)
      const res = await PATCH(
        createMockNextRequest("/api/admin/users", "PATCH", { firstName: null }),
        {
          params: Promise.resolve({ id: newUser.id }),
        },
      )
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toEqual("Invalid request body")
    })

    it("should return a 404 error if the user does not exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(
        createMockNextRequest("/api/admin/users", "PATCH", { name: "Updated User" }),
        {
          params: Promise.resolve({ id: "does not exist" }),
        },
      )
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      const json = await res.json()
      expect(json.error).toEqual("User not found")
    })

    it("should return a 500 error for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await PATCH(
        createMockNextRequest("/api/admin/users", "PATCH", { firstName: "Something" }),
        {
          params: Promise.reject(new Error("Param parsing failed")),
        },
      )
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toEqual("Internal Server Error")
    })
  })
})
