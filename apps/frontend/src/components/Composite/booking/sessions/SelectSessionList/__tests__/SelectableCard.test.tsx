import { render, screen, userEvent } from "@/tests-frontend-utils/test-utils"
import { SelectableCard } from "../SelectableCard"

const session = {
  id: 1,
  weekday: "Monday",
  startTime: "2:00PM",
  endTime: "4:00PM",
  locationName: "Location",
  locationAddress: "Address",
  isFull: false,
}

describe("SelectableCard", () => {
  it("should render the card correctly", () => {
    render(<SelectableCard checked={false} handleSessionClick={() => {}} session={session} />)
    const card = screen.getByTestId("session-card")

    expect(card.textContent?.includes(session.weekday)).toBe(true)
    expect(card.textContent?.includes(session.startTime)).toBe(true)
    expect(card.textContent?.includes(session.endTime)).toBe(true)
    expect(card.textContent?.includes(session.locationName)).toBe(true)
  })

  it("should render the card as disabled if the session is full", () => {
    render(
      <SelectableCard
        checked={false}
        handleSessionClick={() => {}}
        session={{ ...session, isFull: true }}
      />,
    )
    const card = screen.getByTestId("session-card")

    expect(card.className).toContain("pointer-events-none")
    expect(card.textContent?.includes("(Session Full)")).toBe(true)
  })

  it("should call handleSessionClick when clicked", async () => {
    const handleSessionClick = vi.fn()
    const user = userEvent.setup()
    render(
      <SelectableCard checked={false} handleSessionClick={handleSessionClick} session={session} />,
    )
    const card = screen.getByTestId("session-card")

    await user.click(card)

    expect(handleSessionClick).toHaveBeenCalledWith(session.id)
  })
})
