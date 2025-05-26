import type { CollectionSlug } from "payload"

import { payload } from "@/data-layer/adapters/Payload"
import { clearCollection } from "./backend-utils"
import { JWT_SECRET_MOCK } from "./mocks/GoogleAuth.mock"

let cookies: Record<string, string> = {}
let headers: Record<string, string> = {}

beforeEach(() => {
  process.env.JWT_SECRET = JWT_SECRET_MOCK

  vi.mock("next/headers", () => ({
    cookies: vi.fn(() => ({
      set: vi.fn().mockImplementation((key: string, value: string, _cookie) => {
        cookies[key] = value
      }),
      get: vi.fn().mockImplementation((key: string) => {
        return { value: cookies[key] }
      }),
      delete: vi.fn().mockImplementation((key: string) => {
        delete cookies[key]
      }),
    })),
    headers: vi.fn(() => ({
      get: vi.fn().mockImplementation((key: string): string => {
        return headers[key]
      }),
    })),
  }))
})

afterEach(async () => {
  for (const slug of Object.keys(payload.collections)) {
    await clearCollection(payload, slug as CollectionSlug)
  }
  cookies = {}
  headers = {}
})
