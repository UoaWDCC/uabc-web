import { payload } from "./Payload"

/**
 * Creates a transaction ID for cascading deletes
 *
 * @param shouldDeleteRelated indicates whether related bookings should be deleted
 * @returns the identifier for the transaction or null if one cannot be established
 */
export async function createTransactionId(): Promise<string | number | undefined> {
  return (await payload.db.beginTransaction()) ?? undefined
}

/**
 * Commits a transaction for a successful cascade transaction
 *
 * @param cascadeTransactionId the id of the cascade transaction
 */
export async function commitCascadeTransaction(cascadeTransactionId?: string | number) {
  if (cascadeTransactionId) {
    await payload.db.commitTransaction(cascadeTransactionId)
  }
}

/**
 * Rollbacks a transaction for failed cascade transaction
 *
 * @param cascadeTransactionId the id of the cascade transaction
 */
export async function rollbackCascadeTransaction(cascadeTransactionId?: string | number) {
  if (cascadeTransactionId) {
    await payload.db.rollbackTransaction(cascadeTransactionId)
  }
}
