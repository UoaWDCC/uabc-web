import { render, screen } from "@repo/ui/test-utils"
import { QueryProvider } from "./QueryProvider"

vi.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => <div data-testid="react-query-devtools">DevTools</div>,
}))

describe("<QueryProvider />", () => {
  const TestChild = () => <div data-testid="test-child">Test Child</div>

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("renders children correctly", () => {
    render(
      <QueryProvider>
        <TestChild />
      </QueryProvider>,
    )

    expect(screen.getByTestId("test-child")).toBeInTheDocument()
  })

  it("renders ReactQueryDevtools in development environment", () => {
    vi.stubEnv("NODE_ENV", "development")

    render(
      <QueryProvider>
        <TestChild />
      </QueryProvider>,
    )

    expect(screen.getByTestId("react-query-devtools")).toBeInTheDocument()
    expect(screen.getByTestId("test-child")).toBeInTheDocument()
  })

  it("does not render ReactQueryDevtools in production environment", () => {
    vi.stubEnv("NODE_ENV", "production")

    render(
      <QueryProvider>
        <TestChild />
      </QueryProvider>,
    )

    expect(screen.queryByTestId("react-query-devtools")).not.toBeInTheDocument()
    expect(screen.getByTestId("test-child")).toBeInTheDocument()
  })

  it("does not render ReactQueryDevtools in test environment", () => {
    vi.stubEnv("NODE_ENV", "test")

    render(
      <QueryProvider>
        <TestChild />
      </QueryProvider>,
    )

    expect(screen.queryByTestId("react-query-devtools")).not.toBeInTheDocument()
    expect(screen.getByTestId("test-child")).toBeInTheDocument()
  })
})
