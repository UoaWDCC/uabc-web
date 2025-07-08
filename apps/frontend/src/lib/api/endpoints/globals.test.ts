import type { Faq } from "@repo/shared/payload-types"
import { GetFaqResponseSchema } from "@repo/shared/schemas"
import { createSimpleSharedFAQItem } from "@repo/ui/test-config/mocks/FAQ.mock"
import { describe, expect, it, vi } from "vitest"
import { getFaq } from "./globals"

const mockFaq: Faq = {
  id: "1",
  title: "Frequently Asked Questions",
  questions: [
    createSimpleSharedFAQItem("Test Question 1", "Test Answer 1"),
    createSimpleSharedFAQItem("Test Question 2", "Test Answer 2"),
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

vi.stubGlobal(
  "fetch",
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(GetFaqResponseSchema.parse({ data: mockFaq })),
    }),
  ),
)

describe("getFaq", () => {
  it("should return faq", async () => {
    const response = await getFaq()

    expect(response).toEqual(mockFaq)
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/globals/faq`,
      expect.any(Object),
    )
  })
})
