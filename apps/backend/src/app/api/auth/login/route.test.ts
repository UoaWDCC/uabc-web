import { AUTH_COOKIE_NAME, JWTEncryptedUserSchema } from "@repo/shared"
import { userCreateMock } from "@repo/shared/mocks"
import bcrypt from "bcryptjs"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import AuthService from "@/business-layer/services/AuthService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import {
  EMAIL_MOCK,
  PASSWORD_MOCK,
  REAL_HASHED_PASSWORD_MOCK,
  standardAuthCreateMock,
} from "@/test-config/mocks/Authentication.mock"
import { POST as login } from "./route"

describe("api/auth/login", () => {
  const authDataService = new AuthDataService()
  const userDataService = new UserDataService()
  const authService = new AuthService()

  describe("POST", async () => {
    const cookieStore = await cookies()

    it("sets JWT token to cookies and returns it on success auth", async () => {
      await authDataService.createAuth(standardAuthCreateMock)
      await userDataService.createUser(userCreateMock)

      const compareSpy = vi.spyOn(bcrypt, "compare")
      const req = createMockNextRequest("", "POST", {
        email: EMAIL_MOCK,
        password: PASSWORD_MOCK,
      })
      const response = await login(req)

      expect(compareSpy).toHaveBeenCalledWith(PASSWORD_MOCK, REAL_HASHED_PASSWORD_MOCK)
      expect((await response.json()).data).toBeDefined()
      expect(response.status).toBe(StatusCodes.CREATED)

      const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
      expect(token).toBeDefined()

      const data = authService.getData(token as string, JWTEncryptedUserSchema)
      const userMock = await userDataService.getUserByEmail(EMAIL_MOCK)
      expect(data).toMatchObject({
        user: userMock,
      })
    })

    it("returns 400 if email is invalid", async () => {
      const req = createMockNextRequest("", "POST", {
        email: "not_an_email",
        password: PASSWORD_MOCK,
      })
      const response = await login(req)

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("returns 401 if email is incorrect", async () => {
      const req = createMockNextRequest("", "POST", {
        email: "incorrect-email@wdcc.com",
        password: PASSWORD_MOCK,
      })
      const response = await login(req)

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("returns 401 if password is incorrect", async () => {
      await authDataService.createAuth(standardAuthCreateMock)
      await userDataService.createUser(userCreateMock)

      const req = createMockNextRequest("", "POST", {
        email: EMAIL_MOCK,
        // cspell:disable-next-line
        password: "incorrect-passw0rd",
      })
      const response = await login(req)

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })
  })
})
