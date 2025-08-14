import {
  type CreateGameSessionData,
  type CreateGameSessionScheduleData,
  getGameSessionOpenDay,
  TimeframeFilter,
  type UpdateGameSessionData,
  type UpdateGameSessionScheduleData,
  type Weekday,
} from "@repo/shared"
import type { GameSession, GameSessionSchedule, Semester } from "@repo/shared/payload-types"
import type { PaginatedDocs, Sort, Where } from "payload"
import { payload } from "@/data-layer/adapters/Payload"
import { createGameSessionTimes, getWeeklySessionDates } from "../utils/DateUtils"

export default class GameSessionDataService {
  /**
   * Creates a new {@link GameSession} document
   *
   * @param newGameSessionData the {@link CreateGameSessionData} to create a new game session with
   * @returns the created {@link GameSession} document
   */
  public async createGameSession(newGameSessionData: CreateGameSessionData): Promise<GameSession> {
    return await payload.create({
      collection: "gameSession",
      data: newGameSessionData,
    })
  }

  /**
   * Gets paginated {@link GameSession} documents
   *
   * @param limit The maximum documents to be returned, defaults to 100
   * @param page The specific page number to offset to, defaults to 1
   * @returns a {@link PaginatedDocs} object containing {@link GameSession} documents
   */
  public async getPaginatedGameSessions(
    limit = 100,
    page = 1,
  ): Promise<PaginatedDocs<GameSession>> {
    return await payload.find({
      collection: "gameSession",
      limit,
      page,
    })
  }

  /**
   * Gets a {@link GameSession} by it's ID
   *
   * @param id the ID of the {@link GameSession} to fetch
   * @returns the {@link GameSession} document if it exists, otherwise throws a {@link NotFound} error
   */
  public async getGameSessionById(id: string): Promise<GameSession> {
    return await payload.findByID({
      collection: "gameSession",
      id,
    })
  }

  /**
   * Updates a {@link GameSession} by it's ID
   *
   * @param id the ID of the {@link GameSession} to update
   * @param  data the new data for the {@link GameSession}
   * @returns the updated {@link GameSession} document if it exists, otherwise throws a {@link NotFound} error
   */
  public async updateGameSession(id: string, data: UpdateGameSessionData): Promise<GameSession> {
    return await payload.update({
      collection: "gameSession",
      id,
      data,
    })
  }

  // /**
  //  * Deletes a {@link GameSession} given its ID
  //  *
  //  * @param id the ID of the {@link GameSession} to delete
  //  * @returns the deleted {@link GameSession} document if it exists, otherwise throws a {@link NotFound} error
  //  */
  // public async deleteGameSession(id: string): Promise<GameSession> {
  //   return await payload.delete({
  //     collection: "gameSession",
  //     id,
  //   })
  // }

  /**
   * Deletes a {@link GameSession} given its ID, and deletes it's related bookings.
   *
   * @param id the ID of the {@link GameSession} to delete
   * @param transactionID An optional transaction ID for the request, useful for tracing
   * @returns the deleted {@link GameSession} document if it exists, otherwise throws a {@link NotFound} error
   */
  public async deleteGameSession(
    id: string,
    transactionID?: string | number,
  ): Promise<GameSession> {
    await payload.delete({
      collection: "booking",
      where: {
        gameSession: {
          equals: id,
        },
      },
      req: { transactionID },
    })

    return await payload.delete({
      collection: "gameSession",
      id,
      req: { transactionID },
    })
  }

