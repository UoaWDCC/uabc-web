import { AUTH_COOKIE_NAME, JWTEncryptedUserSchema, TOKEN_EXPIRY_TIME } from "@repo/shared"
import { casualUserMock } from "@repo/shared/test-config/mocks/User.mock"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { JWT_INVALID_TOKEN_MOCK, JWT_TOKEN_MOCK } from "@/test-config/mocks/AuthService.mock"
import { JWT_SECRET_MOCK, tokensMock } from "@/test-config/mocks/GoogleAuth.mock"
import AuthService from "./AuthService"

describe("AuthService", () => {
  const authService = new AuthService()

  describe("signJWT", () => {
    it("should sign a JWT token and return it", () => {
      const payload = { user: casualUserMock, accessToken: tokensMock.access_token }
      const options = { expiresIn: TOKEN_EXPIRY_TIME } as const

      const token = authService.signJWT(payload, options)
      expect(token).not.toBe(payload)
    })

    it("should generate a JWT token that matches the encrypted data", () => {
      const payload = { user: casualUserMock, accessToken: tokensMock.access_token }
      const options = { expiresIn: TOKEN_EXPIRY_TIME } as const

      const token = authService.signJWT(payload, options)

      const decoded = jwt.verify(token, JWT_SECRET_MOCK)
      expect(decoded).toEqual({
        user: casualUserMock,
        accessToken: tokensMock.access_token,
        iat: expect.any(Number),
        exp: expect.any(Number),
      })
    })
  })

  describe("getData", () => {
    it("should return validated data with the correct token", () => {
      const payload = { user: casualUserMock, accessToken: tokensMock.access_token }
      const options = { expiresIn: TOKEN_EXPIRY_TIME } as const

      const token = authService.signJWT(payload, options)

      const data = authService.getData(token, JWTEncryptedUserSchema)

      expect(data).toEqual({
        user: casualUserMock,
        accessToken: tokensMock.access_token,
      })
    })

    it("should return undefined with data not matching the schema", () => {
      const data = authService.getData(JWT_INVALID_TOKEN_MOCK, JWTEncryptedUserSchema)
      // Token is invalid, so `undefined` will be checked against the schema hence returning `undefined`

      expect(data).toBeUndefined()
    })
  })

  describe("setCookie", () => {
    it("should write a cookie in the cookie store to store a JWT", async () => {
      authService.setCookie(JWT_TOKEN_MOCK)

      const cookieStore = await cookies()
      const cookieJWT = cookieStore.get(AUTH_COOKIE_NAME)
      expect(cookieJWT?.value as string).toEqual(JWT_TOKEN_MOCK)
    })
  })
})
