import { AUTH_COOKIE_NAME, MembershipType } from "@repo/shared"
import { adminUserMock, memberUserCreateMock } from "@repo/shared/mocks"
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

    it("should reset all memberships of users who are either members or have more than 0 remaining sessions or both", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const usersToCreate = Array.from({ length: 3 }, (_, i) => ({
        ...memberUserCreateMock,
        email: `straight.zhao${i}@gmail.com`,
        remainingSessions: Math.floor(Math.random() * 100),
      }))
      const userIds = await Promise.all(
        usersToCreate.map(async (u) => {
          const user = await userDataService.createUser(u)
          return user.id
        }),
      )

      const res = await PATCH(createMockNextRequest("", "PATCH"))

      const users = await Promise.all(
        userIds.map(async (id) => {
          const user = await userDataService.getUserById(id)
          return {
            role: user.role,
            remainingSessions: user.remainingSessions,
          }
        }),
      )

      expect(users).toEqual(
        Array.from({ length: usersToCreate.length }, () => ({
          role: MembershipType.casual,
          remainingSessions: 0,
        })),
      )
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
    })

    it("should update no users if none meet specified criteria", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, adminToken)

      const res = await PATCH(createMockNextRequest("", "PATCH"))
      const admin = await userDataService.getUserById(adminUserMock.id) // Check if admin token user is unchanged
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      expect(admin.remainingSessions).toEqual(adminUserMock.remainingSessions)
      expect(admin.role).toEqual(adminUserMock.role)
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
