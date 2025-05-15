import type { User } from "@/payload-types"
import configPromise from "@payload-config"
import type { CreateUserData } from "@repo/shared"
import { getPayload } from "payload"

const payload = await getPayload({
  config: configPromise,
})

export default class UserService {
  /**
   * Creates a new user document
   * @param param0 the user data
   * @returns the created user document
   */
  public async createUser({
    firstName,
    lastName,
    role,
    email,
    remainingSessions = 0,
    image,
  }: CreateUserData): Promise<User> {
    const newUser = await payload.create({
      collection: "user",
      data: {
        firstName,
        lastName,
        role,
        email,
        remainingSessions,
        image,
      },
    })

    return newUser
  }

  /**
   * Finds a user with target email
   * @param email the email of the user to find
   * @returns The user document if exists, otherwise null
   */
  public async getUserByEmail(email: string): Promise<User | null> {
    const { docs } = await payload.find({
      collection: "user",
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (!docs.length) {
      return null
    }

    return docs[0]
  }

  /**
   * Finds a user by their ID.
   * @param id The ID of the user to find.
   * @returns The user document if found, otherwise null
   */
  public async getUserById(id: string): Promise<User | null> {
    try {
      const user = await payload.findByID({
        collection: "user",
        id,
      })

      return user
    } catch (error) {
      console.error(`Error fetching user by ID ${id}:`, (error as Error).message)

      return null
    }
  }

  /**
   * Updates a user document.
   * @param id The ID of the user to update.
   * @param data The partial data to update the user with.
   * @returns The updated user document if successful, null if user not found
   */
  public async updateUser(
    id: string,
    data: Partial<Omit<User, "id" | "updatedAt" | "createdAt">>,
  ): Promise<User | null> {
    const existingUser = await this.getUserById(id)

    if (!existingUser) {
      return null
    }

    const updatedUser = await payload.update({
      collection: "user",
      id,
      data,
    })

    return updatedUser
  }

  /**
   * Deletes a user document.
   * @param id The ID of the user to delete.
   * @returns The deleted user document if successful, null if user not found
   */
  public async deleteUser(id: string): Promise<User | null> {
    const existingUser = await this.getUserById(id)

    if (!existingUser) {
      return null
    }

    const deletedUser = await payload.delete({
      collection: "user",
      id,
    })

    return deletedUser
  }
}
