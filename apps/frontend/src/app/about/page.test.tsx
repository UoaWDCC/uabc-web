import { render, screen } from "@/test-config/test-utils"
import About from "./page"

describe("<About />", () => {
  it("should export the About component", () => {
    expect(About).toBeDefined()
    expect(About).toBeTruthy()
  })

  it("should render the about page with under construction message", () => {
    render(<About />)
    expect(screen.getByText("Feature is Under Construction 🔧")).toBeInTheDocument()
    expect(screen.getByText("Our team is busy working on this page.")).toBeInTheDocument()
  })
})
