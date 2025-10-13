import { type CreateUserData, type EditUserData, MembershipType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import type { PaginatedDocs, Where } from "payload"
import { NotFound } from "payload"
import { payload } from "@/data-layer/adapters/Payload"

export default class UserDataService {
  /**
   * Creates a new {@link User} document
   *
   * @param newUserData the {@link CreateUserData} to create a new user with
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
   * @param query The search query to filter users by name or email
   * @param filter JSON string containing field-based filters
   * @returns a {@link PaginatedDocs} object containing {@link User} documents
   */
  public async getPaginatedUsers(
    options: { limit?: number; page?: number; query?: string; filter?: string } = {
      limit: 10,
      page: 1,
    },
  ): Promise<PaginatedDocs<User>> {
    const whereConditions: Where[] = []

    if (options.query) {
      const queryConditions = options.query
        .split(/ /g)
        .filter((token) => token)
        .map((token) => ({
          or: [
            { firstName: { like: token } },
            { lastName: { like: token } },
            { email: { like: token } },
          ] as Where[],
        }))
      whereConditions.push(...queryConditions)
    }

    if (options.filter) {
      try {
        const filters = JSON.parse(options.filter)
        Object.entries(filters).forEach(([field, value]) => {
          if (value && Array.isArray(value) && value.length > 0) {
            whereConditions.push({
              [field === "level" ? "playLevel" : field]: { in: value },
            } as Where)
          }
        })
      } catch (_error) {
        return Promise.reject(new Error("Invalid filter JSON"))
      }
    }

    return await payload.find({
      collection: "user",
      limit: options.limit,
      page: options.page,
      where: { and: whereConditions },
    })
  }

  /**
   * Finds {@link User} documents given an array of IDs.
   *
   * @param ids array of IDs of {@link User}s to find
   */
  public async getUsersByIds(ids: string[]): Promise<User[]> {
    const { docs } = await payload.find({
      collection: "user",
      where: {
        id: {
          in: ids,
        },
      },
    })

    if (!docs.length)
      throw new NotFound(() => {
        return "No users found"
      })

    return docs
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
   * Resets all memberships and/or sessions for {@link User} documents
   */
  public async resetAllMemberships(): Promise<void> {
    await payload.update({
      collection: "user",
      where: {
        and: [
          { role: { not_equals: MembershipType.admin } },
          {
            or: [
              { remainingSessions: { not_equals: 0 } },
              { role: { equals: MembershipType.member } },
            ],
          },
        ],
      },
      data: {
        role: MembershipType.casual,
        remainingSessions: 0,
      },
    })
  }

  /**
   * Deletes a {@link User} document
   *
   * @param id The ID of the {@link User} to delete
   * @param transactionID An optional transaction ID for the request, useful for tracking purposes
   * @returns The deleted {@link User} document if successful, otherwise throws a {@link NotFound} error
   */
  public async deleteUser(id: string, transactionID?: string | number): Promise<User> {
    return await payload.delete({
      collection: "user",
      id,
      req: {
        transactionID,
      },
    })
  }
}
