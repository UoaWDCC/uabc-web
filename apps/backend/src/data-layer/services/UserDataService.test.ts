import { MembershipType } from "@repo/shared"
import { adminUserMock, memberUserCreateMock, userCreateMock } from "@repo/shared/mocks"
import { payload } from "@/data-layer/adapters/Payload"
import { clearCollection } from "@/test-config/backend-utils"
import UserDataService from "./UserDataService"

const userDataService = new UserDataService()

describe("UserDataService", () => {
  describe("createUser", () => {
    it("should create a user document", async () => {
      const newUser = await userDataService.createUser(userCreateMock)
      const fetchedUser = await payload.findByID({
        collection: "user",
        id: newUser.id,
      })
      expect(fetchedUser).toStrictEqual(newUser)
    })
  })

  describe("getUserByEmail", () => {
    it("should be able to get a user document by email", async () => {
      const newUser = await userDataService.createUser(userCreateMock)
      const fetchedUser = await userDataService.getUserByEmail(userCreateMock.email)
      expect(fetchedUser).toStrictEqual(newUser)
    })

    it("should return null if user does not exist when searching by email", async () => {
      const fetchedUser = userDataService.getUserByEmail("nonexistent@example.com")
      await expect(fetchedUser).rejects.toThrow(
        "A user with the email: nonexistent@example.com was not found.",
      )
    })
  })

  describe("getUserById", () => {
    it("should get a user by ID", async () => {
      const newUser = await userDataService.createUser(userCreateMock)
      const fetchedUser = await userDataService.getUserById(newUser.id)
      expect(fetchedUser).toEqual(newUser)
    })

    it("should return null for non-existent ID", async () => {
      const fetchedUser = userDataService.getUserById("nonexistentid")
      await expect(fetchedUser).rejects.toThrow("Not Found")
    })
  })

  describe("updateUser", () => {
    it("should update user fields", async () => {
      const newUser = await userDataService.createUser(userCreateMock)
      const updateData = {
        firstName: "Updated",
        lastName: "Name",
        remainingSessions: 10,
      }

      const updatedUser = await userDataService.updateUser(newUser.id, updateData)

      expect(updatedUser).toStrictEqual({ ...newUser, ...updatedUser })
    })

    it("should return null when updating non-existent user", async () => {
      const updateData = { firstName: "Updated" }
      const updateNotFoundUser = userDataService.updateUser("nonexistentid", updateData)
      await expect(updateNotFoundUser).rejects.toThrow("Not Found")
    })
  })

  describe("resetAllMemberships", () => {
    it("should reset members and their session count and casuals if they have more than 0 sessions", async () => {
      const member = await userDataService.createUser(memberUserCreateMock)
      const casualWithSessions = await userDataService.createUser(userCreateMock)

      await userDataService.resetAllMemberships()

      const modifiedMember = await userDataService.getUserById(member.id)
      const modifiedCasual = await userDataService.getUserById(casualWithSessions.id)

      expect(modifiedMember.role).toBe(MembershipType.casual)
      expect(modifiedMember.remainingSessions).toBe(0)
      expect(modifiedCasual.role).toBe(MembershipType.casual)
      expect(modifiedCasual.remainingSessions).toBe(0)
    })

    it("should update no users if none meet specified criteria", async () => {
      await userDataService.resetAllMemberships()
      const fetchedAdmin = await userDataService.getUserById(adminUserMock.id) // Check if admin token user is unchanged
      expect(fetchedAdmin.remainingSessions).toEqual(adminUserMock.remainingSessions)
      expect(fetchedAdmin.role).toEqual(adminUserMock.role)
    })
  })

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const newUser = await userDataService.createUser(userCreateMock)
      const deletedUser = await userDataService.deleteUser(newUser.id)
      await expect(userDataService.getUserById(deletedUser.id)).rejects.toThrow("Not Found")
    })

    it("should return null when deleting non-existent user", async () => {
      await expect(userDataService.deleteUser("nonexistentid")).rejects.toThrow("Not Found")
    })
  })

  describe("getPaginatedUsers", () => {
    beforeEach(async () => {
      await clearCollection(payload, "user")
    })

    it("should return paginated users with default limit and page", async () => {
      const usersToCreate = Array.from({ length: 15 }, (_, i) => ({
        ...userCreateMock,
        email: `user${i}@test.com`,
      }))
      await Promise.all(usersToCreate.map((u) => userDataService.createUser(u)))
      const result = await userDataService.getPaginatedUsers()
      expect(result.docs.length).toBeLessThanOrEqual(10)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
      expect(result.totalDocs).toBeGreaterThanOrEqual(15)
      expect(result.totalPages).toBeGreaterThanOrEqual(2)
    })

    it("should return paginated users for custom limit and page", async () => {
      const usersToCreate = Array.from({ length: 12 }, (_, i) => ({
        ...userCreateMock,
        email: `user${i}@test.com`,
      }))
      await Promise.all(usersToCreate.map((u) => userDataService.createUser(u)))
      const result = await userDataService.getPaginatedUsers({ limit: 5, page: 3 })
      expect(result.docs.length).toBeLessThanOrEqual(5)
      expect(result.page).toBe(3)
      expect(result.limit).toBe(5)
      expect(result.totalDocs).toBeGreaterThanOrEqual(12)
      expect(result.totalPages).toBeGreaterThanOrEqual(3)
    })

    it("should filter down users based on query", async () => {
      const usersToCreate = Array.from({ length: 8 }, (_, i) => ({
        ...userCreateMock,
        email: `user${i}@test.com`,
      }))
      await Promise.all(usersToCreate.map((u) => userDataService.createUser(u)))

      const user = await userDataService.createUser({
        ...userCreateMock,
        firstName: "casual",
        lastName: "test",
      })

      const result = await userDataService.getPaginatedUsers({ query: "casual" })
      expect(result.docs).toStrictEqual([user])

      const result2 = await userDataService.getPaginatedUsers({ query: "@test.com" })
      expect(result2.totalDocs).toBe(8)
    })

    it("should filter down users based on field filters", async () => {
      const usersToCreate = Array.from({ length: 5 }, (_, i) => ({
        ...userCreateMock,
        email: `abcd${i}@test.com`,
        playLevel: "beginner" as const,
        role: MembershipType.member,
      }))
      await Promise.all(usersToCreate.map((u) => userDataService.createUser(u)))

      const intermediateUser = await userDataService.createUser({
        ...userCreateMock,
        email: "abcde@test.com",
        playLevel: "intermediate",
        role: MembershipType.casual,
        remainingSessions: 0,
      })
      const advancedUser = await userDataService.createUser({
        ...userCreateMock,
        email: "abcdef@test.com",
        playLevel: "advanced",
        role: MembershipType.admin,
      })

      const result = await userDataService.getPaginatedUsers({
        filter: JSON.stringify({ level: ["intermediate", "advanced"] }),
      })
      expect(result.totalDocs).toBe(2)
      expect(result.docs).toContainEqual(intermediateUser)
      expect(result.docs).toContainEqual(advancedUser)

      const roleResult = await userDataService.getPaginatedUsers({
        filter: JSON.stringify({ role: [MembershipType.member] }),
      })
      expect(roleResult.totalDocs).toBe(5)
      for (const user of roleResult.docs) {
        expect(user.role).toBe(MembershipType.member)
      }
    })

    it("should handle invalid filter JSON", async () => {
      const usersToCreate = Array.from({ length: 3 }, (_, i) => ({
        ...userCreateMock,
        email: `user${i}@test.com`,
      }))
      await Promise.all(usersToCreate.map((u) => userDataService.createUser(u)))

      await expect(
        userDataService.getPaginatedUsers({
          filter: "invalid json string",
        }),
      ).rejects.toThrow("Invalid filter JSON")
    })

    it("should handle empty array filter values by ignoring that filter", async () => {
      const usersToCreate = Array.from({ length: 5 }, (_, i) => ({
        ...userCreateMock,
        email: `abcd${i}@test.com`,
        playLevel: "beginner" as const,
        role: MembershipType.member,
      }))
      await Promise.all(usersToCreate.map((u) => userDataService.createUser(u)))

      const intermediateUser = await userDataService.createUser({
        ...userCreateMock,
        email: "abcde@test.com",
        playLevel: "intermediate",
        role: MembershipType.casual,
      })
      const advancedUser = await userDataService.createUser({
        ...userCreateMock,
        email: "abcdef@test.com",
        playLevel: "advanced",
        role: MembershipType.admin,
      })

      const result = await userDataService.getPaginatedUsers({
        filter: JSON.stringify({ level: ["intermediate", "advanced"], role: [] }),
      })
      expect(result.totalDocs).toBe(2)
      expect(result.docs).toContainEqual(intermediateUser)
      expect(result.docs).toContainEqual(advancedUser)
    })

    it("should return empty docs if no users exist", async () => {
      const result = await userDataService.getPaginatedUsers()
      expect(result.docs).toHaveLength(0)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
    })
  })
})
