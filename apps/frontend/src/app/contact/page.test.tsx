import { render, screen } from "@/test-config/test-utils"
import Contact from "./page"

describe("<Contact />", () => {
  it("should export the Contact component", () => {
    expect(Contact).toBeDefined()
  })

  it("should render the contact page with ContactOurTeam component", () => {
    render(<Contact />)
    expect(screen.getByText("Contact our team")).toBeInTheDocument()
    expect(screen.getByText("Let's help you with your problem")).toBeInTheDocument()
    expect(screen.getByText("General Inquiries")).toBeInTheDocument()
    expect(screen.getByText("Bookings")).toBeInTheDocument()
  })
})
