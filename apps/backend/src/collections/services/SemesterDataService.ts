import type { Semester } from "@/payload-types"
import type { CreateSemesterData, UpdateSemesterData } from "@/types/collections"
import configPromise from "@payload-config"
import { type PaginatedDocs, getPayload } from "payload"

const payload = await getPayload({
  config: configPromise,
})

export default class SemesterService {
  /**
   *  Creates a new Semester Document in the database
   * @param createSemesterData
   * @returns Created new Semester Document
   */
  public async createSemester(createSemesterData: CreateSemesterData): Promise<Semester> {
    return await payload.create({
      collection: "semester",
      data: createSemesterData,
    })
  }
  /**
   * Retrives all semester documents from the database
   *
   * @returns Retrieved Semester documents
   */
  public async getAllSemesters(): Promise<PaginatedDocs<Semester>> {
    return await payload.find({
      collection: "semester",
    })
  }
  /**
   * Retrvies a Semester Document from the database based on ID
   *
   * @param semesterId The ID of semester to retrieve
   * @returns The semester document from database
   */
  public async getSemester(semesterId: string): Promise<Semester> {
    return await payload.findByID({
      collection: "semester",
      id: semesterId,
    })
  }
  /**
   * Updates semester document in database
   *
   * @param semesterId The ID of semester updating
   * @param updateSemesterData new semester data to be updated
   * @returns Updated Semester Document
   */
  public async updateSemester(
    semesterId: string,
    updateSemesterData: UpdateSemesterData,
  ): Promise<Semester> {
    return await payload.update({
      collection: "semester",
      id: semesterId,
      data: updateSemesterData,
    })
  }
  /**
   * Deletes semester document from the database based on ID
   *
   * @param semesterId
   */
  public async deleteSemester(semesterId: string): Promise<void> {
    await payload.delete({
      collection: "semester",
      id: semesterId,
    })
  }
}
