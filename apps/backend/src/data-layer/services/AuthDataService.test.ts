import { payload } from "@/data-layer/adapters/Payload"
import {
  googleAuthCreateMock,
  standardAuthCreateMock,
} from "@/test-config/mocks/Authentication.mock"
import { casualUserMock } from "@/test-config/mocks/User.mock"
import "dotenv/config"
import AuthDataService from "./AuthDataService"

const authDataService = new AuthDataService()

describe("auth service", () => {
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
