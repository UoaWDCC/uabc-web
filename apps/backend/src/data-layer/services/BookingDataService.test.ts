import type { EditBookingData } from "@repo/shared"
import { casualUserMock } from "@repo/shared/mocks"
import { bookingCreateMock, bookingCreateMock2 } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { payload } from "../adapters/Payload"
import BookingDataService from "./BookingDataService"
import GameSessionDataService from "./GameSessionDataService"

const bookingDataService = new BookingDataService()
const gameSessionDataService = new GameSessionDataService()

describe("bookingDataService", () => {
  describe("createBooking", () => {
    it("should create a booking document", async () => {
      const createdBooking = await bookingDataService.createBooking(bookingCreateMock)

      const fetchedBooking = await payload.findByID({
        collection: "booking",
        id: createdBooking.id,
      })
      expect(fetchedBooking).toEqual(createdBooking)
    })
  })

  describe("getBookingById", () => {
    it("should find a booking by ID", async () => {
      const createdBooking = await bookingDataService.createBooking(bookingCreateMock)

      const fetchedBooking = await bookingDataService.getBookingById(createdBooking.id)
      expect(fetchedBooking).toEqual(createdBooking)
    })

    it("should throw a Not Found error when a booking is not found by ID", async () => {
      await expect(() =>
        bookingDataService.getBookingById("Not a Booking ID"),
      ).rejects.toThrowError("Not Found")
    })
  })

  describe("getBookingBySessionId", () => {
    it("should fetch bookings by session ID", async () => {
      const createdGameSession =
        await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const createdBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: createdGameSession.id,
      })

      const fetchedBooking = await bookingDataService.getBookingsBySessionId(createdGameSession.id)
      expect(fetchedBooking.length).toEqual(1)
      expect(fetchedBooking).toEqual([createdBooking])
    })

    it("should return an empty array when a booking is not found for session ID", async () => {
      expect(
        await bookingDataService.getBookingsBySessionId("Not a valid session ID"),
      ).toStrictEqual([])
    })
  })

  describe("getAllBookingsByUserId", () => {
    it("should find all bookings by userId", async () => {
      const createdBooking1 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: casualUserMock,
      })
      const createdBooking2 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: casualUserMock,
      })

      const fetchedBookings = await bookingDataService.getAllBookingsByUserId(casualUserMock.id)

      expect(fetchedBookings.length).toStrictEqual(2)
      expect(fetchedBookings).toStrictEqual(
        expect.arrayContaining([createdBooking1, createdBooking2]),
      )
    })

    it("should return empty array if there are no bookings by userId", async () => {
      const fetchedBooking = await bookingDataService.getAllBookingsByUserId("No bookings userId")
      expect(fetchedBooking).toStrictEqual([])
    })
  })

  describe("getUserBookingsBySessionId", () => {
    it("should find all bookings by userId and sessionId", async () => {
      const createdBooking1 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: casualUserMock,
      })
      const createdBooking2 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: casualUserMock,
      })

      const fetchedBookings = await bookingDataService.getUserBookingsBySessionId(
        casualUserMock.id,
        typeof createdBooking1.gameSession === "string"
          ? createdBooking1.gameSession
          : createdBooking1.gameSession.id,
      )

      expect(fetchedBookings.length).toStrictEqual(2)
      expect(fetchedBookings).toStrictEqual(
        expect.arrayContaining([createdBooking1, createdBooking2]),
      )
    })

    it("should return empty array if there are no bookings by userId and sessionId", async () => {
      const fetchedBooking = await bookingDataService.getUserBookingsBySessionId(
        "No bookings userId",
        "No bookings sessionId",
      )
      expect(fetchedBooking).toStrictEqual([])
    })
  })

  describe("getAllBookings", () => {
    it("should find all bookings", async () => {
      const createdBooking = await bookingDataService.createBooking(bookingCreateMock)
      const createdBooking2 = await bookingDataService.createBooking(bookingCreateMock2)

      const limit = 1

      // Test getting 1st page.
      const fetchedBooking2 = await bookingDataService.getAllBookings(limit, 1)
      expect(fetchedBooking2.docs).toEqual(expect.arrayContaining([createdBooking2]))

      // Test getting next page.
      expect(fetchedBooking2.hasNextPage).true
      if (fetchedBooking2.hasNextPage && fetchedBooking2.nextPage) {
        const fetchedBooking2Next = await bookingDataService.getAllBookings(
          limit,
          fetchedBooking2.nextPage,
        )
        expect(fetchedBooking2Next.docs).toEqual(expect.arrayContaining([createdBooking]))
      }
    })

    it("should use default limit and page when no arguments are provided", async () => {
      // Should not throw and should return an object with default pagination values
      const result = await bookingDataService.getAllBookings()
      expect(result).toHaveProperty("docs")
      expect(result).toHaveProperty("limit", 100)
      expect(result).toHaveProperty("page", 1)
    })
  })

  describe("updateBooking", () => {
    it("should update a booking with the correct data", async () => {
      const createdBooking = await bookingDataService.createBooking(bookingCreateMock)
      const updateData: EditBookingData = {
        playerLevel: "intermediate",
      }

      const updatedBooking = await bookingDataService.updateBooking(createdBooking.id, updateData)
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
        bookingDataService.updateBooking("Not a booking ID", updateData),
      ).rejects.toThrowError("Not Found")
    })
  })

  describe("deleteBooking", () => {
    it("should delete a booking successfully", async () => {
      const createdBooking = await bookingDataService.createBooking(bookingCreateMock)
      const deletedBooking = await bookingDataService.deleteBooking(createdBooking.id)
      expect(deletedBooking).toEqual(createdBooking)

      await expect(() =>
        payload.findByID({
          collection: "booking",
          id: createdBooking.id,
        }),
      ).rejects.toThrowError("Not Found")
    })

    it("should throw a Not Found error when no booking is found to delete", async () => {
      await expect(() => bookingDataService.deleteBooking("Not a booking ID")).rejects.toThrowError(
        "Not Found",
      )
    })
  })
})
