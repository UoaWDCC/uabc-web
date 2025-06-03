import { POST as login } from "@/app/api/auth/login/route"
import AuthService from "@/business-layer/services/AuthService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import {
  EMAIL_MOCK,
  PASSWORD_MOCK,
  standardAuthCreateMock,
} from "@/test-config/mocks/Authentication.mock"
import { tokensMock } from "@/test-config/mocks/GoogleAuth.mock"
import { createMockNextRequest } from "@/test-config/mocks/StandardAuth.mock"
import { AUTH_COOKIE_NAME, JWTEncryptedUserSchema } from "@repo/shared"
import { StatusCodes } from "http-status-codes"

describe("POST api/auth/login", () => {
  it("redirects user and sets JWT token to cookies on success auth", async () => {
    const userDataService = new UserDataService()
    const authDataService = new AuthDataService()

    const newAuth = authDataService.createAuth(standardAuthCreateMock)
    const fetchedUser = await authDataService.getAuthByEmail(standardAuthCreateMock.email)
    expect(fetchedUser).toStrictEqual(newAuth)

    // const newAuth = await authDataService.createAuth({
    //   ...standardAuthCreateMock,
    //   email: casualUserMock.email,
    // })
    // const fetchedAuth = await authDataService.getAuthByEmail(casualUserMock.email)
    // expect(fetchedAuth).toStrictEqual(newAuth)

    const req = createMockNextRequest("/api/auth/login", EMAIL_MOCK, PASSWORD_MOCK)
    const response = await login(req)

    expect(response.status).toBe(StatusCodes.TEMPORARY_REDIRECT)
    expect(response.headers.get("location")).toBe("http://localhost:3000/onboarding/name")

    const token = response.cookies.get(AUTH_COOKIE_NAME)?.value
    expect(token).toBeDefined()

    const authService = new AuthService()
    const data = authService.getData(token as string, JWTEncryptedUserSchema)
    const userMock = await userDataService.getUserByEmail(EMAIL_MOCK)
    expect(data).toMatchObject({
      user: userMock,
      accessToken: tokensMock.access_token, // TODO: must remove/replace, tokensMock is from GoogleAuth.mock
    })
  })
})
