import { payload } from "@/data-layer/adapters/Payload"
import type { GameSessionSchedule } from "@/payload-types"
import type {
  CreateGameSessionScheduleData,
  UpdateGameSessionScheduleData,
} from "@/types/collections"
import type { PaginatedDocs } from "payload"

export default class GameSessionDataService {
  /**
   * Creates a new {@link GameSessionSchedule} document
   *
   * @param {CreateGameSessionScheduleData} newGameSessionScheduleData the game session schedule data
   * @returns the new {@link GameSessionSchedule} document
   */
  public async createGameSessionSchedule(
    newGameSessionScheduleData: CreateGameSessionScheduleData,
  ): Promise<GameSessionSchedule> {
    return await payload.create({
      collection: "gameSessionSchedule",
      data: newGameSessionScheduleData,
    })
  }

  /**
   * Gets paginated {@link GameSessionSchedule} documents
   *
   * @param {number} [page=1] the page number to fetch
   * @param {number} [limit=100] the number of documents per page
   * @returns a {@link PaginatedDocs} object containing {@link GameSessionSchedule} documents
   */
  public async getPaginatedGameSessionSchedules(
    page = 1,
    limit = 100,
  ): Promise<PaginatedDocs<GameSessionSchedule>> {
    return await payload.find({
      collection: "gameSessionSchedule",
      page,
      limit,
    })
  }

  /**
   * Gets a {@link GameSessionSchedule} by it's ID
   *
   * @param {string} id the ID of the {@link GameSessionSchedule} to fetch
   * @returns the {@link GameSessionSchedule} document if it exists, otherwise throws a {@link NotFound} error
   */
  public async getGameSessionScheduleById(id: string): Promise<GameSessionSchedule> {
    return await payload.findByID({
      collection: "gameSessionSchedule",
      id,
    })
  }

  /**
   * Updates a {@link GameSessionSchedule} by it's ID
   *
   * @param {string} id the ID of the {@link GameSessionSchedule} to update
   * @param {UpdateGameSessionScheduleData} data the new data for the {@link GameSessionSchedule}
   * @returns the updated {@link GameSessionSchedule} document if it exists, otherwise throws a {@link NotFound} error
   */
  public async updateGameSessionSchedule(
    id: string,
    data: UpdateGameSessionScheduleData,
  ): Promise<GameSessionSchedule> {
    return await payload.update({
      collection: "gameSessionSchedule",
      id,
      data,
    })
  }

  /**
   * Deletes a {@link GameSessionSchedule} given its ID
   *
   * @param {string} id the ID of the {@link GameSessionSchedule} to delete
   * @returns the deleted {@link GameSessionSchedule} document if it exists, otherwise throws a {@link NotFound} error
   */
  public async deleteGameSessionSchedule(id: string): Promise<GameSessionSchedule> {
    return await payload.delete({
      collection: "gameSessionSchedule",
      id,
    })
  }
}
