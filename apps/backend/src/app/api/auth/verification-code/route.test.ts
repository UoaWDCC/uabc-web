import { getReasonPhrase, StatusCodes } from "http-status-codes"
import AuthService from "@/business-layer/services/AuthService"
import MailService from "@/business-layer/services/MailService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { standardAuthCreateMock } from "@/test-config/mocks/Authentication.mock"
import { POST } from "./route"

describe("/api/auth/verification-code", () => {
  const userDataService = new UserDataService()
  const authDataService = new AuthDataService()
  const email = "straightzhao@example.com"

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should create a user and send a verification code email", async () => {
    const code = "123456"
    vi.spyOn(AuthService, "generateVerificationCode").mockResolvedValueOnce(code)
    const sendEmailMock = vi
      .spyOn(MailService, "sendEmailVerificationCode")
      .mockResolvedValueOnce({ success: true })

    const req = createMockNextRequest("/api/auth/verification-code", "POST", { email })
    const res = await POST(req)

    const user = await userDataService.getUserByEmail(email)
    expect(user.emailVerificationCode).toBe(code)
    expect(sendEmailMock).toHaveBeenCalledWith(email, code)
    expect(res.status).toBe(StatusCodes.OK)
    expect(await res.json()).toEqual({ message: "Verification code sent" })
  })

  it("should modify the verification code if a user already exists", async () => {
    const code = "123456"
    const code2 = "234567"
    vi.spyOn(AuthService, "generateVerificationCode").mockResolvedValueOnce(code)
    vi.spyOn(MailService, "sendEmailVerificationCode").mockResolvedValue({ success: true })

    const res = await POST(createMockNextRequest("/api/auth/verification-code", "POST", { email }))

    expect(res.status).toBe(StatusCodes.OK)
    expect(await res.json()).toEqual({ message: "Verification code sent" })
    let user = await userDataService.getUserByEmail(email)
    expect(user.emailVerificationCode).toBe(code)

    vi.spyOn(AuthService, "generateVerificationCode").mockResolvedValueOnce(code2)
    const res2 = await POST(createMockNextRequest("/api/auth/verification-code", "POST", { email }))
    expect(res2.status).toBe(StatusCodes.OK)
    expect(await res2.json()).toEqual({ message: "Verification code sent" })
    user = await userDataService.getUserByEmail(email)
    expect(user.emailVerificationCode).toBe(code2)
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
    const json = await res.json()
    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toBe("Invalid request body")
    expect(json.details).toBeDefined()
  })

  it("should return 500 for internal server error", async () => {
    vi.spyOn(UserDataService.prototype, "createUser").mockRejectedValueOnce(new Error("DB error"))
    const req = createMockNextRequest("/api/auth/verification-code", "POST", { email })
    const res = await POST(req)
    const json = await res.json()
    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  })
})
