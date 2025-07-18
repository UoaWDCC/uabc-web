import { render, screen } from "@/test-config/test-utils"
import Events from "./page"

describe("<Events />", () => {
  it("should export the Events component", () => {
    expect(Events).toBeDefined()
    expect(Events).toBeTruthy()
  })

  it("should render the events page with under construction message", () => {
    render(<Events />)
    expect(screen.getByText("Feature is Under Construction 🔧")).toBeInTheDocument()
    expect(screen.getByText("Feature is Under Construction 🔧")).toBeInTheDocument()
    expect(
      screen.getByText("Our team is busy working on this page. Check back later!"),
    ).toBeInTheDocument()
  })
})
