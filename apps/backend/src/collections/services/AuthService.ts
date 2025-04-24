import type { Authentication } from "@/payload-types"
import type { CreateAuthenticationData } from "@/types/collections"
import configPromise from "@payload-config"
import { getPayload } from "payload"

const payload = await getPayload({
  config: configPromise,
})

export default class AuthService {
  /**
   * Method to create an authentication document.
   * @param param0 The data to create an Authentication with
   * @returns The Authentication document
   */
  public async createAuth({
    user,
    type,
    provider,
    providerAccountId,
    refreshToken,
    accessToken,
    expiresAt,
    tokenType,
    scope,
    idToken,
  }: CreateAuthenticationData): Promise<Authentication> {
    return await payload.create({
      collection: "authentication",
      data: {
        user,
        type,
        provider,
        providerAccountId,
        accessToken,
        expiresAt,
        scope,
        idToken,
        refreshToken,
        tokenType,
      },
    })
  }
}
