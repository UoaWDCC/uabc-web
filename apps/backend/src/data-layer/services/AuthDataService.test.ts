import { casualUserMock } from "@repo/shared/mocks"
import { payload } from "@/data-layer/adapters/Payload"
import {
  googleAuthCreateMock,
  standardAuthCreateMock,
} from "@/test-config/mocks/Authentication.mock"
import "dotenv/config"
import AuthDataService from "./AuthDataService"

const authDataService = new AuthDataService()

describe("AuthDataService", () => {
  describe("createAuth", () => {
    it("should create an authentication document for google auth", async () => {
      const newAuth = await authDataService.createAuth(googleAuthCreateMock)
      const fetchedAuth = await payload.findByID({
        collection: "authentication",
        id: newAuth.id,
      })
      expect(fetchedAuth).toEqual(newAuth)
    })

    it("should create an authentication document for standard auth", async () => {
      const newAuth = await authDataService.createAuth({
        ...standardAuthCreateMock,
        email: casualUserMock.email,
      })
      const fetchedAuth = await payload.findByID({
        collection: "authentication",
        id: newAuth.id,
      })
      expect(fetchedAuth).toEqual(newAuth)
    })
  })

  describe("updateAuth", () => {
    it("should update an authentication document", async () => {
      const newMockEmail = "new_email@example.com"

      const newAuth = await authDataService.createAuth(standardAuthCreateMock)
      const updatedAuth = await authDataService.updateAuth(newAuth.id, {
        email: newMockEmail,
      })
      expect(updatedAuth.email).toBe(newMockEmail)

      const fetchedAuth = await payload.findByID({
        collection: "authentication",
        id: newAuth.id,
      })
      expect(fetchedAuth.email).toBe(newMockEmail)
    })

    it("should throw an error when trying to update a non-existent id", async () => {
      await expect(() =>
        authDataService.updateAuth("nonexistent-id", {
          email: "fake_email@example.com",
        }),
      ).rejects.toThrowError("Not Found")
    })
  })

  describe("getAuthByEmail", () => {
    it("should be able to get an authentication document by email", async () => {
      const newAuth = await authDataService.createAuth({
        ...standardAuthCreateMock,
        email: casualUserMock.email,
      })
      const fetchedAuth = await authDataService.getAuthByEmail(casualUserMock.email)
      expect(fetchedAuth).toStrictEqual(newAuth)
    })

    it("should throw an error if authentication document does not exist when searching by email", async () => {
      await expect(() =>
        authDataService.getAuthByEmail("nonexistent@example.com"),
      ).rejects.toThrowError(
        "Authentication with the email: nonexistent@example.com was not found.",
      )
    })
  })
})
