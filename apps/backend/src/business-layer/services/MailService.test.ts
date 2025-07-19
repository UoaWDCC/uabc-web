import { payload } from "@/data-layer/adapters/Payload"
import MailService from "./MailService"

describe("MailService", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("sendEmailVerificationCode", () => {
    it("should call payload.sendEmail with correct parameters", async () => {
      const sendEmailMock = vi.spyOn(payload, "sendEmail").mockResolvedValueOnce({ success: true })

      const email = "test@example.com"
      const code = 123456

      const result = await MailService.sendEmailVerificationCode(email, code)

      expect(sendEmailMock).toHaveBeenCalledWith({
        to: email,
        subject: "Email verification code",
        text: `Here is your email verification code: ${code}`,
      })
      expect(result).toEqual({ success: true })
    })

    it("should propagate errors from payload.sendEmail", async () => {
      const error = new Error("Send failed")
      vi.spyOn(payload, "sendEmail").mockRejectedValueOnce(error)

      await expect(
        MailService.sendEmailVerificationCode("fail@example.com", 111111),
      ).rejects.toThrow("Send failed")
    })
  })
})
