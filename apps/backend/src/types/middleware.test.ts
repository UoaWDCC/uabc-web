import { userMock } from "../test-config/mocks/User.mock"
import { JWTResponseSchema } from "./middleware"

describe("JWTResponseSchema", () => {
  it("should validate a valid JWT response", () => {
    const valid = {
      user: userMock,
      access_token: "token123",
    }
    expect(JWTResponseSchema.parse(valid)).toBeDefined()
  })

  it("should reject a JWT response with missing access_token", () => {
    const invalid = {
      user: userMock,
      // access_token is missing
    }
    expect(() => JWTResponseSchema.parse(invalid)).toThrow()
  })

  it("should reject a JWT response with missing user", () => {
    const invalid = {
      // user is missing
      access_token: "token123",
    }
    expect(() => JWTResponseSchema.parse(invalid)).toThrow()
  })

  it("should reject a JWT response with malformed user", () => {
    const { firstName, ...malformedUser } = userMock
    const invalid = {
      user: malformedUser,
      access_token: "token123",
    }
    expect(() => JWTResponseSchema.parse(invalid)).toThrow()
  })
})
