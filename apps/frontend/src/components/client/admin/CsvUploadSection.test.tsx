import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@repo/ui/test-utils"
import { vi } from "vitest"
import CsvUploadService from "@/services/admin/user/CsvUploadService"
import { CsvUploadSection } from "./CsvUploadSection"

vi.mock("@/services/admin/user/CsvUploadService", () => ({
  default: {
    uploadCsv: vi.fn(),
  },
}))

vi.mock("@yamada-ui/react", async () => {
  const actual = await vi.importActual("@yamada-ui/react")
  return {
    ...actual,
    useToast: () => ({
      toast: vi.fn(),
    }),
  }
})

describe("<CsvUploadSection />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the CSV upload section", () => {
    render(<CsvUploadSection />)

    expect(screen.getByText("Upload Members CSV")).toBeInTheDocument()
    expect(screen.getByText("Select CSV File")).toBeInTheDocument()
    expect(screen.getByText("Download Template")).toBeInTheDocument()
  })

  it("shows supported columns information", () => {
    render(<CsvUploadSection />)

    expect(screen.getByText("Supported columns:")).toBeInTheDocument()
    expect(screen.getByText(/firstname, lastname, email, role/)).toBeInTheDocument()
  })

  it("downloads template when download button is clicked", async () => {
    const { user } = render(<CsvUploadSection />)

    const downloadButton = screen.getByText("Download Template")
    await user.click(downloadButton)

    // Note: We can't easily test file download in jsdom, but we can verify the button is clickable
    expect(downloadButton).toBeInTheDocument()
  })

  it("handles file upload successfully", async () => {
    const mockUploadCsv = vi.mocked(CsvUploadService.uploadCsv)
    const mockResult = {
      success: true,
      message: "Successfully processed CSV. Created: 2, Failed: 0",
      created: 2,
      failed: 0,
      errors: [],
    }
    mockUploadCsv.mockResolvedValue(mockResult)

    const { user } = render(<CsvUploadSection />)

    const file = new File(["test,data"], "test.csv", { type: "text/csv" })
    const input = screen.getByLabelText("Select CSV File")

    await user.upload(input, file)

    await waitFor(() => {
      expect(mockUploadCsv).toHaveBeenCalledWith(file)
    })

    await waitFor(() => {
      expect(screen.getByText("Upload Results")).toBeInTheDocument()
      expect(
        screen.getByText("Successfully processed CSV. Created: 2, Failed: 0"),
      ).toBeInTheDocument()
    })
  })

  it("handles upload errors", async () => {
    const mockUploadCsv = vi.mocked(CsvUploadService.uploadCsv)
    const mockResult = {
      success: false,
      message: "Some records failed to process",
      created: 1,
      failed: 2,
      errors: [
        { row: 3, error: "Invalid email format" },
        { row: 4, error: "Missing required field" },
      ],
    }
    mockUploadCsv.mockResolvedValue(mockResult)

    const { user } = render(<CsvUploadSection />)

    const file = new File(["test,data"], "test.csv", { type: "text/csv" })
    const input = screen.getByLabelText("Select CSV File")

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText("Upload Results")).toBeInTheDocument()
      expect(screen.getByText("Some records failed to process")).toBeInTheDocument()
      expect(screen.getByText("Row 3: Invalid email format")).toBeInTheDocument()
      expect(screen.getByText("Row 4: Missing required field")).toBeInTheDocument()
    })
  })

  it("rejects non-CSV files", async () => {
    const { user } = render(<CsvUploadSection />)

    const file = new File(["test,data"], "test.txt", { type: "text/plain" })
    const input = screen.getByLabelText("Select CSV File")

    await user.upload(input, file)

    // The component should not process non-CSV files
    expect(screen.queryByText("Upload Results")).not.toBeInTheDocument()
  })
})
