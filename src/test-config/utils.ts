import configPromise from '@payload-config'
// setup-teardown-hook.js
import { CollectionSlug, Payload, getPayload } from 'payload'

/**
 * Payload object to use in integration tests
 *
 * @example
 * import { testPayloadObject } from './utils'
 * testPayloadObject.create({
 *   collection: 'posts',
 *   data: {
 *     title: 'Hello, world!',
 *   }
 * }) // create a new document
 */
export const testPayloadObject = await getPayload({
  config: configPromise,
})

/**
 * Clear a collection in the database
 * @param payloadObject - Payload object to use in integration tests
 * @param collectionName - Name of the collection to clear
 *
 * @example
 * import { testPayloadObject, clearCollection } from './utils'
 * afterEach(() => clearCollection(testPayloadObject, 'posts'))
 */
export const clearCollection = async (payloadObject: Payload, collectionName: CollectionSlug) => {
  await payloadObject.delete({
    collection: collectionName,
    where: {
      id: {
        exists: true,
      },
    },
  })
}
