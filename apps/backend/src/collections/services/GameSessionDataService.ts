import { payload } from "@/data-layer/adapters/Payload"
import type { GameSessionSchedule } from "@/payload-types"
import type {
  CreateGameSessionScheduleData,
  UpdateGameSessionScheduleData,
} from "@/types/collections"
import type { PaginatedDocs } from "payload"

export default class GameSessionDataService {
  /**
   * Creates a new game session schedule document
   * @param newGameSessionScheduleData the game session schedule data
   * @returns the created game session schedule document
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
   * Gets all game session schedules
   *
   * @param {number} [page=1] the page number to fetch
   * @param {number} [limit=100] the number of documents per page
   * @returns all game session schedules or null if there is an error
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
   * Gets a game session schedule by ID
   * @param id the ID of the game session schedule to fetch
   * @returns the game session schedule document if it exists, otherwise null
   */
  public async getGameSessionScheduleById(id: string): Promise<GameSessionSchedule> {
    return await payload.findByID({
      collection: "gameSessionSchedule",
      id,
    })
  }

  /**
   * Updates a game session schedule by ID
   * @param id the ID of the game session schedule to update
   * @param data the new data for the game session schedule
   * @returns the updated game session schedule document if it exists, otherwise null
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
   * Deletes a game session schedule given its ID
   * @param id the ID of the game session schedule to delete
   * @returns the deleted game session schedule document if it exists, otherwise null
   */
  public async deleteGameSessionSchedule(id: string): Promise<GameSessionSchedule> {
    return await payload.delete({
      collection: "gameSessionSchedule",
      id,
    })
  }
}
