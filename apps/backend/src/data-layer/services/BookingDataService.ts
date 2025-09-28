import {
  type CreateBookingData,
  type EditBookingData,
  getDaysBetweenWeekdays,
  Weekday,
} from "@repo/shared"
import type { Booking, Semester } from "@repo/shared/payload-types"
import type { PaginatedDocs } from "payload"
import { NotFound } from "payload"
import { payload } from "@/data-layer/adapters/Payload"

export default class BookingDataService {
  /**
   * Creates a {@link Booking} document.
   *
   * @param bookingData The {@link CreateBookingData} to create a {@link Booking} with
   * @returns The created {@link Booking} document
   */
  public async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    return await payload.create({
      collection: "booking",
      data: bookingData,
    })
  }

  /**
   * Finds a {@link Booking} document by ID.
   *
   * @param id The ID of the {@link Booking} to find
   * @returns the {@link Booking} document if found, otherwise throws a {@link NotFound} error
   */
  public async getBookingById(id: string): Promise<Booking> {
    return await payload.findByID({
      collection: "booking",
      id,
    })
  }

  /**
   * Searches for all {@link Booking} documents with the same game session ID.
   *
   * @param sessionId The ID of the game session to search bookings for
   * @returns An array of {@link Booking} documents that match the game session ID
   */
  public async getAllBookingsBySessionId(sessionId: string): Promise<Booking[]> {
    return (
      await payload.find({
        collection: "booking",
        where: {
          gameSession: {
            equals: sessionId,
          },
        },
        pagination: false,
      })
    ).docs
  }

  /**
   * Searches for all {@link Booking} documents for a set of game session IDs.
   *
   * @param sessionIds The IDs of the game sessions to search bookings for
   * @returns An array of {@link Booking} documents that match any of the game session IDs
   */
  public async getAllBookingsBySessionIds(sessionIds: string[]): Promise<Booking[]> {
    if (sessionIds.length === 0) return []

    return (
      await payload.find({
        collection: "booking",
        where: {
          gameSession: {
            in: sessionIds,
          },
        },
        pagination: false,
      })
    ).docs
  }

  /**
   * Finds all {@link Booking} documents by a {@link User}'s id and game session id.
   *
   * @param userId The ID of the user whose bookings you want to find
   * @param sessionId The ID of the game session to search bookings for
   * @returns An array of {@link Booking} documents that match the game session ID and user ID
   */
  public async getAllUserBookingsBySessionId(
    userId: string,
    sessionId: string,
  ): Promise<Booking[]> {
    return (
      await payload.find({
        collection: "booking",
        where: {
          and: [
            {
              gameSession: {
                equals: sessionId,
              },
            },
            {
              user: {
                equals: userId,
              },
            },
          ],
        },
        pagination: false,
      })
    ).docs
  }

  /**
   * Finds all {@link Booking} documents by a {@link User}'s id
   *
   * @param userId The ID of the user whose {@link Booking} you find
   * @returns all {@link Booking} documents if successful
   */
  public async getAllBookingsByUserId(userId: string): Promise<Booking[]> {
    return (
      await payload.find({
        collection: "booking",
        where: {
          user: {
            equals: userId,
          },
        },
        pagination: false,
      })
    ).docs
  }

  /**
   * Finds all {@link Booking} documents for the current booking week by a {@link User}'s id
   *
   * The current booking week is determined by the `bookingOpenDay` and `bookingOpenTime` of the provided {@link Semester}.
   * Bookings are fetched for the 7-day period starting from the most recent occurrence of the `bookingOpenDay` and `bookingOpenTime`.
   *
   * @param userId The ID of the user whose {@link Booking} you find
   * @param semester The {@link Semester} to determine the booking week
   *
   * @returns all {@link Booking} documents within the current booking week, otherwise returns an empty array
   */
  public async getAllCurrentWeekBookingsByUserId(
    userId: string,
    semester: Semester,
  ): Promise<Booking[]> {
    const now = new Date()
    const todayWeekday = Object.values(Weekday)[now.getUTCDay()]

    const { bookingOpenDay, bookingOpenTime } = semester

    const daysDifference = getDaysBetweenWeekdays(bookingOpenDay as Weekday, todayWeekday)

    const bookingStartPeriod = new Date(bookingOpenTime)
    bookingStartPeriod.setUTCFullYear(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - daysDifference,
    )

    const bookingEndPeriod = new Date(bookingStartPeriod)
    bookingEndPeriod.setUTCDate(bookingStartPeriod.getUTCDate() + 7)

    const { docs } = await payload.find({
      collection: "booking",
      pagination: false,
      where: {
        and: [
          {
            user: {
              equals: userId,
            },
          },
          {
            "gameSession.startTime": {
              greater_than_equal: bookingStartPeriod.toISOString(),
              less_than: bookingEndPeriod.toISOString(),
            },
          },
        ],
      },
    })
    return docs
  }

  /**
   * Finds a page of {@link Booking} documents.
   *
   * @param limit The maximum documents to be returned
   * @param page The specific page number to offset to
   * @returns All {@link Booking} documents found on the given page
   */
  public async getPaginatedBookings(limit = 100, page = 1): Promise<PaginatedDocs<Booking>> {
    return await payload.find({ collection: "booking", limit, page })
  }

  /**
   * Updates a {@link Booking} by ID.
   *
   * @param id The ID of the {@link Booking} to update
   * @param data The partial {@link EditBookingData} to update the {@link Booking} with
   * @returns The updated {@link Booking} document if successful, otherwise throws a {@link NotFound} error
   */
  public async updateBooking(id: string, data: EditBookingData): Promise<Booking> {
    return await payload.update({
      collection: "booking",
      id,
      data,
    })
  }

  /**
   * Deletes a {@link Booking} by ID.
   *
   * @param id The ID of the {@link Booking} to delete.
   * @returns The deleted {@link Booking} if successful, otherwise throws a {@link NotFound} error
   */
  public async deleteBooking(id: string): Promise<Booking> {
    return await payload.delete({
      collection: "booking",
      id,
    })
  }

  /**
   * Deletes all {@link Booking}s for a {@link Semester}
   *
   * @param semesterId the ID of the {@link Semester} that has bookings we want to delete
   * @param transactionId an optional transaction ID for the request, useful for tracing
   * @returns the deleted {@link Booking} documents if it exists, otherwise returns an empty array
   */
  public async deleteBookingsBySemesterId(
    semesterId: string,
    transactionId?: string | number,
  ): Promise<Booking[]> {
    return (
      await payload.delete({
        collection: "booking",
        where: {
          "gameSession.semester": {
            equals: semesterId,
          },
        },
        req: { transactionID: transactionId },
      })
    ).docs
  }

  /**
   * Method to bulk delete bookings based on a target {@link User}'s id
   *
   * @param userId The ID of the user to bulk delete bookings for
   * @param transactionId an optional transaction ID for the request, useful for tracing
   * @returns the deleted {@link Booking} documents if it exists, otherwise returns an empty array
   */
  public async deleteBookingsByUserId(
    userId: string,
    transactionId?: string | number,
  ): Promise<Booking[]> {
    return (
      await payload.delete({
        collection: "booking",
        where: {
          user: {
            equals: userId,
          },
        },
        req: { transactionID: transactionId },
      })
    ).docs
  }
}
