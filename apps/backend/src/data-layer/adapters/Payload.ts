import configPromise from "@payload-config"
import { getPayload, type Payload } from "payload"
import { testPayloadObject } from "@/test-config/backend-utils"

let payloadConfig = await getPayload({
  config: configPromise,
})

if (process.env.NODE_ENV === "test") {
  payloadConfig = testPayloadObject
}

export const payload: Payload = payloadConfig
