import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CreateAuthenticationData } from '@/types/collections'
import { Authentication } from '@/payload-types'

const payload = await getPayload({
  config: configPromise,
})

export default class AuthService {
  public async createAuth({
    user,
    type,
    provider,
    providerAccountId,
    accessToken,
    expiresAt,
    scope,
    idToken,
  }: CreateAuthenticationData): Promise<Authentication> {
    return await payload.create({
      collection: 'authentication',
      data: {
        user,
        type,
        provider,
        providerAccountId,
        accessToken,
        expiresAt,
        scope,
        idToken,
      },
    })
  }
}
