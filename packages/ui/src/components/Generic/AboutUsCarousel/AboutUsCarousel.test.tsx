import { mockImages } from "@repo/ui/test-config/mocks/Image.mock"
import { render, screen } from "@repo/ui/test-utils"
import { CarouselSlide } from "@yamada-ui/carousel"
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
  beforeEach(() => {
    global.Math.random = () => 0.5
  })

  it("should be a valid React element", () => {
    expect(isValidElement(<AboutUsCarousel />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(AboutUsCarousel.displayName).toBe("AboutUsCarousel")
  })

  it("should render carousel with images", () => {
    render(<AboutUsCarousel images={mockImages} />)

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

  it("should render carousel with children", () => {
    render(
      <AboutUsCarousel>
        <CarouselSlide data-testid="custom-slide-1">Custom Content 1</CarouselSlide>
        <CarouselSlide data-testid="custom-slide-2">Custom Content 2</CarouselSlide>
      </AboutUsCarousel>,
    )

    expect(screen.getByTestId("custom-slide-1")).toBeInTheDocument()
    expect(screen.getByTestId("custom-slide-2")).toBeInTheDocument()
    expect(screen.getByText("Custom Content 1")).toBeInTheDocument()
    expect(screen.getByText("Custom Content 2")).toBeInTheDocument()
  })

  it("should render both images and children together", () => {
    render(
      <AboutUsCarousel images={mockImages}>
        <CarouselSlide data-testid="custom-slide">Custom Content</CarouselSlide>
      </AboutUsCarousel>,
    )

    expect(screen.getByAltText("Test Image 1")).toBeInTheDocument()
    expect(screen.getByAltText("Test Image 2")).toBeInTheDocument()
    expect(screen.getByTestId("custom-slide")).toBeInTheDocument()
    expect(screen.getByText("Custom Content")).toBeInTheDocument()
  })

  it("should apply iconProps to Center component", () => {
    render(
      <AboutUsCarousel
        iconProps={{
          bg: "blue.500",
        }}
      />,
    )

    const emoji = screen.getByText("😆")
    expect(emoji).toBeVisible()
  })

  it("should apply slideProps to CarouselSlide components", () => {
    render(
      <AboutUsCarousel
        images={mockImages}
        slideProps={{
          bg: "gray.100",
        }}
      />,
    )

    const images = screen.getAllByRole("img")
    expect(images).toHaveLength(2)
  })

  it("should generate different emojis based on Math.random", () => {
    global.Math.random = () => 0
    const { unmount: unmount1 } = render(<AboutUsCarousel key="test1" />)
    expect(screen.getByText("😄")).toBeVisible()
    unmount1()

    global.Math.random = () => 0.99
    const { unmount: unmount2 } = render(<AboutUsCarousel key="test2" />)
    expect(screen.getByText("🤩")).toBeVisible()
    unmount2()

    global.Math.random = () => 0.375
    render(<AboutUsCarousel key="test3" />)
    expect(screen.getByText("😊")).toBeVisible()
  })

  it("should handle undefined images", () => {
    render(<AboutUsCarousel images={undefined} />)

    const images = screen.queryAllByRole("img")
    expect(images).toHaveLength(0)
    expect(screen.getByText("😆")).toBeVisible()
  })

  it("should memoize the random emoji", () => {
    let randomCallCount = 0
    const originalRandom = global.Math.random
    global.Math.random = () => {
      randomCallCount++
      return 0.5
    }

    const { rerender } = render(<AboutUsCarousel />)
    const initialCallCount = randomCallCount

    rerender(<AboutUsCarousel />)
    expect(randomCallCount).toBe(initialCallCount)

    global.Math.random = originalRandom
  })
})
