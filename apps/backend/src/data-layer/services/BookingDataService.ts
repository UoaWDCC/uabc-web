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
   * Finds all {@link Booking} documents by a {@link User}'s id
   *
   * @param userId The ID of the user whose {@link Booking} you find
   * @returns the {@link Booking} if successful
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
      })
    ).docs
  }

  /**
   * Finds all {@link Booking} documents.
   *
   * @param limit The maximum documents to be returned
   * @param page The specific page number to offset to
   * @returns All {@link Booking} documents found on the given page
   */
  public async getAllBookings(limit = 100, page = 1): Promise<PaginatedDocs<Booking>> {
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
   * Finds all {@link Booking} documents by a specific user ID.
   *
   * @param userId The ID of the user whose bookings to find.
   * @param transactionID An optional transaction ID for the request, useful for tracing.
   * @param limit The maximum number of documents to be returned, defaults to 100.
   * @param page The specific page number to offset to, defaults to 1.
   */
  public async getBookingsByUserId(
    userId: string,
    transactionID?: string | number,
    limit = 100,
    page = 1,
  ): Promise<PaginatedDocs<Booking>> {
    return await payload.find({
      collection: "booking",
      where: {
        user: {
          equals: userId,
        },
      },
      limit,
      page,
      req: {
        transactionID,
      },
    })
  }
}
