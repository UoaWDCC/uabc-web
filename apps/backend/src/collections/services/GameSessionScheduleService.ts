import type { GameSessionSchedule } from "@/payload-types"
import type { CreateGameSessionScheduleData } from "@/types/collections"
import configPromise from "@payload-config"
import { type PaginatedDocs, getPayload } from "payload"

const payload = await getPayload({
  config: configPromise,
})

export default class GameSessionScheduleService {
  /**
   * Creates a new game session schedule document
   * @param newGameSessionScheduleData the game session schedule data
   * @returns the created game session schedule document
   */
  public async createGameSessionSchedule(
    newGameSessionScheduleData: CreateGameSessionScheduleData,
  ): Promise<GameSessionSchedule> {
    const newGameSessionSchedule = await payload.create({
      collection: "gameSessionSchedule",
      data: newGameSessionScheduleData,
    })
    return newGameSessionSchedule
  }

  /**
   * Gets all game session schedules
   * @returns all game session schedules or null if there is an error
   */
  public async getPaginatedGameSessionSchedules({
    page = 1,
    limit = 10,
  }: {
    page?: number
    limit?: number
  } = {}): Promise<PaginatedDocs<GameSessionSchedule> | null> {
    try {
      const gameSessionSchedules = await payload.find({
        collection: "gameSessionSchedule",
        page,
        limit,
      })
      return gameSessionSchedules
    } catch (error) {
      console.error("Error fetching game session schedules:", error)
      return null
    }
  }

  /**
   * Gets a game session schedule by ID
   * @param id the ID of the game session schedule to fetch
   * @returns the game session schedule document if it exists, otherwise null
   */
  public async getGameSessionScheduleById(id: string): Promise<GameSessionSchedule | null> {
    const gameSessionSchedule = await payload.findByID({
      collection: "gameSessionSchedule",
      id,
    })
    return gameSessionSchedule
  }

  /**
   * Updates a game session schedule by ID
   * @param id the ID of the game session schedule to update
   * @param data the new data for the game session schedule
   * @returns the updated game session schedule document if it exists, otherwise null
   */
  public async updateGameSessionSchedule(
    id: string,
    data: Partial<GameSessionSchedule>,
  ): Promise<GameSessionSchedule | null> {
    try {
      const updatedGameSessionSchedule = await payload.update({
        collection: "gameSessionSchedule",
        id,
        data,
      })
      return updatedGameSessionSchedule
    } catch (error) {
      console.error(`Error updating game session schedule with ID ${id}:`, (error as Error).message)
      return null
    }
  }

  /**
   * Deletes a game session schedule given its ID
   * @param id the ID of the game session schedule to delete
   * @returns the deleted game session schedule document if it exists, otherwise null
   */
  public async deleteGameSessionSchedule(id: string): Promise<GameSessionSchedule | null> {
    const deletedGameSessionSchedule = await payload.delete({
      collection: "gameSessionSchedule",
      id,
    })
    return deletedGameSessionSchedule
  }
}
