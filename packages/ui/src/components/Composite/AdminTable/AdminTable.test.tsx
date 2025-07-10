import { render, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { isValidElement } from "react"
import { AdminTable } from "./AdminTable"
import { MemberManagementProvider } from "./MemberManagementContext"

const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsAdapter>
    <MemberManagementProvider>{children}</MemberManagementProvider>
  </NuqsAdapter>
)

describe("<AdminTable />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<AdminTable />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(AdminTable.displayName).toBe("AdminTable")
  })

  it("should render table with pagination", () => {
    render(<AdminTable />, { wrapper: createWrapper })

    expect(screen.getByRole("table")).toBeInTheDocument()
  })

  it("should provide MemberManagementProvider context", () => {
    render(<AdminTable />, { wrapper: createWrapper })

    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByRole("navigation")).toBeInTheDocument()

    expect(screen.getByRole("button", { name: /page 1/i })).toBeInTheDocument()
  })
})
