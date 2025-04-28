import { clearCollection, testPayloadObject } from "@/test-config/backend-utils"
import { userCreateMock } from "@/test-config/mocks/User.mock"
import dotenv from "dotenv"
import UserService from "./UserService"

dotenv.config()

const userService = new UserService()

describe("user service", () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, "user")
  })

  it("should create a user document", async () => {
    const newUser = await userService.createUser(userCreateMock)
    const fetchedUser = await testPayloadObject.find({
      collection: "user",
      where: {
        id: {
          equals: newUser.id,
        },
      },
    })
    expect(fetchedUser.docs[0]).toEqual(newUser)
  })

  it("should be able to get a user document by email", async () => {
    const newUser = await userService.createUser(userCreateMock)
    const fetchedUser = await userService.getUserByEmail(userCreateMock.email)
    expect(fetchedUser).toEqual(newUser)
  })

  it("should return null if user does not exist when searching by email", async () => {
    const fetchedUser = await userService.getUserByEmail("nonexistent@example.com")
    expect(fetchedUser).toBeNull()
  })

  describe("getUserById", () => {
    it("should get a user by ID", async () => {
      const newUser = await userService.createUser(userCreateMock)
      const fetchedUser = await userService.getUserById(newUser.id)
      expect(fetchedUser).toEqual(newUser)
    })

    it("should return null for non-existent ID", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const fetchedUser = await userService.getUserById("nonexistentid")
      expect(fetchedUser).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching user by ID nonexistentid:",
        "Not Found",
      )
      consoleErrorSpy.mockRestore()
    })
  })

  describe("updateUser", () => {
    it("should update user fields", async () => {
      const newUser = await userService.createUser(userCreateMock)
      const updateData = {
        firstName: "Updated",
        lastName: "Name",
        remainingSessions: 10,
      }

      const updatedUser = await userService.updateUser(newUser.id, updateData)

      // First check if updatedUser is not null
      expect(updatedUser).not.toBeNull()

      if (updatedUser) {
        expect(updatedUser.firstName).toBe(updateData.firstName)
        expect(updatedUser.lastName).toBe(updateData.lastName)
        expect(updatedUser.remainingSessions).toBe(updateData.remainingSessions)
        // Verify email remains unchanged
        expect(updatedUser.email).toBe(newUser.email)
      }
    })

    it("should return null when updating non-existent user", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const updateData = { firstName: "Updated" }
      const result = await userService.updateUser("nonexistentid", updateData)
      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching user by ID nonexistentid:",
        "Not Found",
      )
      consoleErrorSpy.mockRestore()
    })
  })

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const newUser = await userService.createUser(userCreateMock)
      const deletedUser = await userService.deleteUser(newUser.id)

      // First check if deletedUser is not null
      expect(deletedUser).not.toBeNull()

      if (deletedUser) {
        expect(deletedUser).toEqual(newUser)
      }

      // Verify user no longer exists
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const fetchedUser = await userService.getUserById(newUser.id)
      expect(fetchedUser).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Error fetching user by ID ${newUser.id}:`,
        "Not Found",
      )
      consoleErrorSpy.mockRestore()
    })

    it("should return null when deleting non-existent user", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const result = await userService.deleteUser("nonexistentid")
      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching user by ID nonexistentid:",
        "Not Found",
      )
      consoleErrorSpy.mockRestore()
    })
  })
})
