import { render } from "@react-email/components"
import { dayjs } from "@repo/shared"
import type { Booking, GameSession, GameSessionSchedule, User } from "@repo/shared/payload-types"
import { payload } from "@/data-layer/adapters/Payload"
import BookingConfirmationEmail from "@/emails/BookingConfirmationEmail"

export default class MailService {
  /**
   * Send an email verification code to the user's email address.
   *
   * @param email The email address of the user.
   * @param verificationCode The verification code to be sent.
   */
  public static async sendEmailVerificationCode(email: string, verificationCode: string) {
    return await payload.sendEmail({
      to: email,
      subject: "Email verification code",
      text: `Here is your email verification code: ${verificationCode}. This code will expire in 10 minutes.`,
    })
  }

  /**
   * Sends a booking confirmation email to the user.
   *
   * @param booking The booking details.
   */
  public static async sendBookingConfirmation(booking: Booking) {
    const email = (booking.user as User).email
    const gameSession = booking.gameSession as GameSession
    const gameSessionSchedule = gameSession.gameSessionSchedule as GameSessionSchedule | undefined

    const date = dayjs(gameSession.startTime).format("D MMMM")
    const rawWeekday = gameSessionSchedule?.day || dayjs(gameSession.startTime).format("dddd")
    const weekday = rawWeekday.charAt(0).toUpperCase() + rawWeekday.slice(1)
    const startTime = dayjs(gameSession.startTime).format("HH:mm")
    const endTime = dayjs(gameSession.endTime).format("HH:mm")
    const sessionName = gameSessionSchedule?.name || gameSession.name || "UABC"
    const sessionLocation = gameSessionSchedule?.location || gameSession.location || undefined
    const html = await render(
      BookingConfirmationEmail({
        date,
        weekday,
        startTime,
        endTime,
        sessionName,
        sessionLocation,
      }),
    )
    return await payload.sendEmail({
      to: email,
      subject: `UABC - ${weekday} Booking Confirmation`,
      html: html,
    })
  }
}
