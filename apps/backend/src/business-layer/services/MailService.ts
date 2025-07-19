import { payload } from "@/data-layer/adapters/Payload"

export default class AuthService {
  /**
   * Send an email verification code to the user's email address.
   *
   * @param email The email address of the user.
   * @param verificationCode The verification code to be sent.
   */
  public static async sendEmailVerificationCode(email: string, verificationCode: number) {
    return await payload.sendEmail({
      to: email,
      subject: "Email verification code",
      text: `Here is your email verification code: ${verificationCode}`,
    })
  }
}
