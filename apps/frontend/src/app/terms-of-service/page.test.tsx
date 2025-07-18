import { basicEditorState, complexEditorState } from "@repo/ui/test-config/mocks/RichText.mock"
import { isValidElement } from "react"
import { getTos } from "@/services/cms/tos/TosService"
import { act, render, screen } from "@/test-config/test-utils"
import TermsOfServiceContent from "./page"

vi.mock("@/services/cms/tos/TosService", () => ({
  getTos: vi.fn(),
}))

const mockedGetTos = vi.mocked(getTos)

describe("<TermsOfServiceContent />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should be valid react component", () => {
    expect(TermsOfServiceContent).toBeDefined()
    expect(isValidElement(<TermsOfServiceContent />)).toBe(true)
  })

  it("should display error state if no data", async () => {
    mockedGetTos.mockResolvedValue({ data: undefined, isError: true, status: 500 })

    await act(async () => {
      render(<TermsOfServiceContent />)
    })

    expect(
      await screen.findByText("Failed to load Terms of Service. Please contact the administrator."),
    ).toBeInTheDocument()
    expect(await screen.findByText("Terms of Service")).toBeInTheDocument()
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
      isError: false,
      status: 200,
    })

    await act(async () => {
      render(<TermsOfServiceContent />)
    })

    expect(
      await screen.findByRole("heading", { name: "Terms of Service Title" }),
    ).toBeInTheDocument()
    expect(await screen.findByRole("heading", { name: "Subtitle for TOS" })).toBeInTheDocument()
    expect(await screen.findByRole("heading", { name: "Check-In Rules" })).toBeInTheDocument()
    expect(await screen.findByRole("heading", { name: "Session Rules" })).toBeInTheDocument()
    expect(await screen.findByRole("heading", { name: "Disclaimer" })).toBeInTheDocument()
    expect(await screen.findByText("Plain text")).toBeInTheDocument()
    expect(await screen.findByText("Main Heading")).toBeInTheDocument()
  })
})
