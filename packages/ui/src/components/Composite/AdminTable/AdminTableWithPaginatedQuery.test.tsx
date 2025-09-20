import { casualUserMock } from "@repo/shared/mocks"
import type { User } from "@repo/shared/payload-types"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { AdminTableWithPaginatedQuery } from "./AdminTableWithPaginatedQuery"

let currentPage = 1
const mockSetState = vi.fn((updates) => {
  if (updates.page !== undefined) {
    currentPage = updates.page
  }
})

vi.mock("nuqs", () => ({
  parseAsInteger: {
    withDefault: (defaultValue: number) => ({ defaultValue }),
  },
  parseAsString: {
    withDefault: (defaultValue: string) => ({ defaultValue }),
  },
  parseAsArrayOf: (_parser: unknown) => ({
    withDefault: (defaultValue: unknown[]) => ({ defaultValue }),
  }),
  useQueryStates: () => [{ page: currentPage, perPage: 20 }, mockSetState],
}))

const createMockUser = (index: number): User => ({
  ...casualUserMock,
  id: index.toString(),
  firstName: `User${index}`,
  lastName: `Lastname${index}`,
  email: `user${index}@example.com`,
})

const allMockUsers: User[] = Array.from({ length: 31 }, (_, i) => createMockUser(i))

const firstPageUsers = allMockUsers.slice(0, 20)
const secondPageUsers = allMockUsers.slice(20, undefined)

const mockPaginationPage1 = {
  pages: [
    {
      data: {
        docs: firstPageUsers,
        totalDocs: 31,
        limit: 20,
        page: 1,
        totalPages: 2,
        hasNextPage: true,
        hasPrevPage: false,
      },
    },
  ],
  pageParams: [1],
}

const mockPaginationBothPages = {
  pages: [
    ...mockPaginationPage1.pages,
    {
      data: {
        docs: secondPageUsers,
        totalDocs: 31,
        limit: 20,
        page: 2,
        totalPages: 2,
        hasNextPage: false,
        hasPrevPage: true,
      },
    },
  ],
  pageParams: [1, 2],
}

const createMockUseGetPaginatedData = (overrides = {}) => {
  return vi.fn().mockReturnValue({
    data: mockPaginationPage1,
    fetchNextPage: vi.fn().mockResolvedValue({}),
    hasNextPage: true,
    isFetchingNextPage: false,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  })
}

