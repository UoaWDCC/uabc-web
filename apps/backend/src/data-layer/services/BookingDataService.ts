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
}
