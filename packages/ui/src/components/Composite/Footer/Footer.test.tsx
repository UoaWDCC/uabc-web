import { render, screen } from "@repo/ui/test-utils"
import { MOCK_LINKS, MOCK_SOCIAL_LINKS } from "./constants"
import { Footer } from "./Footer"

describe("<Footer />", () => {
  it("should have correct displayName", () => {
    expect(Footer.displayName).toBe("Footer")
  })

  it("should render social links correctly", () => {
    render(<Footer links={MOCK_LINKS} socialLinks={MOCK_SOCIAL_LINKS} />)
    const socialLinks = ["LinkTree", "Facebook", "Instagram"]
    for (const link of socialLinks) {
      const elements = screen.getAllByLabelText(link)
      expect(elements.length).toBe(2)
    }
  })

  it("should render quick links correctly", () => {
    render(<Footer links={MOCK_LINKS} socialLinks={MOCK_SOCIAL_LINKS} />)
    const quickLinks = ["Home", "Book a Court", "Events"]
    for (const link of quickLinks) {
      expect(screen.getByText(link)).toBeInTheDocument()
    }
  })

  it("should render UABC links correctly", () => {
    render(<Footer links={MOCK_LINKS} socialLinks={MOCK_SOCIAL_LINKS} />)
    const uabcLinks = ["About Us", "Contact Us", "FAQs"]
    for (const link of uabcLinks) {
      expect(screen.getByText(link)).toBeInTheDocument()
    }
  })

  it("should render copyright text correctly", () => {
    render(<Footer links={MOCK_LINKS} socialLinks={MOCK_SOCIAL_LINKS} />)
    const currentYear = new Date().getFullYear()
    expect(
      screen.getByText(`© ${currentYear} University of Auckland Badminton Club.`),
    ).toBeInTheDocument()
    expect(screen.getByText("All rights reserved.")).toBeInTheDocument()
  })

  it("should render developer credit correctly", () => {
    render(<Footer links={MOCK_LINKS} socialLinks={MOCK_SOCIAL_LINKS} />)
    expect(screen.getByText("Developed by the 2025 WDCC UABC Team")).toBeInTheDocument()
  })
})
