import type { Booking } from "@/payload-types"
import { clearCollection, testPayloadObject } from "@/test-config/backend-utils"
import {
  bookingCreateMock,
  bookingCreateMock2,
  bookingMock,
} from "@/test-config/mocks/Booking.mock"
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

  it("should find a booking by ID", async () => {
    // biome-ignore lint/style/noNonNullAssertion: createdBooking is defined in beforeEach().
    const fetchedBooking = await bookingService.getBookingById(createdBooking!.id)
    expect(fetchedBooking).toEqual(createdBooking)
  })

  it("should return null when a booking was not found by ID", async () => {
    const fetchedBooking = await bookingService.getBookingById("Not a Booking ID")
    expect(fetchedBooking).toBeNull()
  })

  it("should find all bookings", async () => {
    const createdBooking2 = await bookingService.createBooking(bookingCreateMock2)

    const allBookings = await bookingService.getAllBookings()
    // TODO: find out if there is an alternative to compare arrays
    expect(allBookings.docs.length).toBe(2)
    expect(allBookings.docs).toContain(createdBooking)
    expect(allBookings.docs).toContain(createdBooking2)
  })

  it("should update a booking", async () => {})

  it("should update a booking with the correct data", async () => {})

  it("should return null when no booking was found to update", async () => {})

  it("should delete a booking", async () => {})

  it("should return null when no booking was found to delete", async () => {})
})
