import { describe, it, expect, afterEach } from 'vitest'

import { GET } from '@/app/example-double-user-count/route'

import dotenv from 'dotenv'
import { clearCollection, testPayloadObject } from '../../../tests/utils'

dotenv.config()

describe('double user count', () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, 'users')
  })

  it('should double 1 user correctly', async () => {
    await testPayloadObject.create({
      collection: 'users',
      data: {
        email: 'rayzhao@gmail.com',
        password: '12132',
      },
    })

    const res = await GET()
    expect(await res.json()).toEqual(2)
  })

  it('should double 2 user correctly', async () => {
    await testPayloadObject.create({
      collection: 'users',
      data: {
        email: 'rayzhao@gmail.com',
        password: '12132',
      },
    })

    await testPayloadObject.create({
      collection: 'users',
      data: {
        email: 'straight@gmail.com',
        password: '12132',
      },
    })

    const res = await GET()
    expect(await res.json()).toEqual(4)
  })
})
