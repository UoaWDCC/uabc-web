import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { POST } from "./route"

describe("/ap/bookings", async () => {
  const cookieStore = await cookies()

  describe("POST", () => {
    it("should return a 401 if user is a casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const res = await POST(createMockNextRequest("/api/bookings", "POST"))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return a 401 if user is a member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const res = await POST(createMockNextRequest("/api/bookings", "POST"))
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return a 200 with booking if user is admin", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      const req = createMockNextRequest("/api/bookings", "POST" )
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.OK)
      expect((await res.json()).data).toBeDefined()
    })
  })
})