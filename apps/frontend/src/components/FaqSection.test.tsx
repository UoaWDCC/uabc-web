import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { getFaq } from "@/services/cms/faq/FaqService"
import { render, screen, waitFor } from "@/test-config/test-utils"
import { FaqSection } from "./FaqSection"

vi.mock("@/services/cms/faq/FaqService", () => ({
  getFaq: vi.fn(),
}))

const mockedGetFaq = vi.mocked(getFaq)

describe("<FaqSection />", async () => {
  let Wrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element

  beforeEach(() => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    mockedGetFaq.mockResolvedValue({
      data: {
        data: {
          id: "1",
          title: "FAQs",
          questions: [],
        },
      },
      isError: false,
    })
    vi.clearAllMocks()
  })

  it("should render FAQ component", async () => {
    render(
      <Wrapper>
        <FaqSection />
      </Wrapper>,
    )
    await waitFor(() => expect(screen.getByText("FAQs")).toBeInTheDocument())
  })

  it("should display loading state", () => {
    render(
      <Wrapper>
        <FaqSection />
      </Wrapper>,
    )
    expect(screen.getByTestId("faq-loading")).toBeInTheDocument()
  })

  it("should display error message on failure", async () => {
    mockedGetFaq.mockRejectedValue(new Error("Failed to fetch FAQ"))

    render(
      <Wrapper>
        <FaqSection />
      </Wrapper>,
    )

    await waitFor(() => expect(screen.getByText("Failed to load FAQs")).toBeInTheDocument())
  })

  it("should render empty FAQ when no items provided", async () => {
    mockedGetFaq.mockResolvedValue({
      data: {
        data: {
          id: "1",
          title: "FAQs",
          questions: [],
        },
      },
      isError: false,
    })

    render(
      <Wrapper>
        <FaqSection />
      </Wrapper>,
    )

    await waitFor(() => expect(screen.getByText("FAQs")).toBeInTheDocument())

    const accordionItems = screen.queryAllByRole("button", { expanded: false })
    expect(accordionItems).toHaveLength(0)
  })
})
