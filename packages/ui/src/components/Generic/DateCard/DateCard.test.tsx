import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as DateCardModule from "."
import { DateCard } from "./DateCard"

const DATE = new Date(2025, 0, 15)

describe("<DateCard />", () => {
  it("should re-export DateCard component and check it exists", () => {
    expect(DateCardModule.DateCard).toBeDefined()
    expect(isValidElement(<DateCardModule.DateCard label="Start" />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(DateCard.displayName).toBe("DateCard")
  })

  it("should render the label", () => {
    render(<DateCard label="Start" />)

    expect(screen.getByText("Start")).toBeInTheDocument()
  })

  it("should show loading skeletons when no date is provided", () => {
    const { container } = render(<DateCard label="Start" />)

    container.querySelectorAll(".ui-skeleton").forEach((el) => {
      expect(el.getAttribute("aria-busy")).toBe("true")
    })
  })

  it("should render date parts and dismiss skeletons when a date is provided", () => {
    const { container } = render(<DateCard date={DATE} label="Start" />)

    expect(screen.getByText("15")).toBeInTheDocument()
    expect(screen.getByText("Jan")).toBeInTheDocument()
    expect(screen.getByText("2025")).toBeInTheDocument()

    container.querySelectorAll(".ui-skeleton").forEach((el) => {
      expect(el.getAttribute("aria-busy")).toBe("false")
    })
  })
})
