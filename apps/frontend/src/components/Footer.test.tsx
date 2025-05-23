import "@testing-library/jest-dom"
import { render, screen } from "@/test-config/test-utils"
import { Footer } from "./Footer"

vi.mock("@repo/ui/components/Image", () => ({
  // biome-ignore lint/nursery/noImgElement: this is for a test
  // biome-ignore lint/a11y/useAltText: this is for a test
  // biome-ignore lint/suspicious/noExplicitAny: this is for a test
  Image: (props: any) => <img {...props} data-testid="custom-image" />,
}))

describe("<Footer />", () => {
  it("should be memoized", () => {
    const { rerender } = render(<Footer />)
    const firstRender = render(<Footer />)
    rerender(<Footer />)
    expect(firstRender).toMatchSnapshot()
  })

  it("should have correct displayName", () => {
    expect(Footer.displayName).toBe("Footer")
  })

  it("should render social links correctly", () => {
    render(<Footer />)
    const socialLinks = ["LinkTree", "Facebook", "Instagram"]
    for (const link of socialLinks) {
      expect(screen.getByLabelText(link)).toBeInTheDocument()
    }
  })

  it("should render quick links correctly", () => {
    render(<Footer />)
    const quickLinks = ["Home", "Book a Court", "Events"]
    for (const link of quickLinks) {
      expect(screen.getByText(link)).toBeInTheDocument()
    }
  })

  it("should render UABC links correctly", () => {
    render(<Footer />)
    const uabcLinks = ["About Us", "Contact Us", "FAQs"]
    for (const link of uabcLinks) {
      expect(screen.getByText(link)).toBeInTheDocument()
    }
  })

  it("should render copyright text correctly", () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(
      screen.getByText(`© ${currentYear} University of Auckland Badminton Club.`),
    ).toBeInTheDocument()
    expect(screen.getByText("All rights reserved.")).toBeInTheDocument()
  })

  it("should render developer credit correctly", () => {
    render(<Footer />)
    expect(screen.getByText("Developed by the 2025 WDCC UABC Team")).toBeInTheDocument()
  })
})
