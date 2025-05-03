import { payload } from "@/data-layer/adapters/Payload"
import { authenticationCreateMock } from "@/test-config/mocks/Authentication.mock"
import { userMock } from "@/test-config/mocks/User.mock"
import AuthDataService from "./AuthDataService"
import UserDataService from "./UserDataService"

const authDataService = new AuthDataService()
const userDataService = new UserDataService()

describe("auth service", () => {
  it("should create an authentication document", async () => {
    userDataService.createUser(userMock)

    const newAuth = await authDataService.createAuth(authenticationCreateMock)
    const fetchedAuth = await payload.find({
      collection: "authentication",
      where: {
        id: {
          equals: newAuth.id,
        },
      },
    })
    expect(fetchedAuth.docs[0]).toEqual(newAuth)
  })
})
