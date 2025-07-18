import { basicEditorState, complexEditorState } from "@repo/ui/test-config/mocks/RichText.mock"
import { getTos } from "@/services/cms/tos/TosService"
import { render, screen } from "@/test-config/test-utils"
import TermsOfServiceContent from "./page"

vi.mock("@/services/cms/tos/TosService", () => ({
  getTos: vi.fn(),
}))

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    use: vi.fn(),
  }
})

const mockedGetTos = vi.mocked(getTos)

describe("<TermsOfServiceContent />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should display loading state initially", () => {
    expect(TermsOfServiceContent).toBeDefined()
  })

  it("should display error state if no data", async () => {
    mockedGetTos.mockResolvedValue({ data: undefined })

    render(<TermsOfServiceContent />)

    expect(
      screen.getByText("Failed to load Terms of Service. Please contact the administrator."),
    ).toBeInTheDocument()
    expect(screen.getByText("Terms of Service")).toBeInTheDocument()
  })

  it("should render all sections with correct content", async () => {
    mockedGetTos.mockResolvedValue({
      data: {
        data: {
          title: "Terms of Service Title",
          subtitle: "Subtitle for TOS",
          checkInRules: {
            title: "Check-In Rules",
            rules: basicEditorState,
          },
          sessionRules: {
            title: "Session Rules",
            rules: complexEditorState,
          },
          disclaimer: {
            title: "Disclaimer",
            disclaimer: basicEditorState,
          },
          updatedAt: "2024-07-18T00:00:00.000Z",
          createdAt: "2024-07-17T00:00:00.000Z",
        },
      },
    })

    render(<TermsOfServiceContent />)

    expect(screen.getByRole("heading", { name: "Terms of Service Title" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Subtitle for TOS" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Check-In Rules" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Session Rules" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Disclaimer" })).toBeInTheDocument()
    expect(screen.getByText("Plain text")).toBeInTheDocument()
    expect(screen.getByText("Main Heading")).toBeInTheDocument()
  })
})
