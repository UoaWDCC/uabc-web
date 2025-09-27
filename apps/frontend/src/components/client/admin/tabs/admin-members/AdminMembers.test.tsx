import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { AuthProvider } from "@/context/AuthContext"
import { AdminMembers } from "./AdminMembers"

describe("<AdminMembers />", () => {
  let queryClient: QueryClient
  let wrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    const WithNuqsTestingAdapter = withNuqsTestingAdapter()
    wrapper = ({ children }: { children: React.ReactNode }) => (
      <WithNuqsTestingAdapter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </WithNuqsTestingAdapter>
    )
  })

  it("should render the AdminMembers component", async () => {
    render(<AdminMembers />, { wrapper: wrapper })
    expect(screen.getByRole("table")).toBeInTheDocument()
  })
})
