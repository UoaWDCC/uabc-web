import dotenv from 'dotenv'
import { userMock } from 'tests/mocks/User.mock'
import { clearCollection, testPayloadObject } from 'tests/utils'
import UserService from './UserService'

dotenv.config()

const userService = new UserService()

describe('user service', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  it('should create a user document', async () => {
    const newUser = await userService.createUser(userMock)
    const fetchedUser = await testPayloadObject.find({
      collection: 'user',
      where: {
        id: {
          equals: newUser.id,
        },
      },
    })
    expect(fetchedUser.docs[0]).toEqual(newUser)
  })

  it('should be able to get a user document by email', async () => {
    const newUser = await userService.createUser(userMock)
    const fetchedUser = await userService.getUserByEmail(userMock.email)
    expect(fetchedUser).toEqual(newUser)
  })

  it('should return undefined if user does not exist', async () => {
    const fetchedUser = await userService.getUserByEmail('nonexistent@example.com')
    expect(fetchedUser).toBeUndefined()
  })
})
