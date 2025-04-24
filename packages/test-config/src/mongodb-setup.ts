import { MongoMemoryServer } from "mongodb-memory-server"
export const mongod = await MongoMemoryServer.create()

process.env.PAYLOAD_SECRET = "I love uabc!!!!"
process.env.DATABASE_URI = mongod.getUri()
