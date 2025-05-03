import { payload } from "@/data-layer/adapters/Payload"
import type { Booking } from "@/payload-types"
import type { CreateBookingData } from "@/types/collections"
import type { PaginatedDocs } from "payload"

export default class BookingService {
  /**
   * Creates a {@link Booking} document.
   * @param bookingData The data to create a Booking with
   * @returns The created Booking document
   */
  public async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    const createdBooking = await payload.create({
      collection: "booking",
      data: bookingData,
    })

    return createdBooking
  }

  /**
   * Finds a {@link Booking} document by ID.
   * @param id The ID of the Booking to find
   * @returns the Booking document if found, null otherwise.
   */
  public async getBookingById(id: string): Promise<Booking | null> {
    const foundBooking = await payload.findByID({
      collection: "booking",
      id,
    })

    return foundBooking
  }

  /**
   * Finds all {@link Booking} documents.
   * @param limit The maximum documents to be returned
   * @param page The specific page number to offset to
   * @returns The docs of all Bookings found on the given page
   */
  public async getAllBookings(limit: number, page: number): Promise<PaginatedDocs<Booking>> {
    const allBookings = await payload.find({ collection: "booking", limit, page })
    return allBookings
  }

  /**
   * Updates a {@link Booking} by ID.
   * @param id The ID of the Booking to update
   * @param data Data to update the Booking with
   * @returns The updated Booking if successful, null otherwise
   */
  public async updateBooking(
    id: string,
    data: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Booking | null> {
    const booking = await this.getBookingById(id)
    if (!booking) return null

    const updatedBooking = await payload.update({
      collection: "booking",
      id,
      data,
    })

    return updatedBooking
  }

  /**
   * Deletes a {@link Booking} by ID.
   * @param id The ID of the Booking to delete.
   * @returns The deleted Booking if successful, null otherwise.
   */
  public async deleteBooking(id: string): Promise<Booking | null> {
    const deletedBooking = await payload.delete({
      collection: "booking",
      id,
    })

    return deletedBooking
  }
}
