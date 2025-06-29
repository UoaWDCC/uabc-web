import { payload } from "@/data-layer/adapters/Payload"
import {
  googleAuthCreateMock,
  standardAuthCreateMock,
} from "@/test-config/mocks/Authentication.mock"
import "dotenv/config"
import type { Authentication } from "@repo/shared/payload-types"
import AuthDataService from "./AuthDataService"

describe("AuthDataService", () => {
  const authDataService = new AuthDataService()

  describe("createAuthIfNotExist", () => {
    it("should create an authentication document for google auth", async () => {
      const newAuth = await authDataService.createAuthIfNotExist(googleAuthCreateMock)
      expect(newAuth).toBeDefined()

      const fetchedAuth = await payload.findByID({
        collection: "authentication",
        id: (newAuth as Authentication).id,
      })
      expect(fetchedAuth).toEqual(newAuth)
    })

    it("should create an authentication document for standard auth", async () => {
      const newAuth = await authDataService.createAuthIfNotExist(standardAuthCreateMock)
      expect(newAuth).toBeDefined()

      const fetchedAuth = await payload.findByID({
        collection: "authentication",
        id: (newAuth as Authentication).id,
      })
      expect(fetchedAuth).toEqual(newAuth)
    })
  })
})
