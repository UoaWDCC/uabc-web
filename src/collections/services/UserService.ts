import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Media, User } from '@/payload-types'
import { MembershipType } from '@/types/types'

const payload = await getPayload({
  config: configPromise,
})

export default class UserService {
  public async createUser(
    firstName: string,
    lastName: string,
    role: MembershipType,
    email: string,
    remainingSessions?: number,
    image?: Media,
    password?: string,
  ): Promise<User> {
    const newUser = await payload.create({
      collection: 'user',
      data: {
        firstName,
        lastName,
        role,
        remainingSessions,
        image,
        email,
        password,
      },
    })
    return newUser
  }
  /**
   * Finds a user with target email
   * @param email the email of the user to find
   * @returns The user document
   */
  public async getUserByEmail(email: string): Promise<User> {
    const userDocs = (
      await payload.find({
        collection: 'user',
        where: {
          email: {
            equals: email,
          },
        },
      })
    ).docs
    if (!userDocs.length) throw new Error(`User with email, ${email} not found`)
    return userDocs[0]
  }
}
