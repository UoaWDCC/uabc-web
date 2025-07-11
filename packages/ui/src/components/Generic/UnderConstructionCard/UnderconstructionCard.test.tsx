import { render, screen } from "@repo/ui/test-utils"
import { UnderConstructionCard } from "./UnderConstructionCard"

describe("<UnderConstructionCard />", () => {
  it("should have the correct display name", () => {
    expect(UnderConstructionCard.displayName).toBe("UnderConstructionCard")
  })

  it("should render default title and description correctly", () => {
    render(<UnderConstructionCard />)
    expect(screen.getByText("Feature is Under Construction 🔧")).toBeInTheDocument()
    expect(
      screen.getByText("Our team is busy working on this page. Check back later!"),
    ).toBeInTheDocument()
  })
})
