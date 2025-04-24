import type { User } from "@/payload-types"
import type { CreateUserData } from "@/types/collections"
import configPromise from "@payload-config"
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
    image = undefined,
  }: CreateUserData): Promise<User> {
    const newUser = await payload.create({
      collection: "user",
      data: {
        firstName,
        lastName,
        role,
        remainingSessions,
        image,
        email,
      },
    })
    return newUser
  }
  /**
   * Finds a user with target email or returns undefined if not found
   * @param email the email of the user to find
   * @returns The user document if exists
   */
  public async getUserByEmail(email: string): Promise<User | undefined> {
    const userDocs = (
      await payload.find({
        collection: "user",
        where: {
          email: {
            equals: email,
          },
        },
      })
    ).docs
    if (!userDocs.length) return undefined
    return userDocs[0]
  }
}
