import { payload } from "@/data-layer/adapters/Payload"
import { clearCollection } from "@/test-config/backend-utils"
import {
  emailMock,
  googleAuthCreateMock,
  hashedPasswordMock,
  passwordMock,
  standardAuthCreateMock,
} from "@/test-config/mocks/Authentication.mock"
import { userMock } from "@/test-config/mocks/User.mock"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import AuthDataService from "./AuthDataService"
import UserDataService from "./UserDataService"

const authDataService = new AuthDataService()
const userDataService = new UserDataService()

dotenv.config()

describe("auth service", () => {
  afterEach(async () => {
    await clearCollection(payload, "authentication")
    await clearCollection(payload, "user")
    vi.restoreAllMocks()
  })

  it("should create an authentication document for google auth", async () => {
    await userDataService.createUser(userMock)

    const newAuth = await authDataService.createAuth(googleAuthCreateMock)
    const fetchedAuth = await payload.findByID({
      collection: "authentication",
      id: newAuth.id,
    })
    expect(fetchedAuth).toEqual(newAuth)
  })

  it("should create an authentication document for standard auth", async () => {
    await userDataService.createUser(userMock)

    const newAuth = await authDataService.createAuth(standardAuthCreateMock)
    const fetchedAuth = await payload.findByID({
      collection: "authentication",
      id: newAuth.id,
    })
    expect(fetchedAuth).toEqual(newAuth)
  })

  describe("hashPassword", () => {
    it("returns a hashed password", async () => {
      const hashSpy = vi.spyOn(bcrypt, "hash").mockImplementation(async () => hashedPasswordMock)
      const hash = await authDataService.hashPassword(passwordMock)

      expect(hashSpy).toHaveBeenCalledWith(passwordMock, 10)
      expect(hash).toBe(hashedPasswordMock)
    })
  })

  describe("verifyPassword", () => {
    it("returns true if password matches hash", async () => {
      const compareSpy = vi.spyOn(bcrypt, "compare").mockImplementation(async () => true)
      const result = await authDataService.verifyPassword(passwordMock, hashedPasswordMock)

      expect(compareSpy).toHaveBeenCalledWith(passwordMock, hashedPasswordMock)
      expect(result).toBe(true)
    })

    it("returns false if password does not match hash", async () => {
      const compareSpy = vi.spyOn(bcrypt, "compare").mockImplementation(async () => false)
      const result = await authDataService.verifyPassword(passwordMock, "wrongHash")

      expect(compareSpy).toHaveBeenCalledWith(passwordMock, "wrongHash")
      expect(result).toBe(false)
    })
  })

  describe("verifyLogin", () => {
    it("returns true for valid credentials", async () => {
      await userDataService.createUser(userMock)
      await authDataService.createAuth(standardAuthCreateMock)

      const verifySpy = vi.spyOn(authDataService, "verifyPassword").mockResolvedValue(true)
      const result = await authDataService.verifyLogin(emailMock, passwordMock)

      expect(verifySpy).toHaveBeenCalledWith(passwordMock, hashedPasswordMock)
      expect(result).toBe(true)
    })

    it("returns false for invalid password", async () => {
      await userDataService.createUser(userMock)
      await authDataService.createAuth(standardAuthCreateMock)

      const verifySpy = vi.spyOn(authDataService, "verifyPassword").mockResolvedValue(false)
      const result = await authDataService.verifyLogin(emailMock, "wrongPass")

      expect(verifySpy).toHaveBeenCalledWith("wrongPass", hashedPasswordMock)
      expect(result).toBe(false)
    })

    it("returns false if no user found", async () => {
      const result = await authDataService.verifyLogin(emailMock, passwordMock)

      expect(result).toBe(false)
    })
  })

  describe("validateDetails", () => {
    it("returns true for valid data", async () => {
      const result = await authDataService.validateDetails(emailMock, passwordMock)
      expect(result).toBe(true)
    })

    it("returns false for invalid data", async () => {
      const result = await authDataService.validateDetails("bademail", "pw")
      expect(result).toBe(false)
    })
  })
})
