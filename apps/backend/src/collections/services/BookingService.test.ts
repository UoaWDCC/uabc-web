import type { Booking } from "@/payload-types"
import { clearCollection, testPayloadObject } from "@/test-config/backend-utils"
import { bookingCreateMock, bookingCreateMock2 } from "@/test-config/mocks/Booking.mock"
import dotenv from "dotenv"
import BookingService from "./BookingService"

dotenv.config()

const bookingService = new BookingService()

describe("booking service", () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, "booking")
  })

  it("should create a booking document", async () => {
    const createdBooking = await bookingService.createBooking(bookingCreateMock)

    const fetchedBooking = await testPayloadObject.find({
      collection: "booking",
      where: {
        id: {
          equals: createdBooking.id,
        },
      },
    })
    expect(fetchedBooking.docs[0]).toEqual(createdBooking)
  })

  it("should find a booking by ID", async () => {
    const createdBooking = await bookingService.createBooking(bookingCreateMock)

    const fetchedBooking = await bookingService.getBookingById(createdBooking.id)
    expect(fetchedBooking).toEqual(createdBooking)
  })

  it("should throw a Not Found error when a booking is not found by ID", async () => {
    await expect(() => bookingService.getBookingById("Not a Booking ID")).rejects.toThrowError(
      "Not Found",
    )
  })

  it("should find all bookings", async () => {
    const createdBooking = await bookingService.createBooking(bookingCreateMock)
    const createdBooking2 = await bookingService.createBooking(bookingCreateMock2)

    // Test getting pages (with 1 Booking per page).
    const limit = 1
    expect((await bookingService.getAllBookings(limit, 1)).docs).toEqual(
      expect.arrayContaining([createdBooking2]),
    )
    expect((await bookingService.getAllBookings(limit, 2)).docs).toEqual(
      expect.arrayContaining([createdBooking]),
    )
  })

  it("should update a booking with the correct data", async () => {
    const createdBooking = await bookingService.createBooking(bookingCreateMock)
    const updateData: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt">> = {
      playerLevel: "intermediate",
    }

    const updatedBooking = await bookingService.updateBooking(createdBooking.id, updateData)
    expect(updatedBooking).toEqual({
      ...createdBooking,
      playerLevel: updateData.playerLevel,
      updatedAt: updatedBooking?.updatedAt,
    })
  })

  it("should throw a Not Found error when no booking is found to update", async () => {
    const updateData: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt">> = {
      playerLevel: "intermediate",
    }

    await expect(() =>
      bookingService.updateBooking("Not a booking ID", updateData),
    ).rejects.toThrowError("Not Found")
  })

  it("should delete a booking successfully", async () => {
    const createdBooking = await bookingService.createBooking(bookingCreateMock)
    const deletedBooking = await bookingService.deleteBooking(createdBooking.id)
    expect(deletedBooking).toEqual(createdBooking)

    const fetchedBookings = await testPayloadObject.find({
      collection: "booking",
      where: {
        id: {
          equals: createdBooking.id,
        },
      },
    })
    expect(fetchedBookings.docs).toHaveLength(0)
  })

  it("should throw a Not Found error when no booking is found to delete", async () => {
    await expect(() => bookingService.deleteBooking("Not a booking ID")).rejects.toThrowError(
      "Not Found",
    )
  })
})
