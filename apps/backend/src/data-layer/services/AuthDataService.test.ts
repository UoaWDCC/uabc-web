import { payload } from "@/data-layer/adapters/Payload"
import {
  googleAuthCreateMock,
  standardAuthCreateMock,
} from "@/test-config/mocks/Authentication.mock"
import { userMock } from "@/test-config/mocks/User.mock"
import "dotenv/config"
import type { Authentication } from "@repo/shared/payload-types"
import AuthDataService from "./AuthDataService"
import UserDataService from "./UserDataService"

const authDataService = new AuthDataService()
const userDataService = new UserDataService()

describe("auth service", () => {
  it("should create an authentication document for google auth", async () => {
    await userDataService.createUser(userMock)

    const newAuth = await authDataService.createAuth(googleAuthCreateMock)
    expect(newAuth).toBeDefined()

    const fetchedAuth = await payload.findByID({
      collection: "authentication",
      id: (newAuth as Authentication).id,
    })
    expect(fetchedAuth).toEqual(newAuth)
  })

  it("should create an authentication document for standard auth", async () => {
    await userDataService.createUser(userMock)

    const newAuth = await authDataService.createAuth(standardAuthCreateMock)
    expect(newAuth).toBeDefined()

    const fetchedAuth = await payload.findByID({
      collection: "authentication",
      id: (newAuth as Authentication).id,
    })
    expect(fetchedAuth).toEqual(newAuth)
  })
})
