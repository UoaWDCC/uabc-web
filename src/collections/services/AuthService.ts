import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { User } from '@/payload-types'

const payload = await getPayload({
  config: configPromise,
})

export default class AuthService {
  public async createAuth(
    user: User,
    type: string,
    provider: 'google',
    providerAccountId: string,
    accessToken: string,
    expiresAt: number,
    scope: string,
    idToken: string,
  ) {
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
