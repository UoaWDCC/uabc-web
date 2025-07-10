import { render, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { isValidElement } from "react"
import { MemberManagementProvider } from "./MemberManagementContext"
import { TablePagination } from "./TablePagination"

const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsAdapter>
    <MemberManagementProvider>{children}</MemberManagementProvider>
  </NuqsAdapter>
)

describe("<TablePagination />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<TablePagination />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(TablePagination.displayName).toBe("TablePagination")
  })

  it("should render pagination controls", () => {
    render(<TablePagination />, { wrapper: createWrapper })

    const select = screen.getByRole("combobox")
    expect(select).toBeInTheDocument()

    expect(screen.getByRole("navigation")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /page 1/i })).toBeInTheDocument()
  })

  it("should handle page change", async () => {
    const { user } = render(<TablePagination />, { wrapper: createWrapper })

    const page1Button = screen.getByRole("button", { name: /page 1/i })
    expect(page1Button).toBeInTheDocument()

    const page2Button = screen.queryByRole("button", { name: /page 2/i })
    if (page2Button) {
      await user.click(page2Button)
      expect(page2Button).toBeInTheDocument()
    }
  })

  it("should handle per page change", async () => {
    const { user } = render(<TablePagination />, { wrapper: createWrapper })

    const select = screen.getByRole("combobox")
    expect(select).toBeInTheDocument()

    await user.click(select)
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getAllByText("20")).toHaveLength(2)
    expect(screen.getByText("50")).toBeInTheDocument()
    expect(screen.getByText("100")).toBeInTheDocument()
  })
})
