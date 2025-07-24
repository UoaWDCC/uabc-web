import { render, screen } from "@/test-config/test-utils"
import Book from "./page"

describe("<Book />", () => {
  it("should export the Book component", () => {
    expect(Book).toBeDefined()
  })

  it("should render the book page with under construction message", () => {
    render(<Book />)
    expect(screen.getByText("Feature is Under Construction 🔧")).toBeInTheDocument()
    expect(
      screen.getByText("Our team is busy working on this page. Check back later!"),
    ).toBeInTheDocument()
  })
})
