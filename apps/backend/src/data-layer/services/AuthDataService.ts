import type { CreateAuthenticationData } from "@repo/shared"
import type { Authentication } from "@repo/shared/payload-types"
import { payload } from "@/data-layer/adapters/Payload"

export default class AuthDataService {
  /**
   * Method to create an {@link Authentication} document.
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
}
