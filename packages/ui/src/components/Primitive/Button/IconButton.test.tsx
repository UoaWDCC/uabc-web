import { render } from "@repo/ui/test-utils"
import { screen } from "@testing-library/react"
import { isValidElement } from "react"
import { vi } from "vitest"
import * as ButtonModule from "./index"

vi.mock("@yamada-ui/react", async () => {
  const actual = await vi.importActual<typeof import("@yamada-ui/react")>("@yamada-ui/react")
  return {
    ...actual,
    Loading: ({ variant, color }: { variant?: string; color?: string }) => (
      <div data-color={color ?? ""} data-testid="loading" data-variant={variant ?? ""} />
    ),
  }
})

describe("<IconButton />", () => {
  it("should re-export the IconButton component and check if IconButton exists", () => {
    expect(ButtonModule.IconButton).toBeDefined()
    expect(isValidElement(<ButtonModule.IconButton />)).toBe(true)
  })

  it("should forward ref correctly", () => {
    const ref = { current: null }
    render(<ButtonModule.IconButton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("renders provided ReactNode when loadingIcon is a node", () => {
    render(
      <ButtonModule.IconButton loading loadingIcon={<span data-testid="custom-loading">X</span>} />,
    )
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    expect(screen.getByTestId("custom-loading")).toBeInTheDocument()
  })

  it("renders icon when not loading", () => {
    render(<ButtonModule.IconButton icon={<span data-testid="icon" />} />)
    expect(screen.getByTestId("icon")).toBeInTheDocument()
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
  })

  it("renders Loading with valid string variant when loading", () => {
    render(<ButtonModule.IconButton loading loadingIcon="dots" />)
    const el = screen.getByTestId("loading")
    expect(el).toBeInTheDocument()
  })

  it("renders default Loading when loadingIcon string is invalid", () => {
    render(<ButtonModule.IconButton loading loadingIcon="invalid" />)
    const el = screen.getByTestId("loading")
    expect(el).toBeInTheDocument()
  })

  it("renders default Loading when loading and loadingIcon not provided", () => {
    render(<ButtonModule.IconButton loading />)
    const el = screen.getByTestId("loading")
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute("data-color", "current")
  })

  it("renders children when provided and not loading", () => {
    render(<ButtonModule.IconButton>child</ButtonModule.IconButton>)
    expect(screen.getByText("child")).toBeInTheDocument()
  })

  it("sets data-active attribute when active is true", () => {
    render(<ButtonModule.IconButton active />)
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("data-active")
  })

  it("does not set data-active when active is false", () => {
    render(<ButtonModule.IconButton />)
    const button = screen.getByRole("button")
    expect(button).not.toHaveAttribute("data-active")
  })
})
