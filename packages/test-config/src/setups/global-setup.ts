import * as db from "./db"

export default async function setup() {
  console.log("Setting up MongoDB replica set...")
  await db.create()
  console.log("MongoDB replica set ready")
}