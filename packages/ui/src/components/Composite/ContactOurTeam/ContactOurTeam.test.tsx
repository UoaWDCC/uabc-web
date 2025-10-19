import { LinkTreeIcon } from "@repo/ui/components/Icon"
import { render, screen, waitFor } from "@repo/ui/test-utils"
import { FacebookIcon, InstagramIcon } from "@yamada-ui/lucide"
import { ContactOurTeam } from "./ContactOurTeam"

const mockOnSubmit = vi.fn()

const mockSocialLinks = [
  {
    label: "LinkTree",
    url: "https://linktr.ee/uabc",
    icon: LinkTreeIcon,
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/uabc",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/uabc",
    icon: InstagramIcon,
  },
]

const defaultContactInfo = {
  // TODO: Change before deploying to production
  generalEmail: "badminton.au@gmail.com",
  bookingsEmail: "bookings@badminton.au",
  phoneNumber: "000-000-000",
  bookingsDescription:
    "Guest bookings, date changes, any clarification about your stay at the lodge",
}

describe("<ContactOurTeam />", () => {
  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it("should render the contact form with all required fields", () => {
    render(
      <ContactOurTeam
        contactInfo={defaultContactInfo}
        onSubmit={mockOnSubmit}
        socialLinks={mockSocialLinks}
      />,
    )

    expect(screen.getByText("Contact our team")).toBeInTheDocument()
    expect(screen.getByText("Let's help you with your problem")).toBeInTheDocument()
    expect(screen.getByTestId("firstName")).toBeInTheDocument()
    expect(screen.getByTestId("lastName")).toBeInTheDocument()
    expect(screen.getByTestId("universityEmail")).toBeInTheDocument()
    expect(screen.getByTestId("message")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
  })

  it("should display contact information sections", () => {
    render(
      <ContactOurTeam
        contactInfo={defaultContactInfo}
        onSubmit={mockOnSubmit}
        socialLinks={mockSocialLinks}
      />,
    )

    expect(screen.getByText("General Inquiries")).toBeInTheDocument()
    expect(screen.getByText("Bookings")).toBeInTheDocument()
    expect(screen.getByText("badminton.au@gmail.com")).toBeInTheDocument()
    expect(screen.getByText("bookings@badminton.au")).toBeInTheDocument()
    expect(screen.getByText("000-000-000")).toBeInTheDocument()
  })

  it.skip("should submit form with valid data", async () => {
    const { user } = render(
      <ContactOurTeam
        contactInfo={defaultContactInfo}
        onSubmit={mockOnSubmit}
        socialLinks={mockSocialLinks}
      />,
    )

    await user.type(screen.getByTestId("firstName"), "John")
    await user.type(screen.getByTestId("lastName"), "Doe")
    await user.type(screen.getByTestId("universityEmail"), "john.doe@aucklanduni.ac.nz")
    await user.type(screen.getByTestId("message"), "This is a test message for the contact form")

    const submitButton = screen.getByRole("button", { name: "Submit" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        universityEmail: "john.doe@aucklanduni.ac.nz",
        message: "This is a test message for the contact form",
      })
    })
  })

  it.skip("should show loading state when submitting", async () => {
    const slowOnSubmit = vi
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

    const { user } = render(
      <ContactOurTeam
        contactInfo={defaultContactInfo}
        onSubmit={slowOnSubmit}
        socialLinks={mockSocialLinks}
      />,
    )

    await user.type(screen.getByTestId("firstName"), "John")
    await user.type(screen.getByTestId("lastName"), "Doe")
    await user.type(screen.getByTestId("universityEmail"), "john.doe@aucklanduni.ac.nz")
    await user.type(screen.getByTestId("message"), "This is a test message")

    const submitButton = screen.getByRole("button", { name: "Submit" })
    await user.click(submitButton)

    expect(screen.getByText("Submitting...")).toBeInTheDocument()
  })

  it.skip("should reset form after successful submission", async () => {
    const { user } = render(
      <ContactOurTeam
        contactInfo={defaultContactInfo}
        onSubmit={mockOnSubmit}
        socialLinks={mockSocialLinks}
      />,
    )

    await user.type(screen.getByTestId("firstName"), "John")
    await user.type(screen.getByTestId("lastName"), "Doe")
    await user.type(screen.getByTestId("universityEmail"), "john.doe@aucklanduni.ac.nz")
    await user.type(screen.getByTestId("message"), "This is a test message")

    const submitButton = screen.getByRole("button", { name: "Submit" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId("firstName")).toHaveValue("")
      expect(screen.getByTestId("lastName")).toHaveValue("")
      expect(screen.getByTestId("universityEmail")).toHaveValue("")
      expect(screen.getByTestId("message")).toHaveValue("")
    })
  })
})
