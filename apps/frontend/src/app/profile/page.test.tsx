import { bookingsMock, casualUserMock } from "@repo/shared/mocks"
import { render } from "@repo/ui/test-utils"
import Profile from "./page"

// TODO: rewrite tests after proper auth is implemented
describe("<Profile />", () => {
  it("should export the Profile component", () => {
    expect(Profile).toBeDefined()
  })

  it("should render the user panel and profile details properly given the user is casualUserMock", async () => {
    const { getAllByText } = render(await Profile())
    expect(`${casualUserMock.firstName} ${casualUserMock.lastName}`).toBeInTheDocument()
    expect(casualUserMock.role).toBeInTheDocument()
    expect(casualUserMock.phoneNumber ?? "--").toBeInTheDocument()
    expect(`Sessions left: ${casualUserMock.remainingSessions ?? 0}`).toBeInTheDocument()

    expect("Profile Details").toBeInTheDocument()
    expect(getAllByText(casualUserMock.firstName)).toHaveLength(3) // user panel, first name and email
    expect(casualUserMock.email).toBeInTheDocument()
  })

  it("should render the profile booking panel", async () => {
    const { getAllByTestId } = render(await Profile())
    expect("Your Bookings").toBeInTheDocument()
    expect(getAllByTestId("booking-card")).toHaveLength(bookingsMock.length)
  })

  it("should render the additional info properly given the user is casualUserMock", async () => {
    render(await Profile())
    expect("Additional Info").toBeInTheDocument()
    expect(casualUserMock.gender).toBeInTheDocument()
    expect(casualUserMock.playLevel).toBeInTheDocument()
    expect(casualUserMock.dietaryRequirements).toBeInTheDocument()
  })
})
