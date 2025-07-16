import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { casualToken } from "@/test-config/vitest.setup"
import { POST } from "./route"

describe("api/auth/logout", async () => {
  const cookieStore = await cookies()
  describe("POST", async () => {
    it("clears the auth cookie and redirects to home", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const req = createMockNextRequest("/api/auth/logout", "POST")
      const response = await POST(req)

      expect(response.status).toBe(StatusCodes.OK)
      expect(cookieStore.get(AUTH_COOKIE_NAME)?.value).toBeUndefined()
      expect((await response.json()).message).toBe("Logged out successfully")
    })

    it("return 401 if no token is provided", async () => {
      const req = createMockNextRequest("/api/auth/logout", "POST")
      const response = await POST(req)

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      expect((await response.json()).error).toBe("No token provided")
    })
  })
})
