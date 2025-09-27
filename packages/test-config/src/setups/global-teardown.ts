import * as db from "./db"

export default async function teardown() {
  console.log("Tearing down MongoDB replica set...")
  await db.close()
  console.log("MongoDB replica set closed")
}
