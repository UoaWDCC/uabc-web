import type { CreateUserData, EditUserData } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import type { PaginatedDocs } from "payload"
import { NotFound } from "payload"
import { payload } from "@/data-layer/adapters/Payload"

export default class UserDataService {
  /**
   * Creates a new {@link User} document
   *
   * @param {CreateUserData} newUserData the {@link CreateUserData} to create a new user with
   * @returns the created {@link User} document
   */
  public async createUser(newUserData: CreateUserData): Promise<User> {
    return await payload.create({
      collection: "user",
      data: newUserData,
    })
  }

  /**
   * Gets paginated {@link User} documents
   *
   * @param limit The maximum documents to be returned, defaults to 10
   * @param page The specific page number to offset to, defaults to 1
   * @returns a {@link PaginatedDocs} object containing {@link User} documents
   */
  public async getPaginatedUsers(limit = 10, page = 1): Promise<PaginatedDocs<User>> {
    return await payload.find({
      collection: "user",
      limit,
      page,
    })
  }

  /**
   * Finds a {@link User} with target email
   *
   * @param email the email of the {@link User} to find
   * @returns The {@link User} document if exists, otherwise throws a {@link NotFound} error
   */
  public async getUserByEmail(email: string): Promise<User> {
    const { docs } = await payload.find({
      collection: "user",
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (!docs[0]) {
      throw new NotFound(() => `A user with the email: ${email} was not found.`)
    }

    return docs[0]
  }

  /**
   * Finds a {@link User} by their ID
   *
   * @param id The ID of the {@link User} to find
   * @returns The {@link User} document if exists, otherwise throws a {@link NotFound} error
   */
  public async getUserById(id: string): Promise<User> {
    return await payload.findByID({
      collection: "user",
      id,
    })
  }

  /**
   * Updates a {@link User} document
   *
   * @param id The ID of the {@link User} to update
   * @param data The partial {@link EditUserData} to update the {@link User} with
   * @returns The updated {@link User} document if successful, otherwise throws a {@link NotFound} error
   */
  public async updateUser(id: string, data: EditUserData): Promise<User> {
    return await payload.update({
      collection: "user",
      id,
      data,
    })
  }

  /**
   * Deletes a {@link User} document
   *
   * @param id The ID of the {@link User} to delete
   * @returns The deleted {@link User} document if successful, otherwise throws a {@link NotFound} error
   */
  public async deleteUser(id: string): Promise<User> {
    return await payload.delete({
      collection: "user",
      id,
    })
  }
}
