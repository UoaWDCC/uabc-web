import { render, screen } from "@/test-config/test-utils"
import Contact from "./page"

describe("<Contact />", () => {
  it("should export the Contact component", () => {
    expect(Contact).toBeDefined()
  })

  it("should render the contact page with under construction message", () => {
    render(<Contact />)
    expect(screen.getByText("Feature is Under Construction 🔧")).toBeInTheDocument()
    expect(
      screen.getByText("Our team is busy working on this page. Check back later!"),
    ).toBeInTheDocument()
  })
})
