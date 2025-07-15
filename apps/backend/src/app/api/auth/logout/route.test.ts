import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { POST } from "./route"

describe("api/auth/logout", () => {
  describe("POST", async () => {
    it("clears the auth cookie and redirects to home", async () => {
      const req = createMockNextRequest("/api/auth/logout", "POST")
      const response = await POST(req)
      const cookieStore = await cookies()

      expect(response.status).toBe(StatusCodes.PERMANENT_REDIRECT)
      expect(cookieStore.get("auth-token")?.value).toBeUndefined()
      expect(response.headers.get("Location")).toBe(req.url.slice(0, 22))
    })
  })
})