  /**
   * Gets all {@link GameSession} documents for a given semester ID
   *
   * @param semesterId the ID of the {@link Semester} to get game sessions for
   * @returns an array of {@link GameSession} documents
   */
  public async getGameSessionsBySemesterId(
    semesterId: string,
    timeframe: TimeframeFilter = TimeframeFilter.DEFAULT,
  ): Promise<GameSession[]> {
    const currentDate = new Date()

    let filter: Where = {}
    const sort: Sort = "-startTime"

    switch (timeframe) {
      case TimeframeFilter.UPCOMING:
        filter = {
          startTime: {
            greater_than_equal: currentDate,
          },
        }
        break
      case TimeframeFilter.PAST:
        filter = {
          startTime: {
            less_than: currentDate,
          },
        }
        break
      case TimeframeFilter.CURRENT:
        filter = {
          and: [
            {
              endTime: {
                greater_than_equal: currentDate,
              },
            },
            {
              openTime: {
                less_than_equal: currentDate,
              },
            },
          ],
        }
        break
      default:
    }

    return (
      await payload.find({
        collection: "gameSession",
        where: {
          semester: {
            equals: semesterId,
          },
          ...filter,
        },
        sort: sort,
        pagination: false,
      })
    ).docs
  }

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
   * Creates an array of {@link GameSession} documents based on game session schedule
   *
   * @param schedule the {@link GameSessionSchedule} the game sessions are based on
   * @returns an array of newly created {@link GameSession} documents
   */
  public async cascadeCreateGameSessions(
    schedule: GameSessionSchedule,
    semester: Semester,
  ): Promise<GameSession[]> {
    const sessionDates = getWeeklySessionDates(schedule.day as Weekday, semester)

    const sessions: CreateGameSessionData[] = sessionDates.map((date) => {
      const gameSessionTimes = createGameSessionTimes(schedule, date)

      return {
        gameSessionSchedule: schedule.id,
        semester: semester.id,
        name: schedule.name,
        location: schedule.location,
        ...gameSessionTimes,
        capacity: schedule.capacity,
        casualCapacity: schedule.casualCapacity,
        openTime: getGameSessionOpenDay(
          semester,
          new Date(gameSessionTimes.startTime),
        ).toISOString(),
      }
    })

    const createdSessions = await Promise.all(
      sessions.map(
        (session) =>
          payload.create({
            collection: "gameSession",
            data: session,
          }) as Promise<GameSession>,
      ),
    )

    return createdSessions
  }

  /**
   * Gets paginated {@link GameSessionSchedule} documents
   *
   * @param limit The maximum documents to be returned, defaults to 100
   * @param page The specific page number to offset to, defaults to 1
   * @returns a {@link PaginatedDocs} object containing {@link GameSessionSchedule} documents
   */
  public async getPaginatedGameSessionSchedules(
    limit = 100,
    page = 1,
  ): Promise<PaginatedDocs<GameSessionSchedule>> {
    return await payload.find({
      collection: "gameSessionSchedule",
      limit,
      page,
    })
  }

  /**
   * Gets a {@link GameSessionSchedule} by it's ID
   *
   * @param id the ID of the {@link GameSessionSchedule} to fetch
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
   * @param id the ID of the {@link GameSessionSchedule} to update
   * @param data the new data for the {@link GameSessionSchedule}
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
   * @param id the ID of the {@link GameSessionSchedule} to delete
   * @param transactionID An optional transaction ID for the request, useful for tracing
   * @returns the deleted {@link GameSessionSchedule} document if it exists, otherwise throws a {@link NotFound} error
   */
  public async deleteGameSessionSchedule(
    id: string,
    transactionID?: string | number,
  ): Promise<GameSessionSchedule> {
    const gameSessions = await payload.find({
      collection: "gameSession",
      where: { gameSessionSchedule: { equals: id } },
      pagination: false,
      req: { transactionID },
    })

    for (const gameSession of gameSessions.docs) {
      await this.deleteGameSession(gameSession.id, transactionID)
    }

    return await payload.delete({
      collection: "gameSessionSchedule",
      id,
      req: { transactionID },
    })
  }

  // NB: GameSessionSchedule doesn't have docs..? so that means I can't be certain it'll return an array of documents right. should I add docs to it or is there a better way to do it
  //   /**
  //    * Deletes multiple {@link GameSessionSchedule} documents given their IDs
  //    *
  //    * @param ids an array of IDs of the {@link GameSessionSchedule} documents to delete
  //    * @param transactionID An optional transaction ID for the request, useful for tracing
  //    * @returns an array of the deleted {@link GameSessionSchedule} documents if it exists, otherwise throws a {@link NotFound} error
  //    */
  //   public async deleteGameSessionSchedules(
  //     ids: string[],
  //     transactionID?: string | number,
  //   ): Promise<GameSessionSchedule[]> {
  //     const { docs } = await payload.delete({
  //       collection: "gameSessionSchedule",
  //       where: {
  //         id: { in: ids },
  //       },
  //       pagination: false,
  //       req: { transactionID },
  //     })
  //     return docs
  //   }
}
