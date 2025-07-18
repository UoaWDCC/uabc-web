import { bookingsMock, casualUserMock } from "@repo/shared/mocks"
import { render, screen } from "@repo/ui/test-utils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Profile from "./page"

// TODO: rewrite tests after proper auth is implemented
describe("<Profile />", () => {
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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  it("should export the Profile component", () => {
    expect(Profile).toBeDefined()
  })

  it("should render the user panel and profile details properly given the user is casualUserMock", async () => {
    render(await Profile(), { wrapper: wrapper })
    expect(screen.getByText("straight zhao")).toBeInTheDocument()
    expect(screen.getByText("Casual")).toBeInTheDocument()
    expect(screen.getByText(casualUserMock.phoneNumber ?? "--")).toBeInTheDocument()
    expect(
      screen.getByText(`Sessions left: ${casualUserMock.remainingSessions ?? 0}`),
    ).toBeInTheDocument()

    expect(screen.getByText("Profile Details")).toBeInTheDocument()
    expect(screen.getAllByText(casualUserMock.firstName)).toHaveLength(3) // found in user panel, first name and email
    expect(screen.getByText(casualUserMock.email)).toBeInTheDocument()
  })

  it("should render the profile booking panel", async () => {
    render(await Profile(), { wrapper: wrapper })
    expect(screen.getByText("Your Bookings")).toBeInTheDocument()
    expect(screen.getAllByTestId("booking-card")).toHaveLength(bookingsMock.length)
  })

  it("should render the additional info properly given the user is casualUserMock", async () => {
    render(await Profile(), { wrapper: wrapper })
    expect(screen.getByText("Additional Info")).toBeInTheDocument()
    expect(screen.getByText("Non-binary")).toBeInTheDocument()
    expect(screen.getByText("Beginner")).toBeInTheDocument()
    expect(screen.getByText(casualUserMock.dietaryRequirements as string)).toBeInTheDocument()
  })
})
