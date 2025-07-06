import { mockImagesWithEmoji } from "@repo/ui/test-config/mocks/AboutUsCarousel.mock"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { AboutUsCarousel } from "./AboutUsCarousel"

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5
global.Math = mockMath

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)

describe("<AboutUsCarousel />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<AboutUsCarousel items={mockImagesWithEmoji} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(AboutUsCarousel.displayName).toBe("AboutUsCarousel")
  })

  it("should render carousel with images", () => {
    render(<AboutUsCarousel items={mockImagesWithEmoji} />)

    const images = screen.getAllByRole("img")
    expect(images).toHaveLength(2)

    expect(screen.getByAltText("Test Image 1")).toBeInTheDocument()
    expect(screen.getByAltText("Test Image 2")).toBeInTheDocument()

    const firstImage = screen.getByAltText("Test Image 1")
    expect(firstImage).toHaveAttribute("width", "600")
    expect(firstImage).toHaveAttribute("height", "400")

    const secondImage = screen.getByAltText("Test Image 2")
    expect(secondImage).toHaveAttribute("width", "800")
    expect(secondImage).toHaveAttribute("height", "600")
  })

  it("should apply iconProps to Center component", () => {
    render(
      <AboutUsCarousel
        iconProps={{
          bg: "blue.500",
        }}
        items={mockImagesWithEmoji}
      />,
    )

    const emoji = screen.getByText("😆")
    expect(emoji).toBeVisible()
  })

  it("should update emoji when carousel slide changes", async () => {
    const { user } = render(<AboutUsCarousel items={mockImagesWithEmoji} />)

    expect(screen.getByText("😆")).toBeVisible()

    const indicators = screen.getAllByRole("button")
    expect(indicators).toHaveLength(2)

    await user.click(indicators[1])

    expect(screen.getByText("😆")).toBeVisible()
    expect(screen.getByAltText("Test Image 2")).toBeInTheDocument()
  })
})
