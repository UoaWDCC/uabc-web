import { bookingCreateMock, bookingCreateMock2 } from "@/test-config/mocks/Booking.mock"
import type { EditBookingData } from "@/types/collections"
import { payload } from "../adapters/Payload"
import BookingService from "./BookingService"

const bookingService = new BookingService()

describe("BookingService", () => {
  describe("createBooking", () => {
    it("should create a booking document", async () => {
      const createdBooking = await bookingService.createBooking(bookingCreateMock)

      const fetchedBooking = await payload.findByID({
        collection: "booking",
        id: createdBooking.id,
      })
      expect(fetchedBooking).toEqual(createdBooking)
    })
  })

  describe("getBookingById", () => {
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
  })

  describe("getAllBookings", () => {
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
  })

  describe("updateBooking", () => {
    it("should update a booking with the correct data", async () => {
      const createdBooking = await bookingService.createBooking(bookingCreateMock)
      const updateData: EditBookingData = {
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
      const updateData: EditBookingData = {
        playerLevel: "intermediate",
      }

      await expect(() =>
        bookingService.updateBooking("Not a booking ID", updateData),
      ).rejects.toThrowError("Not Found")
    })
  })

  describe("deleteBooking", () => {
    it("should delete a booking successfully", async () => {
      const createdBooking = await bookingService.createBooking(bookingCreateMock)
      const deletedBooking = await bookingService.deleteBooking(createdBooking.id)
      expect(deletedBooking).toEqual(createdBooking)

      await expect(() =>
        payload.findByID({
          collection: "booking",
          id: createdBooking.id,
        }),
      ).rejects.toThrowError("Not Found")
    })

    it("should throw a Not Found error when no booking is found to delete", async () => {
      await expect(() => bookingService.deleteBooking("Not a booking ID")).rejects.toThrowError(
        "Not Found",
      )
    })
  })
})
