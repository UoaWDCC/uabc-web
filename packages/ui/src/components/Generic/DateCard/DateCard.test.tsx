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

  it("should not render real date parts when no date is provided", () => {
    render(<DateCard label="Start" />)

    expect(screen.queryByText("15")).not.toBeInTheDocument()
    expect(screen.queryByText("Jan")).not.toBeInTheDocument()
    expect(screen.queryByText("2025")).not.toBeInTheDocument()
  })

  it("should render date parts when a date is provided", () => {
    render(<DateCard date={DATE} label="Start" />)

    expect(screen.getByText("15")).toBeInTheDocument()
    expect(screen.getByText("Jan")).toBeInTheDocument()
    expect(screen.getByText("2025")).toBeInTheDocument()
  })
})
