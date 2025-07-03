import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as LoadingStateBarModule from "./index"
import { LoadingStateBar } from "./LoadingStateBar"

describe("<LoadingStateBar />", () => {
  it("should re-export the LoadingStateBar component and check if LoadingStateBar exists", () => {
    expect(LoadingStateBarModule.LoadingStateBar).toBeDefined()

    expect(isValidElement(<LoadingStateBarModule.LoadingStateBar />)).toBeTruthy()
  })

  it("renders with default props", () => {
    render(<LoadingStateBar />)
    const progressBar = screen.getByRole("meter")
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute("aria-disabled", "false")
  })

  it("renders with value prop", () => {
    render(<LoadingStateBar value={75} />)
    const progressBar = screen.getByRole("meter")
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute("aria-valuenow", "75")
  })

  it("handles disabled state", () => {
    render(<LoadingStateBar disabled={true} />)
    const progressBar = screen.getByRole("meter")
    expect(progressBar).toHaveAttribute("aria-disabled", "true")
  })

  it("forwards ref correctly", () => {
    const ref = { current: null }
    render(<LoadingStateBar ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("passes through Progress props correctly", () => {
    render(<LoadingStateBar colorScheme="primary" max={200} min={10} size="lg" value={100} />)
    const progressBar = screen.getByRole("meter")
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute("aria-valuenow", "100")
    expect(progressBar).toHaveAttribute("aria-valuemax", "200")
    expect(progressBar).toHaveAttribute("aria-valuemin", "10")
  })

  it("renders correctly when disabled with value", () => {
    render(<LoadingStateBar disabled value={30} />)
    const progressBar = screen.getByRole("meter")
    expect(progressBar).toHaveAttribute("aria-disabled", "true")
    expect(progressBar).toHaveAttribute("aria-valuenow", "30")
  })

  it("handles zero value correctly", () => {
    render(<LoadingStateBar value={0} />)
    const progressBar = screen.getByRole("meter")
    expect(progressBar).toHaveAttribute("aria-valuenow", "0")
  })

  it("handles maximum value correctly", () => {
    render(<LoadingStateBar value={100} />)
    const progressBar = screen.getByRole("meter")
    expect(progressBar).toHaveAttribute("aria-valuenow", "100")
  })
})
