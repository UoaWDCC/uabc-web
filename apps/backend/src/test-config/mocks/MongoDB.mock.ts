/**
 * Generates a RANDOM mock MongoDB ObjectId.
 *
 * @deprecated ONLY use this for testing purposes.
 * @example
 * import { generateMockMongoDBObjectID } from "@/test-config/mocks/MongoDB.mock"
 * const mockId = generateMockMongoDBObjectID() // e.g. "000000000000000000000001"
 * const anotherMockId = generateMockMongoDBObjectID() // e.g. "000000000000000000000002"
 */
export const generateMockMongoDBObjectID = (() => {
  let counter = 0
  return () => {
    counter += 1
    // Create a 24-character hex string that looks like a MongoDB ObjectId
    return counter.toString(16).padStart(24, "0")
  }
})()
