import { adminUserMock, casualUserMock, memberUserMock } from "@repo/shared/mocks"
import type { User } from "@repo/shared/payload-types"
import { render, screen } from "@repo/ui/test-utils"
import {
  ACTIONS_COLUMN,
  EMAIL_COLUMN,
  NAME_COLUMN,
  REMAINING_SESSIONS_COLUMN,
  ROLE_COLUMN,
  UNIVERSITY_COLUMN,
} from "./Columns"

const mockUserWithoutLastName: User = {
  ...casualUserMock,
  lastName: null,
}

const mockUserWithNullValues: User = {
  ...adminUserMock,
  remainingSessions: null,
  university: null,
}

const createMockRow = (user: User) => ({
  original: user,
  getValue: vi.fn(),
})

// biome-ignore lint/suspicious/noExplicitAny: this is for a test
const createMockCell = (user: User, value?: any) => ({
  row: createMockRow(user),
  getValue: vi.fn(() => value),
})

describe("AdminTable Columns", () => {
  describe("NAME_COLUMN", () => {
    it("should have correct column configuration", () => {
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      expect((NAME_COLUMN as any).accessorKey).toBe("firstName")
      expect(NAME_COLUMN.header).toBe("Name")
    })

    it("should render full name when both first and last name exist", () => {
      const mockCell = createMockCell(memberUserMock)
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = NAME_COLUMN.cell as any

      render(<CellComponent {...mockCell} />)

      expect(screen.getByText("straight zhao")).toBeInTheDocument()
    })

    it("should render only first name when last name is null", () => {
      const mockCell = createMockCell(mockUserWithoutLastName)
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = NAME_COLUMN.cell as any

      render(<CellComponent {...mockCell} />)

      expect(screen.getByText("straight")).toBeInTheDocument()
    })

    it("should render NameCell component correctly", () => {
      const mockCell = createMockCell(memberUserMock)
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = NAME_COLUMN.cell as any

      const { container } = render(<CellComponent {...mockCell} />)
      const spanElement = container.querySelector("span")

      expect(spanElement).toBeInTheDocument()
      expect(spanElement).toHaveTextContent("straight zhao")
    })
  })

  describe("EMAIL_COLUMN", () => {
    it("should have correct column configuration", () => {
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      expect((EMAIL_COLUMN as any).accessorKey).toBe("email")
      expect(EMAIL_COLUMN.header).toBe("Email")
    })

    it("should render email address correctly", () => {
      const mockCell = createMockCell(memberUserMock, memberUserMock.email)
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = EMAIL_COLUMN.cell as any

      render(<CellComponent {...mockCell} />)

      expect(screen.getByText(memberUserMock.email)).toBeInTheDocument()
    })

    it("should render EmailCell component with proper styling", () => {
      const mockCell = createMockCell(memberUserMock, "test@example.com")
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = EMAIL_COLUMN.cell as any

      const { container } = render(<CellComponent {...mockCell} />)
      const spanElement = container.querySelector("span")

      expect(spanElement).toBeInTheDocument()
      expect(spanElement).toHaveTextContent("test@example.com")
    })
  })

  describe("ROLE_COLUMN", () => {
    it("should have correct column configuration", () => {
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      expect((ROLE_COLUMN as any).accessorKey).toBe("role")
      expect(ROLE_COLUMN.header).toBe("Role")
    })

    it("should render member role with correct color scheme", () => {
      const mockCell = createMockCell(memberUserMock, "member")
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = ROLE_COLUMN.cell as any

      render(<CellComponent {...mockCell} />)

      expect(screen.getByText("Member")).toBeInTheDocument()
    })

    it("should render admin role with correct color scheme", () => {
      const mockCell = createMockCell(memberUserMock, "admin")
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = ROLE_COLUMN.cell as any

      render(<CellComponent {...mockCell} />)

      expect(screen.getByText("Admin")).toBeInTheDocument()
    })

    it("should render casual role with correct color scheme", () => {
      const mockCell = createMockCell(memberUserMock, "casual")
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = ROLE_COLUMN.cell as any

      render(<CellComponent {...mockCell} />)

      expect(screen.getByText("Casual")).toBeInTheDocument()
    })

    test.each(["member", "admin", "casual"])("should capitalize role text correctly", (role) => {
      const mockCell = createMockCell(memberUserMock, role)
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = ROLE_COLUMN.cell as any

      const { unmount } = render(<CellComponent {...mockCell} />)

      expect(screen.getByText(role.charAt(0).toUpperCase() + role.slice(1))).toBeInTheDocument()

      unmount()
    })
  })

  describe("REMAINING_SESSIONS_COLUMN", () => {
    it("should have correct column configuration", () => {
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      expect((REMAINING_SESSIONS_COLUMN as any).accessorKey).toBe("remainingSessions")
      expect(REMAINING_SESSIONS_COLUMN.header).toBe("Remaining")
    })

    it("should render remaining sessions number", () => {
      const mockCell = createMockCell(memberUserMock, 5)
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = REMAINING_SESSIONS_COLUMN.cell as any

      render(<CellComponent {...mockCell} />)

      expect(screen.getByText("5")).toBeInTheDocument()
    })

    it("should render N/A when sessions is null", () => {
      const mockCell = createMockCell(mockUserWithNullValues, null)
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = REMAINING_SESSIONS_COLUMN.cell as any

      render(<CellComponent {...mockCell} />)

      expect(screen.getByText("N/A")).toBeInTheDocument()
    })
  })

  describe("UNIVERSITY_COLUMN", () => {
    it("should have correct column configuration", () => {
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      expect((UNIVERSITY_COLUMN as any).accessorKey).toBe("university")
      expect(UNIVERSITY_COLUMN.header).toBe("University")
    })

    it("should render N/A when university is null", () => {
      const mockCell = createMockCell(mockUserWithNullValues, null)
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = UNIVERSITY_COLUMN.cell as any

      render(<CellComponent {...mockCell} />)

      expect(screen.getByText("N/A")).toBeInTheDocument()
    })

    it("should render other university values correctly", () => {
      const universities = ["UoA", "Massey University", "AUT", "Other", "Working"]

      universities.forEach((university) => {
        const mockCell = createMockCell(memberUserMock, university)
        // biome-ignore lint/suspicious/noExplicitAny: this is for a test
        const CellComponent = UNIVERSITY_COLUMN.cell as any

        const { unmount } = render(<CellComponent {...mockCell} />)

        expect(screen.getByText(university)).toBeInTheDocument()

        unmount()
      })
    })
  })

  describe("ACTIONS_COLUMN", () => {
    it("should have correct column configuration", () => {
      expect(ACTIONS_COLUMN.id).toBe("actions")
      expect(ACTIONS_COLUMN.header).toBe("")
    })

    it("should render actions button", () => {
      const mockCell = createMockCell(memberUserMock)
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = ACTIONS_COLUMN.cell as any

      render(<CellComponent {...mockCell} />)

      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()
    })

    it("should render edit button with proper icon", () => {
      const mockCell = createMockCell(memberUserMock)
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const CellComponent = ACTIONS_COLUMN.cell as any

      const { container } = render(<CellComponent {...mockCell} />)

      // Check if the button contains an SVG (the icon)
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })
  })
})
