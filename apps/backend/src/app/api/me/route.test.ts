import { AUTH_COOKIE_NAME } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { GET } from "@/app/api/me/route"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { casualUserMock } from "@/test-config/mocks/User.mock"
import { casualToken } from "@/test-config/vitest.setup"

describe("api/me", async () => {
  const cookieStore = await cookies()

  describe("GET", () => {
    it("should return the current user data", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const response = await GET(createMockNextRequest("/api/me"))
      const json = await response.json()

      expect(response.status).toBe(StatusCodes.OK)
      expect(json.data).toEqual(casualUserMock)
    })

    it("should return 500 and log error if an unexpected error occurs", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      vi.spyOn(UserDataService.prototype, "getUserById").mockRejectedValueOnce(
        new Error("Database error"),
      )
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const response = await GET(createMockNextRequest("/api/me"))
      const json = await response.json()

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
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
})
