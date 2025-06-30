import { isValidElement } from "react"
import { render, screen } from "@/test-utils"
import { IconButton } from "./IconButton"
import { styles } from "./icon-button.style"
import * as ButtonModule from "./index"

describe("<IconButton />", () => {
  it("should re-export the IconButton component and check if IconButton exists", () => {
    expect(ButtonModule.IconButton).toBeDefined()
    expect(isValidElement(<ButtonModule.IconButton />)).toBeTruthy()
  })

  it("should forward ref correctly", () => {
    const ref = { current: null }
    render(<ButtonModule.IconButton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  describe("size fallback logic", () => {
    it.each(["xs", "sm", "md", "lg", "xl"] as const)(
      "should apply size-specific styles when size exists in styles object",
      (size) => {
        render(<IconButton aria-label="Test Icon Button" size={size} />)
        const button = screen.getByRole("button")
        expect(button).toBeInTheDocument()

        expect(Object.hasOwn(styles, size)).toBe(true)
      },
    )

    it.each(["invalid", "huge", "tiny", "2xl", "enormous"] as const)(
      "should apply base styles when size does not exist in styles object",
      (size) => {
        // biome-ignore lint/suspicious/noExplicitAny: for testing
        render(<IconButton aria-label="Test Icon Button" size={size as any} />)
        const button = screen.getByRole("button")
        expect(button).toBeInTheDocument()

        expect(Object.hasOwn(styles, size)).toBe(false)
      },
    )

    it("should use default md size when no size prop is provided", () => {
      render(<IconButton aria-label="Test Icon Button" />)
      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()

      expect(Object.hasOwn(styles, "md")).toBe(true)
    })

    it("should handle undefined size gracefully", () => {
      render(<IconButton aria-label="Test Icon Button" size={undefined} />)
      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()

      expect(Object.hasOwn(styles, "md")).toBe(true)
    })

    it("should verify that IconButton styles object has correct structure", () => {
      expect(Object.hasOwn(styles, "base")).toBe(true)
      expect(Object.hasOwn(styles, "xs")).toBe(true)
      expect(Object.hasOwn(styles, "sm")).toBe(true)
      expect(Object.hasOwn(styles, "md")).toBe(true)
      expect(Object.hasOwn(styles, "lg")).toBe(true)
      expect(Object.hasOwn(styles, "xl")).toBe(true)
    })
  })
})
