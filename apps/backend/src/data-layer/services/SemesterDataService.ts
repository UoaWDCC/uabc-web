import { payload } from "@/data-layer/adapters/Payload"
import type { Semester } from "@/payload-types"
import type { CreateSemesterData, EditSemesterData } from "@/types/collections"
import type { PaginatedDocs } from "payload"

export default class SemesterDataService {
  /**
   * Creates a new Semester Document in the database
   *
   * @param {createSemesterData} newSemesterData the {@link CreateSemesterData} to create a new Semester
   * @returns the created {@link Semester} document
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
   * @returns Retrieved all {@link Semester} documents
   */
  public async getAllSemesters(): Promise<PaginatedDocs<Semester>> {
    return await payload.find({
      collection: "semester",
    })
  }
  /**
   * Finds a {@link Semester} Document from the database based on ID
   *
   * @param semesterId The ID of {@link semester} to find
   * @returns The {@link semester} document if exists, otherwise throws a {@link NotFound} error
   */
  public async getSemesterById(id: string): Promise<Semester> {
    return await payload.findByID({
      collection: "semester",
      id,
    })
  }
  /**
   * Updates {@link semester} document
   *
   * @param semesterId The ID of {@link semester} to update
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
   * @param semesterId The ID of the {@link Semester} to delete
   * @returns The deleted {@link Semester} document if succesful, otherwise throws a {@link NotFound} error
   */
  public async deleteSemester(id: string): Promise<Semester> {
    return await payload.delete({
      collection: "semester",
      id,
    })
  }
}
