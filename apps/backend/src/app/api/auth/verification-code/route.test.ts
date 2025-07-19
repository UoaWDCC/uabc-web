import { getReasonPhrase, StatusCodes } from "http-status-codes"
import AuthService from "@/business-layer/services/AuthService"
import MailService from "@/business-layer/services/MailService"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { POST } from "./route"

describe("/api/auth/verification-code", () => {
  const userDataService = new UserDataService()
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

    expect(await userDataService.getUserByEmail(email)).toBeDefined()
    expect(sendEmailMock).toHaveBeenCalledWith(email, code)
    // No explicit response, so expect undefined or void
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ message: "Verification code sent" })
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
