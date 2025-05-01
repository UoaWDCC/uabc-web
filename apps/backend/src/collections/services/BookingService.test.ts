import type { Booking } from "@/payload-types"
import { clearCollection, testPayloadObject } from "@/test-config/backend-utils"
import { bookingCreateMock, bookingCreateMock2 } from "@/test-config/mocks/Booking.mock"
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
    expect(allBookings.docs).toEqual(expect.arrayContaining([createdBooking, createdBooking2]))
  })

  it("should update a booking with the correct data", async () => {
    const updateData: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt">> = {
      playerLevel: "intermediate",
    }

    // biome-ignore lint/style/noNonNullAssertion: createdBooking is defined in beforeEach().
    const updatedBooking = await bookingService.updateBooking(createdBooking!.id, updateData)
    expect(updatedBooking).toEqual({
      ...createdBooking,
      playerLevel: updateData.playerLevel,
      updatedAt: updatedBooking?.updatedAt,
    })
  })

  it("should return null when no booking was found to update", async () => {
    const updateData: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt">> = {
      playerLevel: "intermediate",
    }

    const updatedBooking = await bookingService.updateBooking("Not a booking ID", updateData)
    expect(updatedBooking).toBeNull()
  })

  it("should delete a booking successfully", async () => {
    // biome-ignore lint/style/noNonNullAssertion: createdBooking is defined in beforeEach().
    const deletedBooking = await bookingService.deleteBooking(createdBooking!.id)
    expect(deletedBooking).toEqual(createdBooking)

    const fetchedBookings = await testPayloadObject.find({
      collection: "booking",
      where: {
        id: {
          // biome-ignore lint/style/noNonNullAssertion: createdBooking is defined in beforeEach().
          equals: createdBooking!.id,
        },
      },
    })
    expect(fetchedBookings.docs).toHaveLength(0)
  })

  it("should return null when no booking was found to delete", async () => {
    const deletedBooking = await bookingService.deleteBooking("Not a booking ID")
    expect(deletedBooking).toBeNull()

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
})
