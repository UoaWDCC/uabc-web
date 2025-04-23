import { render } from "@testing-library/react"
import { Heading } from "./Heading"
import { DEFAULT_FONT_SIZES, DEFAULT_FONT_WEIGHTS } from "./Heading"
import { Heading as HeadingModule } from "./index"

const headingLevels = Object.keys(DEFAULT_FONT_SIZES)

describe("<Heading />", () => {
  it("should re-export the Heading component with namespace", () => {
    expect(HeadingModule).toBeDefined() // Check if Heading exists

    expect(typeof HeadingModule).toBe("object")
    expect(HeadingModule.h1).toBeDefined()
    expect(HeadingModule.h2).toBeDefined()
    expect(HeadingModule.h3).toBeDefined()
    expect(HeadingModule.h4).toBeDefined()
    expect(HeadingModule.h5).toBeDefined()
    expect(HeadingModule.h6).toBeDefined()
  })

  test.each(headingLevels)("renders %s variant correctly", (level) => {
    const HeadingComponent = HeadingModule[level as keyof typeof HeadingModule]
    const { getByRole } = render(HeadingComponent({ children: `Heading ${level}` }))
    const headingElement = getByRole("heading", {
      name: `Heading ${level}`,
      level: parseInt(level.slice(1), 10),
    })
    expect(headingElement).toBeInTheDocument()
  })

  test("renders with default props", () => {
    const { getByText } = render(<Heading>Hello World</Heading>)
    const heading = getByText("Hello World")
    expect(heading).toBeInTheDocument()
    expect(heading.tagName.toLowerCase()).toBe("h1")
  })

  test("applies correct font weights for different heading levels", () => {
    Object.entries(DEFAULT_FONT_WEIGHTS).forEach(([level, weight]) => {
      const { getAllByText } = render(<Heading as={level}>Test Heading {level}</Heading>)
      const [heading] = getAllByText(`Test Heading ${level}`)
      expect(heading).toHaveStyle({ fontWeight: weight })
    })
  })

  test("forwards additional props to UIHeading", () => {
    const { getByTestId } = render(
      <Heading data-testid="custom-heading" color="blue">
        Custom Heading
      </Heading>,
    )
    const heading = getByTestId("custom-heading")
    expect(heading).toHaveStyle({ color: "rgb(0, 0, 255)" })
  })

  test("uses fallback values for invalid heading level", () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const { getByText } = render(<Heading as="invalid">Invalid Heading</Heading>)
    const heading = getByText("Invalid Heading")
    expect(heading.tagName.toLowerCase()).toBe("h1")
    expect(heading).toHaveStyle({
      fontWeight: "bold",
    })

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Invalid heading level "invalid". Falling back to "h1".',
    )

    consoleWarnSpy.mockRestore()
  })
})
