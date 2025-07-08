import type { CreateSemesterData, EditSemesterData } from "@repo/shared"
import type { Semester } from "@repo/shared/payload-types"
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
   * @returns The deleted {@link Semester} document if successful, otherwise throws a {@link NotFound} error
   */
  public async deleteSemester(id: string): Promise<Semester> {
    return await payload.delete({
      collection: "semester",
      id,
    })
  }
}
