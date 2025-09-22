import * as db from "./db"

export default async function setup() {
  console.log("Setting up MongoDB replica set...")
  const mongod = await db.create()

  // Set the database URI in environment variables
  process.env.DATABASE_URI = mongod.getUri()
  process.env.PAYLOAD_SECRET = "I love uabc!!!!"

  console.log("MongoDB replica set ready at:", process.env.DATABASE_URI)
}
