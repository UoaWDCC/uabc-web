import { payload } from "@/data-layer/adapters/Payload"
import type { Authentication } from "@/payload-types"
import type { CreateAuthenticationData } from "@/types/collections"

export default class AuthService {
  /**
   * Method to create an authentication document.
   * @param param0 The data to create an Authentication with
   * @returns The Authentication document
   */
  public async createAuth(newAuth: CreateAuthenticationData): Promise<Authentication> {
    return await payload.create({
      collection: "authentication",
      data: newAuth,
    })
  }
}
