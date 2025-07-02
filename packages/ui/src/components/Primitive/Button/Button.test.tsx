import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { Button } from "./Button"
import { styles } from "./button.style"
import * as ButtonModule from "./index"

describe("<Button />", () => {
  it("should re-export the Button component and check if Button exists", () => {
    expect(ButtonModule.Button).toBeDefined()
    expect(isValidElement(<ButtonModule.Button />)).toBeTruthy()
  })

  it("should forward ref correctly", () => {
    const ref = { current: null }
    render(<ButtonModule.Button ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  describe("size fallback logic", () => {
    it.each(["xs", "sm", "md", "lg", "xl", "2xl"] as const)(
      "should apply size-specific styles when size exists in styles object",
      (size) => {
        render(<Button size={size}>Test Button</Button>)
        const button = screen.getByRole("button")
        expect(button).toBeInTheDocument()

        expect(Object.hasOwn(styles, size)).toBe(true)
      },
    )

    it.each(["invalid", "huge", "tiny", "enormous"] as const)(
      "should apply base styles when size does not exist in styles object",
      (size) => {
        // biome-ignore lint/suspicious/noExplicitAny: for testing
        render(<Button size={size as any}>Test Button</Button>)
        const button = screen.getByRole("button")
        expect(button).toBeInTheDocument()

        expect(Object.hasOwn(styles, size)).toBe(false)
      },
    )

    it("should use default md size when no size prop is provided", () => {
      render(<Button>Test Button</Button>)
      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()

      expect(Object.hasOwn(styles, "md")).toBe(true)
    })

    it("should handle undefined size gracefully", () => {
      render(<Button size={undefined}>Test Button</Button>)
      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()

      expect(Object.hasOwn(styles, "md")).toBe(true)
    })

    it("should not apply base styles when variant is unstyled", () => {
      render(
        <Button size="invalid" variant="unstyled">
          Test Button
        </Button>,
      )
      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()
    })
  })
})
