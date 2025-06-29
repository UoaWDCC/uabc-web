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
import { STATE_MOCK } from "@/test-config/mocks/GoogleAuth.mock"
import { createMockNextRequest } from "@/test-config/mocks/StandardAuth.mock"
import { userCreateMock } from "@/test-config/mocks/User.mock"
import { AUTH_COOKIE_NAME, JWTEncryptedUserSchema, STATE_COOKIE_NAME } from "@repo/shared"
import bcrypt from "bcryptjs"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"

describe("api/auth/login", () => {
  describe("POST", async () => {
    const cookieStore = await cookies()

    it("sets JWT token to cookies on success auth", async () => {
      cookieStore.set(STATE_COOKIE_NAME, STATE_MOCK)
      const authDataService = new AuthDataService()
      const userDataService = new UserDataService()

      const _newAuth = await authDataService.createAuth(standardAuthCreateMock)
      const _newUser = await userDataService.createUser(userCreateMock)

      const compareSpy = vi.spyOn(bcrypt, "compare").mockImplementationOnce(async () => true)
      const req = createMockNextRequest(
        `/api/auth/login?state=${STATE_MOCK}`,
        EMAIL_MOCK,
        PASSWORD_MOCK,
      )
      const response = await login(req)

      expect(compareSpy).toHaveBeenCalledWith(PASSWORD_MOCK, HASHED_PASSWORD_MOCK)
      expect(response.status).toBe(StatusCodes.CREATED)

      const token = response.cookies.get(AUTH_COOKIE_NAME)?.value
      expect(token).toBeDefined()

      const authService = new AuthService()
      const data = authService.getData(token as string, JWTEncryptedUserSchema)
      const userMock = await userDataService.getUserByEmail(EMAIL_MOCK)
      expect(data).toMatchObject({
        user: userMock,
      })
    })

    it("returns 400 if state does not match", async () => {
      cookieStore.set(STATE_COOKIE_NAME, STATE_MOCK)

      const req = createMockNextRequest(
        "/api/auth/login?state=wrong_state",
        EMAIL_MOCK,
        PASSWORD_MOCK,
      )
      const response = await login(req)

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("returns 401 if email is invalid", async () => {
      cookieStore.set(STATE_COOKIE_NAME, STATE_MOCK)

      const req = createMockNextRequest(
        `/api/auth/login?state=${STATE_MOCK}`,
        "invalid-email@wdcc.com",
        PASSWORD_MOCK,
      )
      const response = await login(req)

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("returns 401 if password is invalid", async () => {
      cookieStore.set(STATE_COOKIE_NAME, STATE_MOCK)
      const authDataService = new AuthDataService()
      const userDataService = new UserDataService()

      const _newAuth = await authDataService.createAuth(standardAuthCreateMock)
      const _newUser = await userDataService.createUser(userCreateMock)

      const req = createMockNextRequest(
        `/api/auth/login?state=${STATE_MOCK}`,
        EMAIL_MOCK,
        "invalid-passw0rd",
      )
      const response = await login(req)

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })
  })
})
