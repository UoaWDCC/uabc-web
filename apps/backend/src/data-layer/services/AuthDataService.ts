import type { CreateAuthenticationData } from "@repo/shared"
import type { Authentication } from "@repo/shared/payload-types"
import { NotFound } from "payload"
import { payload } from "@/data-layer/adapters/Payload"

export default class AuthDataService {
  /**
   * Creates a new {@link Authentication} document.
   *
   * @param newAuth The {@link CreateAuthenticationData} to create an {@link Authentication} with
   * @returns The {@link Authentication} document
   */
  public async createAuth(newAuth: CreateAuthenticationData): Promise<Authentication> {
    return await payload.create({
      collection: "authentication",
      data: newAuth,
    })
  }

  /**
   * Finds an {@link Authentication} document with the target email.
   *
   * @param email The email of the {@link Authentication} to find
   * @returns The {@link Authentication} document if exists, otherwise throws a {@link NotFound} error
   */
  public async getAuthByEmail(email: string): Promise<Authentication> {
    const { docs } = await payload.find({
      collection: "authentication",
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (!docs[0]) {
      throw new NotFound(() => `Authentication with the email: ${email} was not found.`)
    }

    return docs[0]
  }
}
