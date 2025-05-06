import configPromise from "@payload-config"
import { NextRequest } from "next/server"
// setup-teardown-hook.js
import { type CollectionSlug, type Payload, getPayload } from "payload"

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

/**
 * Convert parameters to a promise
 *
 * @param params The parameters to convert to a promise
 * @returns A promise that resolves to the parameters
 */
export const paramsToPromise = <T extends Record<string, unknown>>(params: T): Promise<T> => {
  return Promise.resolve(params)
}

/**
 * Send a Post Request Mock to URL
 *
 * @param url The url of the endpoint
 * @param body Post Request body
 * @returns
 */
export function createMockNextPostRequest(url: string, body: Record<string, unknown>) {
  return new NextRequest(new URL(url, "http://localhost:3000"), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
}
