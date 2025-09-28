import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { createWrapper } from "./MemberManagementContext.test"
import { TablePagination } from "./TablePagination"

describe("<TablePagination />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<TablePagination />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(TablePagination.displayName).toBe("TablePagination")
  })

  it("should render pagination controls", () => {
    render(<TablePagination />, {
      wrapper: createWrapper,
    })
    const select = screen.getByRole("combobox")
    expect(select).toBeInTheDocument()
    expect(screen.getByRole("navigation")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /page 1/i })).toBeInTheDocument()
  })

  it("should only display edge buttons when withEdges is true", () => {
    const { rerender } = render(<TablePagination />, {
      wrapper: createWrapper,
    })
    expect(screen.getByRole("button", { name: /go to first page/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /go to last page/i })).toBeInTheDocument()

    rerender(<TablePagination withEdges={false} />)
    expect(screen.queryByRole("button", { name: /go to first page/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /go to last page/i })).not.toBeInTheDocument()
  })
})
