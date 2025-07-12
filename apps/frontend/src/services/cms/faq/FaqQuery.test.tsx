import type { Faq } from "@repo/shared/payload-types"
import { createSimpleSharedFAQItem } from "@repo/ui/test-config/mocks/FAQ.mock"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@/test-config/test-utils"
import { useFaq } from "./FaqQuery"
import { getFaq } from "./FaqService"

vi.mock("./FaqService", () => ({
  getFaq: vi.fn(),
}))

const mockedGetFaq = vi.mocked(getFaq)

let queryClient: QueryClient
let wrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element

describe("useFaq", () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    wrapper = ({ children }: { children: React.ReactNode }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
  })

  it("should return FAQ data when service call is successful", async () => {
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

    mockedGetFaq.mockResolvedValue({ data: { data: mockFaq }, isError: false })

    const { result } = renderHook(() => useFaq(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockFaq)
    expect(mockedGetFaq).toHaveBeenCalledTimes(1)
  })

  it("should return null when service returns no data", async () => {
    mockedGetFaq.mockResolvedValue({ data: undefined, isError: false })

    const { result } = renderHook(() => useFaq(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeNull()
  })

  it("should handle error when service call fails", async () => {
    const mockError = new Error("Failed to fetch FAQs")
    mockedGetFaq.mockRejectedValue(mockError)

    const { result } = renderHook(() => useFaq(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(mockError)
    expect(result.current.data).toBeUndefined()
  })

  it("should show loading state initially", () => {
    mockedGetFaq.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useFaq(), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it("should use correct query key", () => {
    renderHook(() => useFaq(), { wrapper })

    expect(queryClient.getQueryData(["faqs"])).toBeUndefined()
  })
})
