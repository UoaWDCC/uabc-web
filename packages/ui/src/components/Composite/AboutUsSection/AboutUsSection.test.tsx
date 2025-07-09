import { mockImagesWithEmoji } from "@repo/ui/test-config/mocks/AboutUsCarousel.mock"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { AboutUsSection } from "./AboutUsSection"

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)

describe("<AboutUsSection />", () => {
  it("should re-export the AboutUsSection component and check if AboutUsSection component exists", () => {
    expect(AboutUsSection).toBeDefined()
    expect(isValidElement(<AboutUsSection cards={[]} items={mockImagesWithEmoji} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(AboutUsSection.displayName).toBe("AboutUsSection")
  })

  it("should render the section with a heading", () => {
    render(<AboutUsSection cards={[]} items={mockImagesWithEmoji} />)

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument()
    expect(screen.getByText("About Us")).toBeInTheDocument()
  })

  it("should render the Learn More button", () => {
    render(<AboutUsSection cards={[]} items={mockImagesWithEmoji} />)

    const button = screen.getByRole("link", { name: "Learn More" })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute("href", "/about")
  })

  it("should render the AboutUsCarousel component", () => {
    render(<AboutUsSection cards={[]} items={mockImagesWithEmoji} />)

    const carousel = screen.getByTestId("about-us-carousel")
    expect(carousel).toBeInTheDocument()
  })

  it("should render AboutUsCard components for each card", () => {
    const cards = [
      { title: "Card 1", description: "Description 1" },
      { title: "Card 2", description: "Description 2" },
      { title: "Card 3", description: "Description 3" },
    ]

    render(<AboutUsSection cards={cards} items={mockImagesWithEmoji} />)

    expect(screen.getByText("Card 1")).toBeInTheDocument()
    expect(screen.getByText("Description 1")).toBeInTheDocument()
    expect(screen.getByText("Card 2")).toBeInTheDocument()
    expect(screen.getByText("Description 2")).toBeInTheDocument()
    expect(screen.getByText("Card 3")).toBeInTheDocument()
    expect(screen.getByText("Description 3")).toBeInTheDocument()
  })
})
