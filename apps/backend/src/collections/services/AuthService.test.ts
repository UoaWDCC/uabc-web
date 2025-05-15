import { clearCollection, testPayloadObject } from "@/test-config/backend-utils"
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
import AuthService from "./AuthService"

dotenv.config()

const authService = new AuthService()

describe("auth service", () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, "authentication")
    await clearCollection(testPayloadObject, "user")
    vi.restoreAllMocks()
  })

  it("should create an authentication document for google auth", async () => {
    // Create user first so that the auth mock will have an existent user
    await testPayloadObject.create({
      collection: "user",
      data: userMock,
    })

    const newAuth = await authService.createAuth(googleAuthCreateMock)
    const fetchedAuth = await testPayloadObject.find({
      collection: "authentication",
      where: {
        id: {
          equals: newAuth.id,
        },
      },
    })
    expect(fetchedAuth.docs[0]).toEqual(newAuth)
  })

  it("should create an authentication document for standard auth", async () => {
    // Create user first so that the auth mock will have an existent user
    await testPayloadObject.create({
      collection: "user",
      data: userMock,
    })

    const newAuth = await authService.createAuth(standardAuthCreateMock)
    const fetchedAuth = await testPayloadObject.find({
      collection: "authentication",
      where: {
        id: {
          equals: newAuth.id,
        },
      },
    })
    expect(fetchedAuth.docs[0]).toEqual(newAuth)
  })

  describe("hashPassword", () => {
    it("returns a hashed password", async () => {
      const hashSpy = vi.spyOn(bcrypt, "hash").mockImplementation(async () => hashedPasswordMock)
      const hash = await authService.hashPassword(passwordMock)

      expect(hashSpy).toHaveBeenCalledWith(passwordMock, 10)
      expect(hash).toBe(hashedPasswordMock)
    })
  })

  describe("verifyPassword", () => {
    it("returns true if password matches hash", async () => {
      const compareSpy = vi.spyOn(bcrypt, "compare").mockImplementation(async () => true)
      const result = await authService.verifyPassword(passwordMock, hashedPasswordMock)

      expect(compareSpy).toHaveBeenCalledWith(passwordMock, hashedPasswordMock)
      expect(result).toBe(true)
    })

    it("returns false if password does not match hash", async () => {
      const compareSpy = vi.spyOn(bcrypt, "compare").mockImplementation(async () => false)
      const result = await authService.verifyPassword(passwordMock, "wrongHash")

      expect(compareSpy).toHaveBeenCalledWith(passwordMock, "wrongHash")
      expect(result).toBe(false)
    })
  })

  describe("verifyLogin", () => {
    it("returns true for valid credentials", async () => {
      await testPayloadObject.create({
        collection: "user",
        data: userMock,
      })

      await authService.createAuth(standardAuthCreateMock)

      const verifySpy = vi.spyOn(authService, "verifyPassword").mockResolvedValue(true)
      const result = await authService.verifyLogin(emailMock, passwordMock)

      expect(verifySpy).toHaveBeenCalledWith(passwordMock, hashedPasswordMock)
      expect(result).toBe(true)
    })

    it("returns false for invalid password", async () => {
      await testPayloadObject.create({
        collection: "user",
        data: userMock,
      })

      await authService.createAuth(standardAuthCreateMock)

      const verifySpy = vi.spyOn(authService, "verifyPassword").mockResolvedValue(false)
      const result = await authService.verifyLogin(emailMock, "wrongPass")

      expect(verifySpy).toHaveBeenCalledWith("wrongPass", hashedPasswordMock)
      expect(result).toBe(false)
    })

    it("returns false if no user found", async () => {
      const result = await authService.verifyLogin(emailMock, passwordMock)

      expect(result).toBe(false)
    })
  })

  describe("validateDetails", () => {
    it("returns true for valid data", async () => {
      const result = await authService.validateDetails(emailMock, passwordMock)
      expect(result).toBe(true)
    })

    it("returns false for invalid data", async () => {
      const result = await authService.validateDetails("bademail", "pw")
      expect(result).toBe(false)
    })
  })
})
