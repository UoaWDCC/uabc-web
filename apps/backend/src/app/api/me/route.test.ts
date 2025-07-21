import { AUTH_COOKIE_NAME, MembershipType, type UpdateUserRequest } from "@repo/shared"
import { casualUserMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { GET, PATCH } from "@/app/api/me/route"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { casualToken } from "@/test-config/vitest.setup"

describe("api/me", async () => {
  const userDataService = new UserDataService()
  const cookieStore = await cookies()

  describe("GET", () => {
    it("should return the current user data", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await GET(createMockNextRequest("/api/me"))

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data).toEqual(casualUserMock)
    })

    it("should return 500 and log error if an unexpected error occurs", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      vi.spyOn(UserDataService.prototype, "getUserById").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const response = await GET(createMockNextRequest("/api/me"))

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await response.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it("should fail when user is not authenticated", async () => {
      const response = await GET(createMockNextRequest("/api/me"))

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await response.json()).toStrictEqual({ error: "No token provided" })
    })
  })

  describe("PATCH", () => {
    it("should update the user and return updated the updated user", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const updateUserData: UpdateUserRequest = { firstName: "Bob" }

      const response = await PATCH(createMockNextRequest("/api/me", "PATCH", updateUserData))

      expect(response.status).toBe(StatusCodes.OK)
      const fetchedUser = await userDataService.getUserById(casualUserMock.id)
      expect(fetchedUser.firstName).toEqual(updateUserData.firstName)
    })

    it("should return 400 if request body is invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await PATCH(
        createMockNextRequest("/api/me", "PATCH", {
          firstName: 0,
        }),
      )

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect((await response.json()).error).toEqual("Invalid request body")
    })

    it("should return 400 if request body contains email", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await PATCH(
        createMockNextRequest("/api/me", "PATCH", {
          email: "new-email@gmail.com",
        }),
      )

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect((await response.json()).error).toEqual("Invalid request body")
    })

    it("should return 400 if request body contains remaining sessions", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await PATCH(
        createMockNextRequest("/api/me", "PATCH", {
          remainingSessions: 99999,
        }),
      )

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect((await response.json()).error).toEqual("Invalid request body")
    })

    it("should return 400 if request body contains role", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const response = await PATCH(
        createMockNextRequest("/api/me", "PATCH", {
          role: MembershipType.admin,
        }),
      )

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect((await response.json()).error).toEqual("Invalid request body")
    })

    it("should return 500 and log error if an unexpected error occurs", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      vi.spyOn(UserDataService.prototype, "updateUser").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const response = await PATCH(createMockNextRequest("/api/me", "PATCH", {}))

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await response.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it("should fail if user is not authenticated", async () => {
      const response = await PATCH(createMockNextRequest("/api/me", "PATCH", {}))

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await response.json()).toStrictEqual({ error: "No token provided" })
    })
  })
})
