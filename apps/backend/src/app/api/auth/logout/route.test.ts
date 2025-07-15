import { StatusCodes } from "http-status-codes"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { POST } from "./route"

describe("api/auth/logout", () => {
  describe("POST", async () => {
    it("clears the auth cookie and redirects to home", async () => {
      const req = createMockNextRequest("/api/auth/logout", "POST")
      const response = await POST(req)

      expect(response.status).toBe(StatusCodes.SEE_OTHER)
      expect(response.cookies.get("auth-token")?.value).length(0)
      expect(response.headers.get("Location")).toBe(new URL("/", req.url).toString())
    })
  })
})
