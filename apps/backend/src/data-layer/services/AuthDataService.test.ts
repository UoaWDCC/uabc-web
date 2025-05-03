import { payload } from "@/data-layer/adapters/Payload"
import { authenticationCreateMock } from "@/test-config/mocks/Authentication.mock"
import { userMock } from "@/test-config/mocks/User.mock"
import dotenv from "dotenv"
import AuthService from "./AuthDataService"

dotenv.config()

const authService = new AuthService()

describe("auth service", () => {
  it("should create an authentication document", async () => {
    // Create user first so that the auth mock will have an existent user
    await payload.create({
      collection: "user",
      data: userMock,
    })

    const newAuth = await authService.createAuth(authenticationCreateMock)
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
