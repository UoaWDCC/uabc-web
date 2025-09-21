import type { Event } from "@repo/shared/payload-types"
import { NotFound } from "payload"
import { payload } from "@/data-layer/adapters/Payload"

export default class EventDataService {
  /**
   * Finds all {@link Event} documents.
   *
   * @returns An array of {@link Event} documents
   */
  public async getAllEvents(): Promise<Event[]> {
    return (
      await payload.find({
        collection: "event",
        pagination: false,
      })
    ).docs
  }

  /**
   * Finds a {@link Event} by their ID
   *
   * @param id The ID of the {@link Event} to find
   * @returns The {@link Event} document if exists, otherwise throws a {@link NotFound} error
   */
  public async getEventById(id: string): Promise<Event> {
    return await payload.findByID({
      collection: "event",
      id,
    })
  }
}
