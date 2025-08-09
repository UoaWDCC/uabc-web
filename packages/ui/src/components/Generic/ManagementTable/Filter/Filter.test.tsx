import { MembershipType } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { vi } from "vitest"
import type { ColumnConfig } from "../types"
import { Filter } from "./Filter"
import type { FilterBarConfig } from "./types"

vi.mock("./FilterInput", () => ({
  FilterInput: () => <div data-testid="filter-input" />,
}))
vi.mock("./FilterSelect", () => ({
  FilterSelect: () => <div data-testid="filter-select" />,
}))
vi.mock("./FilterMultiSelect", () => ({
  FilterMultiSelect: () => <div data-testid="filter-multiselect" />,
}))
vi.mock("./FilterColumnVisibility", () => ({
  FilterColumnVisibility: () => <div data-testid="filter-column-visibility" />,
}))
vi.mock("./FilterActions", () => ({
  FilterActions: () => <div data-testid="filter-actions" />,
}))

describe("<Filter />", () => {
  it("renders text, select, and multiselect filters", () => {
    const filterConfigs = [
      { type: "text", key: ["name"], label: "Name" },
      {
        type: "select",
        key: "status",
        label: "Status",
        items: [{ label: "Active", value: "active" as const }],
      },
      {
        type: "multiselect",
        key: "role",
        label: "Role",
        items: [
          {
            label: MembershipType.ADMIN,
            value: MembershipType.ADMIN as const,
          },
        ],
      },
    ] as FilterBarConfig<{ name: string; status: string; role: string }>[]
    const columnsConfig = [] as ColumnConfig<{ name: string; status: string; role: string }>[]
    render(<Filter columnsConfig={columnsConfig} filterConfigs={filterConfigs} />)
    expect(screen.getByTestId("filter-input")).toBeInTheDocument()
    expect(screen.getByTestId("filter-select")).toBeInTheDocument()
    expect(screen.getByTestId("filter-multiselect")).toBeInTheDocument()
    expect(screen.getByTestId("filter-column-visibility")).toBeInTheDocument()
    expect(screen.getByTestId("filter-actions")).toBeInTheDocument()
  })

  it("renders with empty filterConfigs", () => {
    render(<Filter columnsConfig={[]} filterConfigs={[]} />)
    expect(screen.getByTestId("filter-column-visibility")).toBeInTheDocument()
    expect(screen.getByTestId("filter-actions")).toBeInTheDocument()
  })
})
