import { render } from "@react-email/components"
import { capitalize, formatDayMonth, formatTime24Hour, formatWeekday } from "@repo/shared"
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
      replyTo: ["badminton.au@gmail.com", "uabcbookings@gmail.com"],
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

    const date = formatDayMonth(gameSession.startTime)
    const rawWeekday = gameSessionSchedule?.day || formatWeekday(gameSession.startTime)
    const weekday = capitalize(rawWeekday)
    const startTime = formatTime24Hour(gameSession.startTime)
    const endTime = formatTime24Hour(gameSession.endTime)
    const sessionName = (gameSessionSchedule?.name ?? gameSession.name) as string
    const sessionLocation = (gameSessionSchedule?.location ?? gameSession.location) as string
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
      replyTo: ["badminton.au@gmail.com", "uabcbookings@gmail.com"],
      subject: `UABC - ${weekday} Booking Confirmation`,
      html,
    })
  }
}
