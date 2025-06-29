import bcrypt from "bcryptjs"
import {
  EMAIL_MOCK,
  HASHED_PASSWORD_MOCK,
  PASSWORD_MOCK,
} from "@/test-config/mocks/Authentication.mock"
import StandardSecurity from "./standard"

describe("StandardSecurity", () => {
  describe("hashPassword", () => {
    it("returns a hashed password", async () => {
      const hashSpy = vi.spyOn(bcrypt, "hash").mockImplementation(async () => HASHED_PASSWORD_MOCK)
      const hash = await StandardSecurity.hashPassword(PASSWORD_MOCK)

      expect(hashSpy).toHaveBeenCalledWith(PASSWORD_MOCK, 10)
      expect(hash).toBe(HASHED_PASSWORD_MOCK)
    })
  })

  describe("verifyPassword", () => {
    it("returns true if password matches hash", async () => {
      const compareSpy = vi.spyOn(bcrypt, "compare").mockImplementation(async () => true)
      const result = await StandardSecurity.verifyPassword(PASSWORD_MOCK, HASHED_PASSWORD_MOCK)

      expect(compareSpy).toHaveBeenCalledWith(PASSWORD_MOCK, HASHED_PASSWORD_MOCK)
      expect(result).toBe(true)
    })

    it("returns false if password does not match hash", async () => {
      const compareSpy = vi.spyOn(bcrypt, "compare").mockImplementation(async () => false)
      const result = await StandardSecurity.verifyPassword(PASSWORD_MOCK, "wrongHash")

      expect(compareSpy).toHaveBeenCalledWith(PASSWORD_MOCK, "wrongHash")
      expect(result).toBe(false)
    })
  })

  describe("validateDetails", () => {
    it("returns true for valid data", async () => {
      const result = await StandardSecurity.validateDetails(EMAIL_MOCK, PASSWORD_MOCK)
      expect(result).toBe(true)
    })

    it("returns false for invalid data", async () => {
      const result = await StandardSecurity.validateDetails("bademail", "pw")
      expect(result).toBe(false)
    })
  })
})
