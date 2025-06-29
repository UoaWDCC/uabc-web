import { GoogleProvider } from "@/business-layer/provider/google"
import { payload } from "@/data-layer/adapters/Payload"
import type { CreateAuthenticationData } from "@repo/shared"
import type { Authentication } from "@repo/shared/payload-types"

export default class AuthDataService {
  /**
   * Method to create an {@link Authentication} document.
   *
   * @param newAuth The {@link CreateAuthenticationData} to create an {@link Authentication} with
   * @returns The {@link Authentication} document
   */
  public async createAuthIfNotExist(
    newAuth: CreateAuthenticationData,
  ): Promise<Authentication | undefined> {
    const findExistingAuth = await payload.find({
      collection: "authentication",
      limit: 1,
      where: {
        email: {
          equals: newAuth.email,
        },
      },
    })
    const authExists = findExistingAuth.docs.length > 0

    if (authExists) {
      const existingAuth = findExistingAuth.docs[0]
      const createdTime = new Date(existingAuth.createdAt).getTime()

      if (existingAuth.expiresAt) {
        const expiryTime = createdTime + existingAuth.expiresAt * 1000
        const now = Date.now()
        const accessToken = existingAuth.accessToken

        if (now < expiryTime && accessToken) GoogleProvider.revokeToken(accessToken)
      }
    } else {
      return await payload.create({
        collection: "authentication",
        data: newAuth,
      })
    }
  }
}
