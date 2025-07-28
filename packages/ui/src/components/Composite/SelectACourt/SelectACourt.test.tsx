import { MembershipType } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { SelectACourt } from "./SelectACourt"

const sessions = [
  {
    label: "Session 1",
    memberAttendees: "2",
    casualAttendees: "1",
    value: "s1",
    addon: "",
    description: "Morning session",
  },
  {
    label: "Session 2",
    memberAttendees: "3",
    casualAttendees: "2",
    value: "s2",
    addon: "",
    description: "Afternoon session",
    disabled: true,
  },
]

describe("<SelectACourt />", () => {
  it("should render the component and heading", () => {
    render(<SelectACourt membershipType={MembershipType.member} sessions={sessions} />)
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Select a court")
  })

  it("should show correct sessions left for member", () => {
    render(<SelectACourt membershipType={MembershipType.member} sessions={sessions} />)
    expect(screen.getByText(/Sessions Left:/)).toBeInTheDocument()
  })

  it("should call onSelect when a session is selected", () => {
    const onSelect = vi.fn()
    const { user } = render(
      <SelectACourt
        membershipType={MembershipType.member}
        onSelect={onSelect}
        sessions={sessions}
      />,
    )

    user.click(screen.getByText("Session 1"))
    expect(onSelect).toHaveBeenCalled()
  })

  it("should disable Next button when nothing is selected", () => {
    render(<SelectACourt membershipType={MembershipType.member} sessions={sessions} />)
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it("should enable Next button when a session is selected", async () => {
    const { user } = render(
      <SelectACourt membershipType={MembershipType.member} sessions={sessions} />,
    )
    await user.click(screen.getByText("Session 1"))
    expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled()
  })
})
