import { POST as login } from "@/app/api/auth/login/route"
import AuthService from "@/business-layer/services/AuthService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import {
  EMAIL_MOCK,
  HASHED_PASSWORD_MOCK,
  PASSWORD_MOCK,
  standardAuthCreateMock,
} from "@/test-config/mocks/Authentication.mock"
import { createMockNextRequest } from "@/test-config/mocks/StandardAuth.mock"
import { userCreateMock } from "@/test-config/mocks/User.mock"
import { AUTH_COOKIE_NAME, JWTEncryptedUserSchema } from "@repo/shared"
import bcrypt from "bcryptjs"
import { StatusCodes } from "http-status-codes"

describe("POST api/auth/login", () => {
  it("redirects user and sets JWT token to cookies on success auth", async () => {
    const authDataService = new AuthDataService()
    const userDataService = new UserDataService()

    const _newAuth = await authDataService.createAuth(standardAuthCreateMock)
    const _newUser = await userDataService.createUser(userCreateMock)

    const compareSpy = vi.spyOn(bcrypt, "compare").mockImplementationOnce(async () => true)
    const req = createMockNextRequest("/api/auth/login", EMAIL_MOCK, PASSWORD_MOCK)
    const response = await login(req)

    expect(compareSpy).toHaveBeenCalledWith(PASSWORD_MOCK, HASHED_PASSWORD_MOCK)
    expect(response.status).toBe(StatusCodes.TEMPORARY_REDIRECT)
    expect(response.headers.get("location")).toBe("http://localhost:3000/onboarding/name")

    const token = response.cookies.get(AUTH_COOKIE_NAME)?.value
    expect(token).toBeDefined()

    const authService = new AuthService()
    const data = authService.getData(token as string, JWTEncryptedUserSchema)
    const userMock = await userDataService.getUserByEmail(EMAIL_MOCK)
    expect(data).toMatchObject({
      user: userMock,
    })
  })

  it("returns 401 if email is invalid", async () => {
    const req = createMockNextRequest("/api/auth/login", "invalid-email@wdcc.com", PASSWORD_MOCK)
    const response = await login(req)

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("returns 401 if password is invalid", async () => {
    const authDataService = new AuthDataService()
    const userDataService = new UserDataService()

    const _newAuth = await authDataService.createAuth(standardAuthCreateMock)
    const _newUser = await userDataService.createUser(userCreateMock)

    const req = createMockNextRequest("/api/auth/login", EMAIL_MOCK, "invalid-passw0rd")
    const response = await login(req)

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })
})
