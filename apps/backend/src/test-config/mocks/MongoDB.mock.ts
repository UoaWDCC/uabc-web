/**
 * Generates a RANDOM mock MongoDB ObjectId.
 *
 * @deprecated ONLY use this for testing purposes.
 */
export const generateMockMongoID = (() => {
  let counter = 0
  return () => {
    counter += 1
    // Create a 24-character hex string that looks like a MongoDB ObjectId
    return counter.toString(16).padStart(24, "0")
  }
})()
