import type { Booking, GameSession, User } from "@/payload-types"
import type { CreateBookingData } from "@/types/collections"
import configPromise from "@payload-config"
import { type PaginatedDocs, getPayload } from "payload"

const payload = await getPayload({
  config: configPromise,
})

export default class BookingService {
  /**
   * Creates a booking document.
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
   * Finds Booking documents by game session.
   * @param gameSession The game session to search for Bookings
   * @returns Paginated docs of Bookings if any found, null otherwise
   */
  public async getBookingsByGameSession(
    gameSession: GameSession,
  ): Promise<PaginatedDocs<Booking> | null> {
    const bookingDocs = await payload.find({
      collection: "booking",
      where: {
        gameSession: {
          equals: gameSession,
        },
      },
    })

    return bookingDocs.docs.length ? bookingDocs : null
  }

  /**
   * Finds a Booking document by ID.
   * @param id The ID of the Booking to find
   * @returns the Booking document if found, null otherwise.
   */
  public async getBookingById(id: string): Promise<Booking | null> {
    try {
      const foundBooking = await payload.findByID({
        collection: "booking",
        id,
      })

      return foundBooking
    } catch (_error) {
      return null
    }
  }

  /**
   * Finds Booking documents by user.
   * @param user The user to search for Bookings
   * @returns Paginated docs of Bookings if any found, null otherwise
   */
  public async getBookingsByUser(user: User): Promise<PaginatedDocs<Booking> | null> {
    const bookingDocs = await payload.find({
      collection: "booking",
      where: {
        user: {
          equals: user,
        },
      },
    })

    return bookingDocs.docs.length ? bookingDocs : null
  }

  /**
   * Updates a Booking by ID.
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
   * Deletes a Booking by ID.
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
