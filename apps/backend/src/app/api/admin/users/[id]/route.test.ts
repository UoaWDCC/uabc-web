import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import UserDataService from "@/data-layer/services/UserDataService"
import {
  adminUserMock,
  casualUserMock,
  memberUserMock,
  userCreateMock,
} from "@/test-config/mocks/User.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { GET } from "./route"

describe("/api/admin/users/[id]", async () => {
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
        params: Promise.resolve({ id: adminUserMock.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.id).toBe(adminUserMock.id)
      expect(json.data.role).toBe("admin")
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should return existing casual user by ID", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: casualUserMock.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.id).toBe(casualUserMock.id)
      expect(json.data.role).toBe("casual")
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should return existing member user by ID", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const res = await GET({} as NextRequest, {
        params: Promise.resolve({ id: memberUserMock.id }),
      })
      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.id).toBe(memberUserMock.id)
      expect(json.data.role).toBe("member")
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })
})
