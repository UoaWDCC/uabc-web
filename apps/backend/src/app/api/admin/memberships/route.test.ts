import { AUTH_COOKIE_NAME, MembershipType } from "@repo/shared"
import { adminUserMock, memberUserCreateMock, userCreateMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { PATCH } from "./route"

describe("/api/admin/memberships", async () => {
  const cookieStore = await cookies()
  const userDataService = new UserDataService()

  describe("PATCH", () => {
    it("should return 401 if user is casual", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const res = await PATCH(createMockNextRequest("", "PATCH"))

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should return 401 if user is member", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const res = await PATCH(createMockNextRequest("", "PATCH"))

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No scope" })
    })

    it("should reset members and their session count and casuals if they have more than 0 sessions", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const member = await userDataService.createUser(memberUserCreateMock)
      const casualWithSessions = await userDataService.createUser(userCreateMock)

      const res = await PATCH(createMockNextRequest("", "PATCH"))
      expect(res.status).toBe(StatusCodes.NO_CONTENT)

      const modifiedMember = await userDataService.getUserById(member.id)
      const modifiedCasual = await userDataService.getUserById(casualWithSessions.id)

      expect(modifiedMember.role).toBe(MembershipType.casual)
      expect(modifiedMember.remainingSessions).toBe(0)
      expect(modifiedCasual.role).toBe(MembershipType.casual)
      expect(modifiedCasual.remainingSessions).toBe(0)
    })

    it("should update no users if none meet specified criteria", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await PATCH(createMockNextRequest("", "PATCH"))
      const fetchedAdmin = await userDataService.getUserById(adminUserMock.id) // Check if admin token user is unchanged
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      expect(fetchedAdmin.remainingSessions).toEqual(adminUserMock.remainingSessions)
      expect(fetchedAdmin.role).toEqual(adminUserMock.role)
    })

    it("should return 500 for internal server error", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)
      vi.spyOn(UserDataService.prototype, "resetAllMemberships").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const res = await PATCH(createMockNextRequest("", "PATCH"))
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })
})
