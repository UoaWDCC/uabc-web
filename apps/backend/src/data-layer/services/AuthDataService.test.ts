import { payload } from "@/data-layer/adapters/Payload"
import {
  googleAuthCreateMock,
  standardAuthCreateMock,
} from "@/test-config/mocks/Authentication.mock"
import { casualUserMock } from "@/test-config/mocks/User.mock"
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
