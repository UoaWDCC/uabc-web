import type { User } from "@repo/shared/payload-types"
import { adminUserMock, casualUserMock, memberUserMock } from "@repo/shared/test-config/mocks"
import { render, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { MemberManagementProvider } from "./MemberManagementContext"
import { MemberManagementTable } from "./Table"

const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsAdapter>
    <MemberManagementProvider>{children}</MemberManagementProvider>
  </NuqsAdapter>
)

const mockContextValue = {
  members: [] as User[],
  filteredMembers: [] as User[],
  paginatedMembers: [] as User[],
  isLoading: false,
  filterValue: "",
  setFilterValue: vi.fn(),
  hasFilter: false,
  clearFilter: vi.fn(),
  currentPage: 1,
  setCurrentPage: vi.fn(),
  perPage: 20,
  setPerPage: vi.fn(),
  totalPages: 1,
}

const mockUsers: User[] = [memberUserMock, adminUserMock]

vi.mock("./MemberManagementContext", async () => {
  const actual = await vi.importActual("./MemberManagementContext")
  return {
    ...actual,
    useMemberManagement: () => mockContextValue,
  }
})

describe("MemberManagementTable", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(mockContextValue, {
      members: [],
      filteredMembers: [],
      paginatedMembers: [],
      isLoading: false,
      filterValue: "",
      hasFilter: false,
      currentPage: 1,
      perPage: 20,
      totalPages: 1,
    })
  })

  describe("Component Structure", () => {
    it("should have correct displayName", () => {
      expect(MemberManagementTable.displayName).toBe("MemberManagementTable")
    })

    it("should render table with data", () => {
      mockContextValue.paginatedMembers = mockUsers
      mockContextValue.isLoading = false

      render(<MemberManagementTable />, { wrapper: createWrapper })

      expect(screen.getByText("Name")).toBeInTheDocument()
      expect(screen.getByText("Email")).toBeInTheDocument()
      expect(screen.getByText("Role")).toBeInTheDocument()
      expect(screen.getByText("Remaining Sessions")).toBeInTheDocument()
      expect(screen.getByText("University")).toBeInTheDocument()

      expect(
        screen.getAllByText(`${memberUserMock.firstName} ${memberUserMock.lastName}`),
      ).toHaveLength(2)
      expect(screen.getAllByText(memberUserMock.email)).toHaveLength(1)
      expect(screen.getAllByText("Member")).toHaveLength(1)
      expect(screen.getAllByText(memberUserMock.remainingSessions)).toHaveLength(1)
    })
  })

  describe("Loading State", () => {
    it("should not render main table when loading", () => {
      mockContextValue.isLoading = true
      mockContextValue.paginatedMembers = mockUsers

      render(<MemberManagementTable />, { wrapper: createWrapper })

      expect(screen.queryByText(memberUserMock.firstName)).not.toBeInTheDocument()
      expect(screen.queryByText(memberUserMock.email)).not.toBeInTheDocument()
    })
  })

  describe("Empty State", () => {
    it("should render empty state when no members", () => {
      mockContextValue.paginatedMembers = []
      mockContextValue.isLoading = false

      render(<MemberManagementTable />, { wrapper: createWrapper })

      expect(screen.getByText("No members found")).toBeInTheDocument()
    })

    it("should render table structure even when empty", () => {
      mockContextValue.paginatedMembers = []
      mockContextValue.isLoading = false

      render(<MemberManagementTable />, { wrapper: createWrapper })

      expect(screen.getByText("Name")).toBeInTheDocument()
      expect(screen.getByText("Email")).toBeInTheDocument()
      expect(screen.getByText("Role")).toBeInTheDocument()
    })

    it("should handle empty state styling correctly", () => {
      mockContextValue.paginatedMembers = []
      mockContextValue.isLoading = false

      render(<MemberManagementTable />, { wrapper: createWrapper })

      const emptyCell = screen.getByText("No members found").closest("td")
      expect(emptyCell).toHaveAttribute("colspan", "6")
    })
  })

  describe("Data Rendering", () => {
    it("should render user information correctly", () => {
      mockContextValue.paginatedMembers = [memberUserMock]

      render(<MemberManagementTable />, { wrapper: createWrapper })

      expect(
        screen.getByText(`${memberUserMock.firstName} ${memberUserMock.lastName}`),
      ).toBeInTheDocument()
      expect(screen.getByText(memberUserMock.email)).toBeInTheDocument()
      expect(screen.getByText("Member")).toBeInTheDocument()
      expect(screen.getByText(memberUserMock.remainingSessions)).toBeInTheDocument()
    })

    it("should render multiple users correctly", () => {
      mockContextValue.paginatedMembers = mockUsers

      render(<MemberManagementTable />, { wrapper: createWrapper })

      expect(
        screen.getAllByText(`${memberUserMock.firstName} ${memberUserMock.lastName}`),
      ).toHaveLength(2)
      expect(screen.getAllByText(memberUserMock.email)).toHaveLength(1)
      expect(screen.getAllByText(adminUserMock.email)).toHaveLength(1)
    })
  })

  describe("User Data Variations", () => {
    it("should handle different user roles", () => {
      mockContextValue.paginatedMembers = [adminUserMock, casualUserMock, memberUserMock]

      render(<MemberManagementTable />, { wrapper: createWrapper })

      expect(screen.getByText("Member")).toBeInTheDocument()
      expect(screen.getByText("Admin")).toBeInTheDocument()
      expect(screen.getByText("Casual")).toBeInTheDocument()
    })

    it("should handle different universities", () => {
      const users: User[] = [
        { ...memberUserMock, university: "UoA" },
        { ...memberUserMock, id: "2", university: "AUT" },
        { ...memberUserMock, id: "3", university: "Massey University" },
        { ...memberUserMock, id: "4", university: null },
      ]

      mockContextValue.paginatedMembers = users

      render(<MemberManagementTable />, { wrapper: createWrapper })

      expect(screen.getByText("UoA")).toBeInTheDocument()
      expect(screen.getByText("AUT")).toBeInTheDocument()
      expect(screen.getByText("Massey University")).toBeInTheDocument()
      expect(screen.getByText("N/A")).toBeInTheDocument()
    })
  })

  describe("Table Configuration", () => {
    test.each(["Name", "Email", "Role", "Remaining Sessions", "University"])(
      "should use correct column configuration",
      (header) => {
        mockContextValue.paginatedMembers = mockUsers

        render(<MemberManagementTable />, { wrapper: createWrapper })

        expect(screen.getByText(header)).toBeInTheDocument()
      },
    )
  })

  describe("Context Integration", () => {
    it("should use paginatedMembers from context", () => {
      const customUsers = [memberUserMock]
      mockContextValue.paginatedMembers = customUsers

      render(<MemberManagementTable />, { wrapper: createWrapper })

      expect(
        screen.getByText(`${memberUserMock.firstName} ${memberUserMock.lastName}`),
      ).toBeInTheDocument()
    })
  })
})
