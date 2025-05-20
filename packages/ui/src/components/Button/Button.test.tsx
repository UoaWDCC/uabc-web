import { render, screen } from "@/test-utils"
import { isValidElement } from "react"
import { Button } from "./Button"
import * as ButtonModule from "./index"

describe("<Button />", () => {
  it("should re-export the Button component and check if Button exists", () => {
    expect(ButtonModule.Button).toBeDefined()
    expect(isValidElement(<ButtonModule.Button />)).toBeTruthy()
  })

  it("renders with start icon", () => {
    render(<Button startIcon={<>start icon</>} />)

    expect(screen.getByText("start icon")).toBeInTheDocument()
  })

  it("renders with end icon", () => {
    render(<Button endIcon={<>end icon</>} />)

    expect(screen.getByText("end icon")).toBeInTheDocument()
  })

  it("shows loading text if loading, loadingText and loadingIcon", () => {
    const { rerender } = render(
      <Button loading loadingIcon={<>loading start</>} loadingText="Submitting">
        Submit
      </Button>,
    )

    // children text is hidden
    expect(screen.queryByText("Submit")).not.toBeInTheDocument()

    // "Submitting" visually hidden label shown
    expect(screen.getByText("Submitting")).toBeInTheDocument()

    // Confirm loading position
    expect(screen.getByText("loading start")).toHaveClass("ui-button__loading--start")

    rerender(
      <Button
        loading
        loadingIcon={<>loading end</>}
        loadingPlacement="end"
        loadingText="Test if loading placement"
      >
        Submit
      </Button>,
    )

    expect(screen.getByText("loading end")).toHaveClass("ui-button__loading--end")
  })

  it("has the proper aria attributes", () => {
    const { rerender } = render(<Button>Hello</Button>)

    const button = screen.getByText("Hello")

    expect(button).not.toHaveAttribute("data-loading", "")
    expect(button).not.toHaveAttribute("data-active", "")

    // loading sets data-loading=""
    rerender(<Button loading>Hello</Button>)
    expect(button).toHaveAttribute("data-loading", "")

    // active sets data-active=""
    rerender(<Button active>Hello</Button>)
    expect(button).toHaveAttribute("data-active", "")
  })

  it("has the proper type attribute", () => {
    const { rerender } = render(<Button>Submit</Button>)
    expect(screen.getByText("Submit")).toHaveAttribute("type", "button")

    rerender(<Button type="submit">Submit</Button>)
    expect(screen.getByText("Submit")).toHaveAttribute("type", "submit")

    rerender(<Button as="button">Submit</Button>)
    expect(screen.getByText("Submit")).toHaveAttribute("type")
  })

  it("has no type when not a button", () => {
    render(<Button as="span">Submit</Button>)
    expect(screen.getByText("Submit")).not.toHaveAttribute("type")
  })

  it("should be disabled", () => {
    const { rerender } = render(<Button disabled>Invalid Button</Button>)
    expect(screen.getByText("Invalid Button")).toBeDisabled()

    rerender(<Button disabled>Invalid Button</Button>)

    expect(screen.getByText("Invalid Button")).toHaveAttribute("disabled")
  })
})
