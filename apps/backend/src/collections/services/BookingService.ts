import { payload } from "@/data-layer/adapters/Payload"
import type { Booking } from "@/payload-types"
import type { CreateBookingData, EditBookingData } from "@/types/collections"
import type { PaginatedDocs } from "payload"

export default class BookingService {
  /**
   * Creates a {@link Booking} document.
   *
   * @param bookingData The data to create a Booking with
   * @returns The created Booking document
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
   * @param id The ID of the Booking to find
   * @returns the Booking document if found, null otherwise.
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
   * @returns The docs of all Bookings found on the given page
   */
  public async getAllBookings(limit?: number, page?: number): Promise<PaginatedDocs<Booking>> {
    return await payload.find({ collection: "booking", limit: limit ?? 100, page: page ?? 1 })
  }

  /**
   * Updates a {@link Booking} by ID.
   *
   * @param id The ID of the Booking to update
   * @param data Data to update the Booking with
   * @returns The updated Booking if successful, null otherwise
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
   * @param id The ID of the Booking to delete.
   * @returns The deleted Booking if successful, null otherwise.
   */
  public async deleteBooking(id: string): Promise<Booking> {
    return await payload.delete({
      collection: "booking",
      id,
    })
  }
}
