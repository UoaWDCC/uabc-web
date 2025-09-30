import { casualUserMock } from "@repo/shared/mocks"
import type { User } from "@repo/shared/payload-types"
import { render, screen } from "@repo/ui/test-utils"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { isValidElement } from "react"
import { AdminTableWithPaginatedQuery } from "./AdminTableWithPaginatedQuery"

const onUrlUpdate = vi.fn()

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

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockMultiPageQuery} />, {
      wrapper: withNuqsTestingAdapter(),
    })

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

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockQueryWithPagination} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
    expect(screen.getByText("User3 Lastname3")).toBeInTheDocument()
    expect(screen.getByText("User18 Lastname18")).toBeInTheDocument()
  })

  it("should pass correct props to ManagementTable", () => {
    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockUseGetPaginatedData} />, {
      wrapper: withNuqsTestingAdapter(),
    })

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
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
  })

  it("should handle pagination without edges correctly", () => {
    render(
      <AdminTableWithPaginatedQuery
        paginationWithEdges={false}
        useGetPaginatedData={mockUseGetPaginatedData}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
  })

  it("should show correct pagination metadata", () => {
    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockUseGetPaginatedData} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByRole("table")).toBeInTheDocument()
  })

  it("should handle both pages when fetchNextPage is called", () => {
    const mockBothPagesQuery = createMockUseGetPaginatedData({
      data: mockPaginationBothPages,
      hasNextPage: false,
    })

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockBothPagesQuery} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
    expect(screen.getByText("User19 Lastname19")).toBeInTheDocument()

    expect(screen.queryByText("User20 Lastname20")).not.toBeInTheDocument()
  })

  it("should display all 31 users when both pages are loaded and component uses internal pagination", () => {
    const mockBothPagesQuery = createMockUseGetPaginatedData({
      data: mockPaginationBothPages,
      hasNextPage: false,
    })

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockBothPagesQuery} />, {
      wrapper: withNuqsTestingAdapter(),
    })

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

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockBothPagesQuery} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    const actionButtons = screen.getAllByRole("button", { name: "Actions" })
    expect(actionButtons).toHaveLength(20)

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
    expect(screen.getByText("User19 Lastname19")).toBeInTheDocument()

    expect(screen.queryByText("User20 Lastname20")).not.toBeInTheDocument()
    expect(screen.queryByText("User30 Lastname30")).not.toBeInTheDocument()

    expect(screen.getByText("Export 31 users")).toBeInTheDocument()
  })

  it("should display page 2 users (11 remaining) when currentPage is set to 2", () => {
    const mockBothPagesQuery = createMockUseGetPaginatedData({
      data: mockPaginationBothPages,
      hasNextPage: false,
    })

    render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockBothPagesQuery} />, {
      wrapper: withNuqsTestingAdapter({ searchParams: "?page=2" }),
    })

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
      {
        wrapper: withNuqsTestingAdapter({ onUrlUpdate }),
      },
    )

    const nextPageButton = screen.getByRole("button", { name: "Go to page 2" })
    await user.click(nextPageButton)

    expect(fetchNextPageMock).toHaveBeenCalled()
    expect(onUrlUpdate).toHaveBeenCalledOnce()
    const event = onUrlUpdate.mock.calls[0][0]
    expect(event.queryString).toBe("?page=2")
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
      {
        wrapper: withNuqsTestingAdapter(),
      },
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
      {
        wrapper: withNuqsTestingAdapter(),
      },
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
      {
        wrapper: withNuqsTestingAdapter(),
      },
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

  it("should handle querying", async () => {
    const mockQuery = createMockUseGetPaginatedData()

    const { user } = render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockQuery} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
    expect(screen.getByText("User19 Lastname19")).toBeInTheDocument()

    const searchBar = screen.getByRole("textbox")

    await user.type(searchBar, "User1")
    expect(searchBar).toHaveValue("User1")

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: "User1",
      }),
    )

    await user.clear(searchBar)
    await user.type(searchBar, "nonsense")
    expect(searchBar).toHaveValue("nonsense")

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: "nonsense",
      }),
    )
  })

  it("should handle filtering by fields", async () => {
    const mockQuery = createMockUseGetPaginatedData()

    const { user } = render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockQuery} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
    expect(screen.getByText("User19 Lastname19")).toBeInTheDocument()

    const roleDropdown = screen.getByRole("combobox", { name: "User Role" })
    await user.click(roleDropdown)
    const memberOption = screen.getByRole("option", { name: "member" })
    await user.click(memberOption)

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: JSON.stringify({ role: ["member"] }),
      }),
    )
    const levelDropdown = screen.getByRole("combobox", { name: "Play Level" })
    await user.click(levelDropdown)
    const beginnerOption = screen.getByRole("option", { name: "beginner" })
    await user.click(beginnerOption)

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: JSON.stringify({ role: ["member"], level: ["beginner"] }),
      }),
    )
  })

  it("should handle selecting rows", async () => {
    const mockQuery = createMockUseGetPaginatedData()

    const { user } = render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockQuery} />, {
      wrapper: withNuqsTestingAdapter({ onUrlUpdate: onUrlUpdate }),
    })

    expect(screen.getByText("User0 Lastname0")).toBeInTheDocument()
    expect(screen.getByText("User19 Lastname19")).toBeInTheDocument()

    const firstRowCheckbox = screen.getAllByRole("checkbox", { name: "Select row" })[0]
    await user.click(firstRowCheckbox)
    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "?selectedRows=0",
      }),
    )

    const secondRowCheckbox = screen.getAllByRole("checkbox", { name: "Select row" })[1]
    await user.click(secondRowCheckbox)
    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "?selectedRows=0,1",
      }),
    )
  })

  it("should handle changing visible columns", async () => {
    const mockQuery = createMockUseGetPaginatedData()

    const { user } = render(<AdminTableWithPaginatedQuery useGetPaginatedData={mockQuery} />, {
      wrapper: withNuqsTestingAdapter({ onUrlUpdate: onUrlUpdate }),
    })

    const toggleColumnsButton = screen.getByRole("button", { name: "Toggle column visibility" })
    await user.click(toggleColumnsButton)

    const emailCheckbox = screen.getByRole("checkbox", { name: "Email" })
    expect(emailCheckbox).toBeChecked()
    await user.click(emailCheckbox)
    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "?columns=name,remaining,joined,role,university,level,actions",
      }),
    )
  })
})
