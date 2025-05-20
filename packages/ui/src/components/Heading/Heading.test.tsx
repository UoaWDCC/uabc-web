import { render, screen } from "@/test-utils"
import { isValidElement } from "react"
import { Heading } from "./Heading"
import { DEFAULT_FONT_SIZES, DEFAULT_FONT_WEIGHTS } from "./Heading"
import { Heading as HeadingModule } from "./index"

const headingLevels = Object.keys(DEFAULT_FONT_SIZES)

describe("<Heading />", () => {
  it("should re-export the Heading component with namespace and check if Heading exists", () => {
    expect(HeadingModule).toBeDefined()

    expect(isValidElement(<HeadingModule.h1>Heading</HeadingModule.h1>)).toBeTruthy()
    expect(isValidElement(<HeadingModule.h2>Heading</HeadingModule.h2>)).toBeTruthy()
    expect(isValidElement(<HeadingModule.h3>Heading</HeadingModule.h3>)).toBeTruthy()
    expect(isValidElement(<HeadingModule.h4>Heading</HeadingModule.h4>)).toBeTruthy()
    expect(isValidElement(<HeadingModule.h5>Heading</HeadingModule.h5>)).toBeTruthy()
    expect(isValidElement(<HeadingModule.h6>Heading</HeadingModule.h6>)).toBeTruthy()
  })

  it.each(headingLevels)("renders %s variant correctly", (level) => {
    const HeadingComponent = HeadingModule[level as keyof typeof HeadingModule]
    render(HeadingComponent({ children: `Heading ${level}` }))
    const headingElement = screen.getByRole("heading", {
      name: `Heading ${level}`,
      level: Number.parseInt(level.slice(1), 10),
    })
    expect(headingElement).toBeInTheDocument()
  })

  it("renders with default props", () => {
    render(<Heading>Hello World</Heading>)
    const heading = screen.getByText("Hello World")
    expect(heading).toBeInTheDocument()
    expect(heading.tagName.toLowerCase()).toBe("h1")
  })

  it("applies correct font weights for different heading levels", () => {
    for (const [level, weight] of Object.entries(DEFAULT_FONT_WEIGHTS)) {
      render(<Heading as={level}>Test Heading {level}</Heading>, {
        withProvider: false,
      })
      const heading = screen.getByText(`Test Heading ${level}`)
      expect(heading).toHaveStyle({ fontWeight: weight })
    }
  })

  it("forwards additional props to UIHeading", () => {
    render(
      <Heading color="blue" data-testid="custom-heading">
        Custom Heading
      </Heading>,
    )
    const heading = screen.getByTestId("custom-heading")
    expect(heading).toHaveStyle({ color: "rgb(0, 0, 255)" })
  })

  it("uses fallback values for invalid heading level", () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    render(<Heading as="invalid">Invalid Heading</Heading>, {
      withProvider: false,
    })
    const heading = screen.getByText("Invalid Heading")

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
