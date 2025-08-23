import type { CreateSemesterData, EditSemesterData } from "@repo/shared"
import type { Semester } from "@repo/shared/payload-types"
import { NotFound } from "payload"
import { payload } from "@/data-layer/adapters/Payload"

export default class SemesterDataService {
  /**
   * Creates a new {@link Semester} document in the database
   *
   * @param newSemesterData The {@link CreateSemesterData} to create a new Semester
   * @returns The created {@link Semester} document
   */
  public async createSemester(newSemesterData: CreateSemesterData): Promise<Semester> {
    return await payload.create({
      collection: "semester",
      data: newSemesterData,
    })
  }

  /**
   * Finds all {@link Semester} documents
   *
   * @returns An array containing all {@link Semester} documents
   */
  public async getAllSemesters(): Promise<Semester[]> {
    const { docs } = await payload.find({
      collection: "semester",
      pagination: false,
    })
    return docs
  }

  /**
   * Finds the current {@link Semester} based on the current date
   *
   * @returns The current {@link Semester} document if one exists for the current date
   * @throws Error if no current semester is found
   */
  public async getCurrentSemester(): Promise<Semester> {
    const currentDate = new Date().toISOString()

    const { docs } = await payload.find({
      collection: "semester",
      where: {
        and: [
          {
            startDate: {
              less_than_equal: currentDate,
            },
          },
          {
            endDate: {
              greater_than_equal: currentDate,
            },
          },
        ],
      },
      limit: 1,
    })

    if (!docs.length)
      throw new NotFound(() => {
        return "No current semester found"
      })

    return docs[0]
  }

  /**
   * Finds a {@link Semester} document from the database based on ID
   *
   * @param id The ID of {@link Semester} to find
   * @returns The {@link Semester} document if exists, otherwise throws a {@link NotFound} error
   */
  public async getSemesterById(id: string): Promise<Semester> {
    return await payload.findByID({
      collection: "semester",
      id,
    })
  }

  /**
   * Updates {@link Semester} document
   *
   * @param id The ID of {@link Semester} to update
   * @param updateSemesterData The partial {@link EditSemesterData} to update the {@link Semester} with
   * @returns The updated {@link Semester} document if successful, otherwise throws a {@link NotFound} error
   */
  public async updateSemester(id: string, data: EditSemesterData): Promise<Semester> {
    return await payload.update({
      collection: "semester",
      id,
      data,
    })
  }

  /**
   * Deletes a {@link Semester} document
   *
   * @param id The ID of the {@link Semester} to delete
   * @param transactionID An optional transaction ID for the request, useful for tracing
   * @returns The deleted {@link Semester} document if successful, otherwise throws a {@link NotFound} error
   */
  public async deleteSemester(id: string, transactionID?: string | number): Promise<Semester> {
    return await payload.delete({
      collection: "semester",
      id,
      req: { transactionID },
    })
  }

  /**
   * Deletes all related docs for a semester
   *
   * @param semesterId the ID of the semester whose game session schedules are to be deleted
   * @param transactionID An optional transaction ID for the request, useful for tracing
   */
  public async deleteRelatedDocsForSemester(
    semesterId: string,
    transactionID?: string | number,
  ): Promise<void> {
    // check to see if semester exists, otherwise throw a notfound error
    await payload.findByID({
      collection: "semester",
      id: semesterId,
      req: { transactionID },
    })

    const schedules = await payload.find({
      collection: "gameSessionSchedule",
      where: {
        semester: {
          equals: semesterId,
        },
      },
      pagination: false,
      req: { transactionID },
    })
    const scheduleIds = schedules.docs.map((schedule) => schedule.id)

    const sessions = await payload.find({
      collection: "gameSession",
      where: {
        gameSessionSchedule: {
          in: scheduleIds,
        },
      },
      pagination: false,
      req: { transactionID },
    })
    const sessionIds = sessions.docs.map((session) => session.id)

    await payload.delete({
      collection: "booking",
      where: {
        gameSession: {
          in: sessionIds,
        },
      },
      req: { transactionID },
    })

    await payload.delete({
      collection: "gameSession",
      where: {
        gameSessionSchedule: {
          in: scheduleIds,
        },
      },
      req: { transactionID },
    })

    await payload.delete({
      collection: "gameSessionSchedule",
      where: {
        semester: {
          equals: semesterId,
        },
      },
      req: { transactionID },
    })
  }
}
