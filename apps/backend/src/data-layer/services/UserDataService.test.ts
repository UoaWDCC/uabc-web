import { payload } from "@/data-layer/adapters/Payload"
import { userCreateMock } from "@/test-config/mocks/User.mock"
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
})
