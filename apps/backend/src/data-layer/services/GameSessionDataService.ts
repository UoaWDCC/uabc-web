import type {
  CreateGameSessionData,
  CreateGameSessionScheduleData,
  UpdateGameSessionData,
  UpdateGameSessionScheduleData,
  Weekday,
} from "@repo/shared"
import type { GameSession, GameSessionSchedule, Semester } from "@repo/shared/payload-types"
import type { PaginatedDocs } from "payload"
import { payload } from "@/data-layer/adapters/Payload"
import { getWeeklySessionDates } from "../utils/DateUtils"

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

  /**
   * Deletes a {@link GameSession} given its ID
   *
   * @param id the ID of the {@link GameSession} to delete
   * @returns the deleted {@link GameSession} document if it exists, otherwise throws a {@link NotFound} error
   */
  public async deleteGameSession(id: string): Promise<GameSession> {
    return await payload.delete({
      collection: "gameSession",
      id,
    })
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
  public async cascadeCreateGameSessions(schedule: GameSessionSchedule): Promise<GameSession[]> {
    const semesterId = schedule.semester
    const semester: Semester = await payload.findByID({
      collection: "semester",
      id: typeof semesterId === "string" ? semesterId : semesterId.id,
    })

    if (!semester) {
      throw new Error("Semester not found")
    }

    const weekday = schedule.day as Weekday
    const sessionDates = getWeeklySessionDates(weekday, semester)

    const sessions: CreateGameSessionData[] = sessionDates.map((date) => {
      const dateStr = date.toISOString().split("T")[0]
      const timeStrStart = schedule.startTime.split("T")[1]
      const timeStrEnd = schedule.startTime.split("T")[1]

      const start = new Date(`${dateStr}T${timeStrStart}`)
      const end = new Date(`${dateStr}T${timeStrEnd}`)

      return {
        gameSessionSchedule: schedule.id,
        semester: semester.id,
        name: schedule.name,
        location: schedule.location,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        capacity: schedule.capacity,
        casualCapacity: schedule.casualCapacity,
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
   * @returns the deleted {@link GameSessionSchedule} document if it exists, otherwise throws a {@link NotFound} error
   */
  public async deleteGameSessionSchedule(id: string): Promise<GameSessionSchedule> {
    return await payload.delete({
      collection: "gameSessionSchedule",
      id,
    })
  }
}
