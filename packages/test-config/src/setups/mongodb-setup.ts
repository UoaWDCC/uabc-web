import * as db from "./db"

// Set up environment variables for tests
process.env.PAYLOAD_SECRET = "I love uabc!!!!"
process.env.DATABASE_URI = await db.getUri()
