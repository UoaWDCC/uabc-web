import { testPayloadObject } from "@/test-config/backend-utils"
import configPromise from "@payload-config"
import { type Payload, getPayload } from "payload"

let payloadConfig = await getPayload({
  config: configPromise,
})

if (process.env.NODE_ENV === "test") {
  payloadConfig = testPayloadObject
}

export const payload: Payload = payloadConfig
