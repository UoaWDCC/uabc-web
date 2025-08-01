import { bookingsMock, casualUserMock } from "@repo/shared/mocks"
import { render, screen } from "@repo/ui/test-utils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { vi } from "vitest"
import { AuthProvider } from "@/context/AuthContext"
import Profile from "./page"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  redirect: vi.fn(),
}))

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: casualUserMock,
    isLoading: false,
    isPending: false,
    error: null,
    login: {
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
    },
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe.skip("<Profile />", () => {
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
    wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    )
  })

  it("should export the Profile component", () => {
    expect(Profile).toBeDefined()
  })

  it("should render the user panel and profile details properly given the user is casualUserMock", async () => {
    render(await Profile(), { wrapper: wrapper })
    expect(
      screen.getByText(`${casualUserMock.firstName} ${casualUserMock.lastName}`),
    ).toBeInTheDocument()
    expect(screen.getByText(casualUserMock.role)).toBeInTheDocument()
    expect(screen.getByText(casualUserMock.phoneNumber ?? "N/A")).toBeInTheDocument()
    expect(
      screen.getByText(`Sessions left: ${casualUserMock.remainingSessions ?? 0}`),
    ).toBeInTheDocument()

    expect(screen.getByText("Profile Details")).toBeInTheDocument()
    expect(screen.getByDisplayValue(casualUserMock.firstName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(casualUserMock.email)).toBeInTheDocument()
  })

  it.skip("should render the profile booking panel", async () => {
    render(await Profile(), { wrapper: wrapper })
    expect(screen.getByText("Your Bookings")).toBeInTheDocument()
    expect(screen.getAllByTestId("booking-card")).toHaveLength(bookingsMock.length)
  })

  it.skip("should render the additional info properly given the user is casualUserMock", async () => {
    render(await Profile(), { wrapper: wrapper })
    expect(screen.getByText("Additional Info")).toBeInTheDocument()
    casualUserMock.gender &&
      expect(screen.getByDisplayValue(casualUserMock.gender)).toBeInTheDocument()
    casualUserMock.playLevel &&
      expect(screen.getByDisplayValue(casualUserMock.playLevel)).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(casualUserMock.dietaryRequirements as string),
    ).toBeInTheDocument()
  })
})
