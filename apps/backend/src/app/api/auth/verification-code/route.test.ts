import { casualUserMock, userCreateMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import AuthService from "@/business-layer/services/AuthService"
import MailService from "@/business-layer/services/MailService"
import { payload } from "@/data-layer/adapters/Payload"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { clearCollection, createMockNextRequest } from "@/test-config/backend-utils"
import { standardAuthCreateMock } from "@/test-config/mocks/Authentication.mock"
import { POST } from "./route"

describe("/api/auth/verification-code", () => {
  const userDataService = new UserDataService()
  const authDataService = new AuthDataService()
  const email = "straightzhao@example.com"

  beforeEach(async () => {
    await clearCollection(payload, "user")
    await clearCollection(payload, "authentication")
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should create a user and send a verification code email", async () => {
    const code = "123456"
    vi.spyOn(AuthService, "generateVerificationCode").mockResolvedValueOnce(code)
    const sendEmailMock = vi
      .spyOn(MailService, "sendEmailVerificationCode")
      .mockResolvedValueOnce({ success: true })

    const req = createMockNextRequest("", "POST", { email })
    const res = await POST(req)

    const user = await userDataService.getUserByEmail(email)
    expect(user.emailVerification).toContainEqual({
      id: expect.any(String),
      verificationCode: code,
      createdAt: expect.any(String),
      expiresAt: expect.any(String),
    })
    expect(sendEmailMock).toHaveBeenCalledWith(email, code)
    expect(res.status).toBe(StatusCodes.OK)
    expect(await res.json()).toEqual({ message: "Verification code sent" })
  })

  it("should add a the verification code if a user already exists", async () => {
    const code = "123456"
    const code2 = "234567"
    vi.spyOn(AuthService, "generateVerificationCode").mockResolvedValueOnce(code)
    vi.spyOn(MailService, "sendEmailVerificationCode").mockResolvedValue({ success: true })

    const res = await POST(createMockNextRequest("/api/auth/verification-code", "POST", { email }))

    expect(res.status).toBe(StatusCodes.OK)
    expect(await res.json()).toEqual({ message: "Verification code sent" })
    let user = await userDataService.getUserByEmail(email)
    expect(user.emailVerification).toContainEqual({
      id: expect.any(String),
      verificationCode: code,
      createdAt: expect.any(String),
      expiresAt: expect.any(String),
    })

    vi.spyOn(AuthService, "generateVerificationCode").mockResolvedValueOnce(code2)

    const res2 = await POST(createMockNextRequest("/api/auth/verification-code", "POST", { email }))

    expect(res2.status).toBe(StatusCodes.OK)
    expect(await res2.json()).toEqual({ message: "Verification code sent" })
    user = await userDataService.getUserByEmail(email)
    expect(user.emailVerification).toContainEqual({
      id: expect.any(String),
      verificationCode: code2,
      createdAt: expect.any(String),
      expiresAt: expect.any(String),
    })
  })

  it("should add a new verification code correctly if a user has an undefined emailVerification field", async () => {
    await userDataService.createUser({
      ...userCreateMock,
      email,
    })

    const code = "123456"
    vi.spyOn(AuthService, "generateVerificationCode").mockResolvedValueOnce(code)
    vi.spyOn(MailService, "sendEmailVerificationCode").mockResolvedValue({ success: true })

    const res = await POST(createMockNextRequest("/api/auth/verification-code", "POST", { email }))

    expect(res.status).toBe(StatusCodes.OK)
    expect(await res.json()).toEqual({ message: "Verification code sent" })

    const user = await userDataService.getUserByEmail(email)
    expect(user.emailVerification).toContainEqual({
      id: expect.any(String),
      verificationCode: code,
      createdAt: expect.any(String),
      expiresAt: expect.any(String),
    })
  })

  it("should return a 409 if a user already exists", async () => {
    await authDataService.createAuth({ ...standardAuthCreateMock, email })

    const res = await POST(createMockNextRequest("/api/auth/verification-code", "POST", { email }))

    expect(res.status).toBe(StatusCodes.CONFLICT)
    expect(await res.json()).toEqual({ error: "A user with that email already exists" })
  })

  it("should return 400 for invalid request body", async () => {
    const res = await POST(
      createMockNextRequest("/api/auth/verification-code", "POST", {
        email: "not-an-email",
      }),
    )

    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    const json = await res.json()
    expect(json.error).toBe("Invalid request body")
    expect(json.details).toBeDefined()
  })

  it("should return 429 if the user has reached the maximum number of verification codes", async () => {
    vi.spyOn(UserDataService.prototype, "getUserByEmail").mockResolvedValueOnce({
      ...casualUserMock,
      emailVerification: Array.from({ length: 5 }, (_, i) => ({
        verificationCode: `${i * 100000}`,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })),
    })

    const req = createMockNextRequest("/api/auth/verification-code", "POST", { email })
    const res = await POST(req)

    expect(res.status).toBe(StatusCodes.TOO_MANY_REQUESTS)
    const json = await res.json()
    expect(json.error).toBe("Maximum number of verification codes reached")
  })

  it("should return 500 for internal server error", async () => {
    vi.spyOn(UserDataService.prototype, "createUser").mockRejectedValueOnce(new Error("DB error"))

    const req = createMockNextRequest("/api/auth/verification-code", "POST", { email })
    const res = await POST(req)

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    const json = await res.json()
    expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  })
})
