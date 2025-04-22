import { GET } from '@/app/api/example-double-user-count/route'

import dotenv from 'dotenv'
import { clearCollection, testPayloadObject } from 'tests/utils'

dotenv.config()

describe('double user count', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'user')
  })

  it('should double 1 user correctly', async () => {
    await testPayloadObject.create({
      collection: 'user',
      data: {
        firstName: 'ray',
        lastName: 'zhao',
        email: 'rayzhao@gmail.com',
        role: 'casual',
      },
    })

    const res = await GET()
    expect(await res.json()).toEqual(2)
  })

  it('should double 2 user correctly', async () => {
    await testPayloadObject.create({
      collection: 'user',
      data: {
        firstName: 'ray',
        lastName: 'zhao',
        email: 'rayzhao@gmail.com',
        role: 'casual',
      },
    })

    await testPayloadObject.create({
      collection: 'user',
      data: {
        firstName: 'straight',
        lastName: 'zhao',
        email: 'straight@gmail.com',
        role: 'casual',
      },
    })

    const res = await GET()
    expect(await res.json()).toEqual(4)
  })
})
