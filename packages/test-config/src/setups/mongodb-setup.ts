import * as db from "./db"

beforeAll(async () => {
  await db.create()
})

afterAll(async () => {
  await db.close()
})

process.env.PAYLOAD_SECRET = "I love uabc!!!!"
process.env.DATABASE_URI = await db.getUri()
