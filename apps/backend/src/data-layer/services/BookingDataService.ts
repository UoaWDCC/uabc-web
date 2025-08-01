import type { CreateBookingData, EditBookingData } from "@repo/shared"
import type { Booking } from "@repo/shared/payload-types"
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
   * Deletes multiple {@link Booking} documents by their IDs.
   *
   * @param ids An array of IDs of the {@link Booking} documents to delete.
   * @param transactionID An optional transaction ID for the request, useful for tracing.
   */
  public async deleteBookings(ids: string[], transactionID?: string | number): Promise<Booking[]> {
    const bulkDeletionResult = await payload.delete({
      collection: "booking",
      where: {
        id: { in: ids },
      },
      req: {
        transactionID,
      },
    })

    return bulkDeletionResult.docs
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
}
