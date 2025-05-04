import { payload } from "@/data-layer/adapters/Payload"
import { authenticationCreateMock } from "@/test-config/mocks/Authentication.mock"
import { userMock } from "@/test-config/mocks/User.mock"
import AuthDataService from "./AuthDataService"
import UserDataService from "./UserDataService"

const authDataService = new AuthDataService()
const userDataService = new UserDataService()

describe("auth service", () => {
  it("should create an authentication document", async () => {
    await userDataService.createUser(userMock)

    const newAuth = await authDataService.createAuth(authenticationCreateMock)
    const fetchedAuth = await payload.findByID({
      collection: "authentication",
      id: newAuth.id,
    })
    expect(fetchedAuth).toEqual(newAuth)
  })
})