describe("<AdminTableWithPaginatedQuery />", () => {
  let mockUseGetPaginatedData: ReturnType<typeof createMockUseGetPaginatedData>

  beforeEach(() => {
    mockUseGetPaginatedData = createMockUseGetPaginatedData()
    currentPage = 1
    vi.clearAllMocks()
  })

  it("should be a valid React element", () => {
    expect(
      isValidElement(
        <AdminTableWithPaginatedQuery useGetPaginatedData={mockUseGetPaginatedData} />,
      ),
    ).toBeTruthy()
  })

  it("should display pagination controls when there are multiple pages", () => {
    const mockMultiPageQuery = createMockUseGetPaginatedData({
      data: mockPaginationPage1,
      hasNextPage: true,
    })

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockMultiPageQuery} />)

    const comboboxes = screen.getAllByRole("combobox")
    expect(comboboxes.length).toBeGreaterThan(2)
  })

  it("should handle page changes correctly", async () => {
    const fetchNextPageMock = vi.fn().mockResolvedValue({})
    const mockQueryWithPagination = createMockUseGetPaginatedData({
      fetchNextPage: fetchNextPageMock,
      hasNextPage: true,
      data: mockPaginationPage1,
    })

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockQueryWithPagination} />)

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
    expect(screen.getByText("User3 Lastname3")).toBeInTheDocument()
    expect(screen.getByText("User18 Lastname18")).toBeInTheDocument()
  })

  it("should pass correct props to ManagementTable", () => {
    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockUseGetPaginatedData} />)

    expect(screen.getByRole("table")).toBeInTheDocument()

    const actionButtons = screen.getAllByRole("button", { name: "Actions" })
    expect(actionButtons).toHaveLength(20)
  })

  it("should handle pagination with edges correctly", () => {
    render(
      <AdminTableWithPaginatedQuery
        paginationWithEdges={true}
        useGetPaginatedData={mockUseGetPaginatedData}
      />,
    )

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
  })

  it("should handle pagination without edges correctly", () => {
    render(
      <AdminTableWithPaginatedQuery
        paginationWithEdges={false}
        useGetPaginatedData={mockUseGetPaginatedData}
      />,
    )

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
  })

  it("should show correct pagination metadata", () => {
    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockUseGetPaginatedData} />)

    expect(screen.getByRole("table")).toBeInTheDocument()
  })

  it("should handle both pages when fetchNextPage is called", () => {
    const mockBothPagesQuery = createMockUseGetPaginatedData({
      data: mockPaginationBothPages,
      hasNextPage: false,
    })

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockBothPagesQuery} />)

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
    expect(screen.getByText("User19 Lastname19")).toBeInTheDocument()

    expect(screen.queryByText("User20 Lastname20")).not.toBeInTheDocument()
  })

  it("should display all 31 users when both pages are loaded and component uses internal pagination", () => {
    const mockBothPagesQuery = createMockUseGetPaginatedData({
      data: mockPaginationBothPages,
      hasNextPage: false,
    })

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockBothPagesQuery} />)

    const actionButtons = screen.getAllByRole("button", { name: "Actions" })
    expect(actionButtons).toHaveLength(20)

    expect(screen.getByRole("table")).toBeInTheDocument()

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
    expect(screen.getByText("User19 Lastname19")).toBeInTheDocument()
  })

  it("should display correct users when both pages are loaded (31 total: 20 + 11)", () => {
    const mockBothPagesQuery = createMockUseGetPaginatedData({
      data: mockPaginationBothPages,
      hasNextPage: false,
    })

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockBothPagesQuery} />)

    const actionButtons = screen.getAllByRole("button", { name: "Actions" })
    expect(actionButtons).toHaveLength(20)

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
    expect(screen.getByText("User19 Lastname19")).toBeInTheDocument()

    expect(screen.queryByText("User20 Lastname20")).not.toBeInTheDocument()
    expect(screen.queryByText("User30 Lastname30")).not.toBeInTheDocument()

    expect(screen.getByText("Export 31 users")).toBeInTheDocument()
  })

  it("should display page 2 users (11 remaining) when currentPage is set to 2", () => {
    currentPage = 2

    const mockBothPagesQuery = createMockUseGetPaginatedData({
      data: mockPaginationBothPages,
      hasNextPage: false,
    })

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockBothPagesQuery} />)

    const actionButtons = screen.getAllByRole("button", { name: "Actions" })

    expect(screen.getByText("User20 Lastname20")).toBeInTheDocument()
    expect(screen.getByText("User30 Lastname30")).toBeInTheDocument()

    expect(screen.queryByText("User0 Lastname0")).not.toBeInTheDocument()
    expect(screen.queryByText("User19 Lastname19")).not.toBeInTheDocument()

    expect(screen.getByText("Export 31 users")).toBeInTheDocument()

    expect(actionButtons).toHaveLength(11)
  })

  it("should change to page 2 when the relevant button is clicked", async () => {
    const fetchNextPageMock = vi.fn().mockResolvedValue({})
    const mockQueryWithPagination = createMockUseGetPaginatedData({
      fetchNextPage: fetchNextPageMock,
      hasNextPage: true,
      data: mockPaginationPage1,
    })

    const { user } = render(
      <AdminTableWithPaginatedQuery useGetPaginatedData={mockQueryWithPagination} />,
    )

    const nextPageButton = screen.getByRole("button", { name: "Go to page 2" })
    await user.click(nextPageButton)

    expect(mockSetState).toHaveBeenCalledWith({ page: 2 })
    expect(fetchNextPageMock).toHaveBeenCalled()
  })

  it("should handle delete action correctly", async () => {
    const mockOnDelete = vi.fn()
    const mockQueryWithDelete = createMockUseGetPaginatedData({
      data: mockPaginationPage1,
    })

    const { user } = render(
      <AdminTableWithPaginatedQuery
        onDelete={mockOnDelete}
        useGetPaginatedData={mockQueryWithDelete}
      />,
    )

    const actionButtons = screen.getAllByRole("button", { name: "Actions" })
    expect(actionButtons).toHaveLength(20)

    await user.click(actionButtons[0])

    const deleteButton = screen.getByText("Delete")
    await user.click(deleteButton)

    expect(screen.getByText("Are you sure?")).toBeInTheDocument()

    const confirmDeleteButton = screen.getByRole("button", { name: "Delete" })
    await user.click(confirmDeleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith("0")
  })

  it("should handle edit action correctly", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    const mockQueryWithEdit = createMockUseGetPaginatedData({
      data: mockPaginationPage1,
    })

    const { user } = render(
      <AdminTableWithPaginatedQuery useGetPaginatedData={mockQueryWithEdit} />,
    )

    const actionButtons = screen.getAllByRole("button", { name: "Actions" })
    await user.click(actionButtons[0])

    const editButton = screen.getByText("Edit")
    await user.click(editButton)

    expect(consoleSpy).toHaveBeenCalledWith(
      "Edit",
      expect.objectContaining({
        id: "0",
        name: "User0 Lastname0",
        email: "user0@example.com",
      }),
    )

    consoleSpy.mockRestore()
  })

  it("should handle delete dialog cancellation", async () => {
    const mockOnDelete = vi.fn()
    const mockQueryWithDelete = createMockUseGetPaginatedData({
      data: mockPaginationPage1,
    })

    const { user } = render(
      <AdminTableWithPaginatedQuery
        onDelete={mockOnDelete}
        useGetPaginatedData={mockQueryWithDelete}
      />,
    )

    const actionButtons = screen.getAllByRole("button", { name: "Actions" })
    await user.click(actionButtons[0])

    const deleteButton = screen.getByText("Delete")
    await user.click(deleteButton)

    expect(screen.getByText("Are you sure?")).toBeInTheDocument()

    const cancelButton = screen.getByRole("button", { name: "Cancel" })
    await user.click(cancelButton)

    expect(mockOnDelete).not.toHaveBeenCalled()
  })
})
