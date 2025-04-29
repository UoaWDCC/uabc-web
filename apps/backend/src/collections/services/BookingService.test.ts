import type { Booking } from "@/payload-types"
import { clearCollection, testPayloadObject } from "@/test-config/backend-utils"
import { bookingCreateMock, bookingMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionMock } from "@/test-config/mocks/GameSession.mock"
import { userMock } from "@/test-config/mocks/User.mock"
import dotenv from "dotenv"
import BookingService from "./BookingService"

dotenv.config()

const bookingService = new BookingService()
let createdBooking: Booking | undefined

describe("booking service", () => {
  beforeEach(async () => {
    createdBooking = await bookingService.createBooking(bookingCreateMock)
  })

  afterEach(async () => {
    createdBooking = undefined
    await clearCollection(testPayloadObject, "booking")
  })

  it("should create a booking document", async () => {
    const fetchedBooking = await testPayloadObject.find({
      collection: "booking",
      where: {
        id: {
          // biome-ignore lint/style/noNonNullAssertion: createdBooking is defined in beforeEach().
          equals: createdBooking!.id,
        },
      },
    })
    expect(fetchedBooking.docs[0]).toEqual(createdBooking)
  })

  it("should create a booking document with the correct data", async () => {
    expect(bookingMock).toEqual(createdBooking)
  })

  it("should find bookings by game session", async () => {
    const fetchedBookings = await bookingService.getBookingsByGameSession(gameSessionMock)
    expect(fetchedBookings?.docs[0]).toEqual(createdBooking)
  })

  it("should return null when no bookings are found by game session", async () => {})

  it("should find a booking by ID", async () => {
    // biome-ignore lint/style/noNonNullAssertion: createdBooking is defined in beforeEach().
    const fetchedBooking = await bookingService.getBookingById(createdBooking!.id)
    expect(fetchedBooking).toEqual(createdBooking)
  })

  it("should return null when a booking was not found by ID", async () => {
    const fetchedBooking = await bookingService.getBookingById("Not a Booking ID")
    expect(fetchedBooking).toBeNull()
  })

  it("should find bookings by user", async () => {
    const fetchedBookings = await bookingService.getBookingsByUser(userMock)
    expect(fetchedBookings?.docs[0]).toEqual(createdBooking)
  })

  it("should return null when no bookings are found by user", async () => {})

  it("should update a booking", async () => {})

  it("should update a booking with the correct data", async () => {})

  it("should return null when no booking was found to update", async () => {})

  it("should delete a booking", async () => {})

  it("should return null when no booking was found to delete", async () => {})
})
