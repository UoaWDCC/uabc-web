import {
  emailMock,
  hashedPasswordMock,
  passwordMock,
} from "@/test-config/mocks/Authentication.mock"
import bcrypt from "bcryptjs"
import StandardSecurity from "./standard"

describe("StandardSecurity", () => {
  describe("hashPassword", () => {
    it("returns a hashed password", async () => {
      const hashSpy = vi.spyOn(bcrypt, "hash").mockImplementation(async () => hashedPasswordMock)
      const hash = await StandardSecurity.hashPassword(passwordMock)

      expect(hashSpy).toHaveBeenCalledWith(passwordMock, 10)
      expect(hash).toBe(hashedPasswordMock)
    })
  })

  describe("verifyPassword", () => {
    it("returns true if password matches hash", async () => {
      const compareSpy = vi.spyOn(bcrypt, "compare").mockImplementation(async () => true)
      const result = await StandardSecurity.verifyPassword(passwordMock, hashedPasswordMock)

      expect(compareSpy).toHaveBeenCalledWith(passwordMock, hashedPasswordMock)
      expect(result).toBe(true)
    })

    it("returns false if password does not match hash", async () => {
      const compareSpy = vi.spyOn(bcrypt, "compare").mockImplementation(async () => false)
      const result = await StandardSecurity.verifyPassword(passwordMock, "wrongHash")

      expect(compareSpy).toHaveBeenCalledWith(passwordMock, "wrongHash")
      expect(result).toBe(false)
    })
  })

  // describe("verifyLogin", () => {
  //   it("returns true for valid credentials", async () => {
  //     await userDataService.createUser(userMock)
  //     await authDataService.createAuth(standardAuthCreateMock)

  //     const verifySpy = vi.spyOn(StandardSecurity, "verifyPassword").mockResolvedValue(true)
  //     const result = await StandardSecurity.verifyLogin(emailMock, passwordMock)

  //     expect(verifySpy).toHaveBeenCalledWith(passwordMock, hashedPasswordMock)
  //     expect(result).toBe(true)
  //   })

  //   it("returns false for invalid password", async () => {
  //     await userDataService.createUser(userMock)
  //     await authDataService.createAuth(standardAuthCreateMock)

  //     const verifySpy = vi.spyOn(StandardSecurity, "verifyPassword").mockResolvedValue(false)
  //     const result = await StandardSecurity.verifyLogin(emailMock, "wrongPass")

  //     expect(verifySpy).toHaveBeenCalledWith("wrongPass", hashedPasswordMock)
  //     expect(result).toBe(false)
  //   })

  //   it("returns false if no user found", async () => {
  //     const result = await StandardSecurity.verifyLogin(emailMock, passwordMock)

  //     expect(result).toBe(false)
  //   })
  // })

  describe("validateDetails", () => {
    it("returns true for valid data", async () => {
      const result = await StandardSecurity.validateDetails(emailMock, passwordMock)
      expect(result).toBe(true)
    })

    it("returns false for invalid data", async () => {
      const result = await StandardSecurity.validateDetails("bademail", "pw")
      expect(result).toBe(false)
    })
  })
})
