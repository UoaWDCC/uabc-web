import { userCreateMock } from "@repo/shared/mocks"
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
      expect(fetchedUser).rejects.toThrow(
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
      expect(fetchedUser).rejects.toThrow("Not Found")
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
      const result = await userDataService.getPaginatedUsers(5, 3)
      expect(result.docs.length).toBeLessThanOrEqual(5)
      expect(result.page).toBe(3)
      expect(result.limit).toBe(5)
      expect(result.totalDocs).toBeGreaterThanOrEqual(12)
      expect(result.totalPages).toBeGreaterThanOrEqual(3)
    })

    it("should return empty docs if no users exist", async () => {
      const result = await userDataService.getPaginatedUsers()
      expect(result.docs).toHaveLength(0)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
    })
  })
})
