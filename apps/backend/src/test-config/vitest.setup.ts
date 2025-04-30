import type { CollectionSlug } from "payload"

import { payload } from "@/data-layer/adapters/Payload"
import { clearCollection } from "./backend-utils"

afterEach(async () => {
  for (const slug of Object.keys(payload.collections)) {
    await clearCollection(payload, slug as CollectionSlug)
  }
})
