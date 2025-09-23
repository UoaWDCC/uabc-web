import { dayjs } from "@repo/shared"
import type { GameSession } from "@repo/shared/payload-types"
import { payload } from "@/data-layer/adapters/Payload"
import { bookingMock, bookingWithGameSessionScheduleMock } from "@/test-config/mocks/Booking.mock"
import MailService from "./MailService"

const NOW = dayjs(new Date())

describe("MailService", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("sendEmailVerificationCode", () => {
    it("should call payload.sendEmail with correct parameters", async () => {
      const sendEmailMock = vi.spyOn(payload, "sendEmail").mockResolvedValueOnce({ success: true })

      const email = "test@example.com"
      const code = "123456"

      const result = await MailService.sendEmailVerificationCode(email, code)

      expect(sendEmailMock).toHaveBeenCalledWith({
        to: email,
        subject: "Email verification code",
        text: `Here is your email verification code: ${code}. This code will expire in 10 minutes.`,
      })
      expect(result).toEqual({ success: true })
    })

    it("should propagate errors from payload.sendEmail", async () => {
      const error = new Error("Send failed")
      vi.spyOn(payload, "sendEmail").mockRejectedValueOnce(error)

      await expect(
        MailService.sendEmailVerificationCode("fail@example.com", "111111"),
      ).rejects.toThrow("Send failed")
    })
  })

  describe("sendBookingConfirmation", () => {
    it("should call payload.sendEmail with correct parameters", async () => {
      const sendEmailMock = vi.spyOn(payload, "sendEmail").mockResolvedValueOnce({ success: true })

      const result = await MailService.sendBookingConfirmation(bookingWithGameSessionScheduleMock)

      expect(sendEmailMock).toHaveBeenCalledWith({
        to: "straight.zhao@casual.com",
        subject: "UABC - Monday Booking Confirmation",
        html: expect.stringContaining(
          "Your booking for our Monday session at UoA Rec Center has been confirmed!",
        ),
      })
      expect(result).toEqual({ success: true })
    })
  })

  it.for([
    "Your booking for our Monday session at UoA Rec Center has been confirmed!",
    "Date: <!-- -->Monday<!-- --> <!-- -->23 September",
    `Time: <!-- -->${NOW.format("HH:mm")}<!-- --> - <!-- -->${NOW.format("HH:mm")}`,
    "Location:<!-- --> <!-- -->UoA Rec Center<!-- -->, 17 Symonds Street",
  ])("should handle bookings with a game session schedule", async (expectedString) => {
    const sendEmailMock = vi.spyOn(payload, "sendEmail").mockResolvedValueOnce({ success: true })

    const result = await MailService.sendBookingConfirmation(bookingWithGameSessionScheduleMock)

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: "straight.zhao@casual.com",
      subject: "UABC - Monday Booking Confirmation",
      html: expect.stringContaining(expectedString),
    })
    expect(result).toEqual({ success: true })
  })

  it.for([
    `Your booking for our ${NOW.format("dddd")} session at UABC has been confirmed!`,
    `Date: <!-- -->${NOW.format("dddd").charAt(0) + NOW.format("dddd").slice(1)}<!-- --> <!-- -->23 September`,
    `Time: <!-- -->${NOW.format("HH:mm")}<!-- --> - <!-- -->${NOW.format("HH:mm")}`,
  ])("should handle bookings without a game session schedule", async (expectedString) => {
    const sendEmailMock = vi.spyOn(payload, "sendEmail").mockResolvedValueOnce({ success: true })

    const result = await MailService.sendBookingConfirmation(bookingMock)

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: "straight.zhao@casual.com",
      subject: `UABC - ${NOW.format("dddd")} Booking Confirmation`,
      html: expect.stringContaining(expectedString),
    })
    expect(result).toEqual({ success: true })
  })

  it("should handle bookings without any location details", async () => {
    const sendEmailMock = vi.spyOn(payload, "sendEmail").mockResolvedValueOnce({ success: true })

    const mockBookingWithoutLocation = {
      ...bookingMock,
      gameSession: {
        ...(bookingMock.gameSession as GameSession),
        name: undefined,
        location: undefined,
      },
    }

    const result = await MailService.sendBookingConfirmation(mockBookingWithoutLocation)

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: "straight.zhao@casual.com",
      subject: `UABC - ${NOW.format("dddd")} Booking Confirmation`,
      html: expect.stringContaining(
        "Location:<!-- --> <!-- -->Please contact UABC to find out where this session will be!",
      ),
    })
    expect(result).toEqual({ success: true })
  })

  it("should propagate errors from payload.sendEmail", async () => {
    const error = new Error("Send failed")
    vi.spyOn(payload, "sendEmail").mockRejectedValueOnce(error)

    await expect(
      MailService.sendBookingConfirmation(bookingWithGameSessionScheduleMock),
    ).rejects.toThrow("Send failed")
  })
})
