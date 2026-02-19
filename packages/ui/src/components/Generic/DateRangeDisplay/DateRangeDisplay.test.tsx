import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as DateRangeDisplayModule from "."
import { DateRangeDisplay } from "./DateRangeDisplay"

const START_DATE = new Date(2025, 0, 15)
const END_DATE = new Date(2025, 3, 30)

describe("<DateRangeDisplay />", () => {
  it("should re-export DateRangeDisplay component and check it exists", () => {
    expect(DateRangeDisplayModule.DateRangeDisplay).toBeDefined()
    expect(isValidElement(<DateRangeDisplayModule.DateRangeDisplay />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(DateRangeDisplay.displayName).toBe("DateRangeDisplay")
  })

  it("should render Start and End labels", () => {
    render(<DateRangeDisplay />)

    expect(screen.getByText("Start")).toBeInTheDocument()
    expect(screen.getByText("End")).toBeInTheDocument()
  })

  it("should render placeholder dashes when no dates are provided", () => {
    render(<DateRangeDisplay />)

    expect(screen.getAllByText("—")).toHaveLength(2)
    expect(screen.getAllByText("———")).toHaveLength(2)
    expect(screen.getAllByText("————")).toHaveLength(2)
  })

  it("should render start date parts when only startDate is provided", () => {
    render(<DateRangeDisplay startDate={START_DATE} />)

    expect(screen.getByText("15")).toBeInTheDocument()
    expect(screen.getByText("Jan")).toBeInTheDocument()
    expect(screen.getByText("2025")).toBeInTheDocument()
  })

  it("should render both date parts when startDate and endDate are provided", () => {
    render(<DateRangeDisplay endDate={END_DATE} startDate={START_DATE} />)

    expect(screen.getByText("15")).toBeInTheDocument()
    expect(screen.getByText("Jan")).toBeInTheDocument()
    expect(screen.getByText("30")).toBeInTheDocument()
    expect(screen.getByText("Apr")).toBeInTheDocument()
    expect(screen.getAllByText("2025")).toHaveLength(2)
  })
})
