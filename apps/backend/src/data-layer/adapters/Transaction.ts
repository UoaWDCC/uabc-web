import { payload } from "./Payload"

/**
 * Retrieves a transaction ID for cascading deletes if related bookings should be deleted.
 * @param shouldDeleteRelated indicates whether related bookings should be deleted
 * @private
 *
 * @remarks it should be noted that this method will return undefined if the `deleteRelatedBookings` parameter is false or if transaction support is not enabled in Payload.
 */
export async function getTransactionId(
  shouldDeleteRelated: boolean,
): Promise<string | number | undefined> {
  if (!shouldDeleteRelated) return undefined
  return (await payload.db.beginTransaction()) ?? undefined
}

export async function commitCascadeTransaction(cascadeTransactionId?: string | number) {
  if (cascadeTransactionId) {
    await payload.db.commitTransaction(cascadeTransactionId)
  }
}

export async function rollbackCascadeTransaction(cascadeTransactionId?: string | number) {
  if (cascadeTransactionId) {
    await payload.db.rollbackTransaction(cascadeTransactionId)
  }
}
