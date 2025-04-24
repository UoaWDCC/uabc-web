import { clearCollection, testPayloadObject } from '@/test-config/backend-utils'
import { authenticationCreateMock } from '@/test-config/mocks/Authentication.mock'
import { userMock } from '@/test-config/mocks/User.mock'
import dotenv from 'dotenv'
import AuthService from './AuthService'

dotenv.config()

const authService = new AuthService()

describe('auth service', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'authentication')
  })

  it('should create an authentication document', async () => {
    // Create user first so that the auth mock will have an existent user
    await testPayloadObject.create({
      collection: 'user',
      data: userMock,
    })

    const newAuth = await authService.createAuth(authenticationCreateMock)
    const fetchedAuth = await testPayloadObject.find({
      collection: 'authentication',
      where: {
        id: {
          equals: newAuth.id,
        },
      },
    })
    expect(fetchedAuth.docs[0]).toEqual(newAuth)
  })
})
