import type { Booking } from "@/payload-types"
import type { CreateBookingData } from "@/types/collections"
import configPromise from "@payload-config"
import { type PaginatedDocs, getPayload } from "payload"

const payload = await getPayload({
  config: configPromise,
})

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
   * @returns the paginated docs of all Bookings found
   */
  public async getAllBookings(): Promise<PaginatedDocs<Booking>> {
    const allBookings = await payload.find({ collection: "booking" })
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
    const booking = await this.getBookingById(id)
    if (!booking) return null

    const deletedBooking = await payload.delete({
      collection: "booking",
      id,
    })

    return deletedBooking
  }
}
