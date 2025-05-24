import { JWT_INVALID_TOKEN_MOCK, JWT_TOKEN_MOCK } from "@/test-config/mocks/AuthService.mock"
import { JWT_SECRET_MOCK, tokensMock } from "@/test-config/mocks/GoogleAuth.mock"
import { userMock } from "@/test-config/mocks/User.mock"
import { JWTEncryptedUserSchema } from "@repo/shared"
import jwt from "jsonwebtoken"

vi.mock("jsonwebtoken", () => {
  return {
    default: {
      verify: vi.fn((token: string, secret: string) => {
        if (token === JWT_TOKEN_MOCK && secret === JWT_SECRET_MOCK) {
          return {
            user: userMock,
            accessToken: tokensMock.access_token,
          }
        }
      }),
      sign: vi.fn((payload: Record<string, unknown>, secret: string, _options: object) => {
        if (
          payload.user === userMock &&
          payload.accessToken === tokensMock.access_token &&
          secret === JWT_SECRET_MOCK
        ) {
          return JWT_TOKEN_MOCK
        }
      }),
    },
  }
})

import AuthService from "./AuthService"

describe("AuthService", () => {
  describe("signJWT", () => {
    it("should sign a JWT token and return it", () => {
      const authService = new AuthService()
      const payload = { user: userMock, accessToken: tokensMock.access_token }
      const options = { expiresIn: "1h" } as const

      const token = authService.signJWT(payload, options)
      expect(jwt.sign).toHaveBeenCalledWith(payload, JWT_SECRET_MOCK, options)
      expect(token).toBe(JWT_TOKEN_MOCK)
    })
  })

  describe("getData", () => {
    it("should return validated data with the correct token", () => {
      const authService = new AuthService()
      const data = authService.getData(JWT_TOKEN_MOCK, JWTEncryptedUserSchema)

      expect(jwt.verify).toHaveBeenCalledWith(JWT_TOKEN_MOCK, JWT_SECRET_MOCK)
      expect(data).toEqual({
        user: userMock,
        accessToken: tokensMock.access_token,
      })
    })

    it("should return undefined with data not matching the schema", () => {
      const authService = new AuthService()
      const data = authService.getData(JWT_INVALID_TOKEN_MOCK, JWTEncryptedUserSchema)
      // Token is invalid, so `undefined` will be checked against the schema hence returning `undefined`

      expect(jwt.verify).toHaveBeenCalledWith(JWT_INVALID_TOKEN_MOCK, JWT_SECRET_MOCK)
      expect(data).toBeUndefined()
    })
  })
})
