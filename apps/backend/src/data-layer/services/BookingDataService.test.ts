import type { EditBookingData } from "@repo/shared"
import { casualUserMock } from "@repo/shared/mocks"
import { bookingCreateMock, bookingCreateMock2 } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { payload } from "../adapters/Payload"
import BookingDataService from "./BookingDataService"
import GameSessionDataService from "./GameSessionDataService"
import SemesterDataService from "./SemesterDataService"

const bookingDataService = new BookingDataService()
const gameSessionDataService = new GameSessionDataService()
const semesterDataService = new SemesterDataService()

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

  describe("getAllBookingsBySessionId", () => {
    it("should fetch bookings by session ID", async () => {
      const createdGameSession =
        await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const createdBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: createdGameSession.id,
      })

      const fetchedBooking = await bookingDataService.getAllBookingsBySessionId(
        createdGameSession.id,
      )
      expect(fetchedBooking.length).toEqual(1)
      expect(fetchedBooking).toEqual([createdBooking])
    })

    it("should return an empty array when a booking is not found for session ID", async () => {
      expect(
        await bookingDataService.getAllBookingsBySessionId("Not a valid session ID"),
      ).toStrictEqual([])
    })
  })

  describe("getAllBookingsBySessionIds", () => {
    it("should fetch bookings by multiple session IDs", async () => {
      const createdGameSession1 =
        await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const createdGameSession2 =
        await gameSessionDataService.createGameSession(gameSessionCreateMock)

      const createdBooking1 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: createdGameSession1.id,
      })
      const createdBooking2 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: createdGameSession2.id,
      })

      const fetchedBookings = await bookingDataService.getAllBookingsBySessionIds([
        createdGameSession1.id,
        createdGameSession2.id,
      ])
      expect(fetchedBookings.length).toEqual(2)
      expect(fetchedBookings).toEqual(expect.arrayContaining([createdBooking1, createdBooking2]))
    })

    it("should return an empty array when no bookings are found for session IDs", async () => {
      expect(
        await bookingDataService.getAllBookingsBySessionIds(["Not a valid session ID"]),
      ).toStrictEqual([])
    })

    it("should return empty array when sessionIds is empty", async () => {
      const result = await bookingDataService.getAllBookingsBySessionIds([])
      expect(result).toStrictEqual([])
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

  describe("getAllUserBookingsBySessionId", () => {
    it("should find all bookings by userId and sessionId", async () => {
      const createdBooking1 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: casualUserMock,
      })
      const createdBooking2 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: casualUserMock,
      })

      const fetchedBookings = await bookingDataService.getAllUserBookingsBySessionId(
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
      const fetchedBooking = await bookingDataService.getAllUserBookingsBySessionId(
        "No bookings userId",
        "No bookings sessionId",
      )
      expect(fetchedBooking).toStrictEqual([])
    })
  })

  describe("getPaginatedBookings", () => {
    it("should find all bookings in each page", async () => {
      const createdBooking = await bookingDataService.createBooking(bookingCreateMock)
      const createdBooking2 = await bookingDataService.createBooking(bookingCreateMock2)

      const limit = 1

      // Test getting 1st page.
      const fetchedBooking2 = await bookingDataService.getPaginatedBookings(limit, 1)
      expect(fetchedBooking2.docs).toEqual(expect.arrayContaining([createdBooking2]))

      // Test getting next page.
      expect(fetchedBooking2.hasNextPage).true
      if (fetchedBooking2.hasNextPage && fetchedBooking2.nextPage) {
        const fetchedBooking2Next = await bookingDataService.getPaginatedBookings(
          limit,
          fetchedBooking2.nextPage,
        )
        expect(fetchedBooking2Next.docs).toEqual(expect.arrayContaining([createdBooking]))
      }
    })

    it("should use default limit and page when no arguments are provided", async () => {
      // Should not throw and should return an object with default pagination values
      const result = await bookingDataService.getPaginatedBookings()
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

  describe("deleteBookingsBySemesterId", () => {
    it("should delete bookings by a semester ID successfully", async () => {
      const createdSemester = await semesterDataService.createSemester(semesterCreateMock)
      const createdGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule({
        ...gameSessionScheduleCreateMock,
        semester: createdSemester.id,
      })
      const createdGameSession1 = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        gameSessionSchedule: createdGameSessionSchedule,
        semester: createdSemester.id,
      })
      const createdGameSession2 = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: createdSemester.id,
      })

      const createdBooking1 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: createdGameSession1,
      })
      const createdBooking2 = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: createdGameSession2,
      })
      const createdBooking3 = await bookingDataService.createBooking(bookingCreateMock)

      const deletedBookings = await bookingDataService.deleteBookingsBySemesterId(
        createdSemester.id,
      )
      expect(deletedBookings.length).toEqual(2)
      expect(deletedBookings).toEqual(expect.arrayContaining([createdBooking1, createdBooking2]))

      expect(await bookingDataService.getBookingById(createdBooking3.id)).toBeDefined()
      await expect(bookingDataService.getBookingById(createdBooking1.id)).rejects.toThrowError(
        "Not Found",
      )
      await expect(bookingDataService.getBookingById(createdBooking2.id)).rejects.toThrowError(
        "Not Found",
      )
    })

    it("should return an empty array if no bookings exist when deleting by a semester ID", async () => {
      expect(
        await bookingDataService.deleteBookingsBySemesterId("Not a valid semester ID"),
      ).toStrictEqual([])
    })
  })
})
