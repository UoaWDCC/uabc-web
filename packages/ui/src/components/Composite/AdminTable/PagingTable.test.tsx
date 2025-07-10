import { render, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { isValidElement } from "react"
import { MemberManagementProvider } from "./MemberManagementContext"
import { PagingTable } from "./PagingTable"

const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsAdapter>
    <MemberManagementProvider>{children}</MemberManagementProvider>
  </NuqsAdapter>
)

describe("<PagingTable />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<PagingTable />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(PagingTable.displayName).toBe("PagingTable")
  })

  it("should render table with pagination", () => {
    render(<PagingTable />, { wrapper: createWrapper })

    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.getByRole("navigation")).toBeInTheDocument()
  })
})
