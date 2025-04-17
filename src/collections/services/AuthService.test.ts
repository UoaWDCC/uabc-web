import dotenv from 'dotenv'
import { clearCollection, testPayloadObject } from 'tests/utils'
import AuthService from './AuthService'
import { authenticationCreateMock } from 'tests/mocks/Authentication.mock'
import { userMock } from 'tests/mocks/User.mock'

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
