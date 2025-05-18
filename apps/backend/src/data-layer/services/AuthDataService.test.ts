import { payload } from "@/data-layer/adapters/Payload"
import { clearCollection } from "@/test-config/backend-utils"
import {
  googleAuthCreateMock,
  standardAuthCreateMock,
} from "@/test-config/mocks/Authentication.mock"
import { userMock } from "@/test-config/mocks/User.mock"
import dotenv from "dotenv"
import AuthDataService from "./AuthDataService"
import UserDataService from "./UserDataService"

const authDataService = new AuthDataService()
const userDataService = new UserDataService()

dotenv.config()

describe("auth service", () => {
  afterEach(async () => {
    await clearCollection(payload, "authentication")
    await clearCollection(payload, "user")
    vi.restoreAllMocks()
  })

  it("should create an authentication document for google auth", async () => {
    await userDataService.createUser(userMock)

    const newAuth = await authDataService.createAuth(googleAuthCreateMock)
    const fetchedAuth = await payload.findByID({
      collection: "authentication",
      id: newAuth.id,
    })
    expect(fetchedAuth).toEqual(newAuth)
  })

  it("should create an authentication document for standard auth", async () => {
    await userDataService.createUser(userMock)

    const newAuth = await authDataService.createAuth(standardAuthCreateMock)
    const fetchedAuth = await payload.findByID({
      collection: "authentication",
      id: newAuth.id,
    })
    expect(fetchedAuth).toEqual(newAuth)
  })
})
