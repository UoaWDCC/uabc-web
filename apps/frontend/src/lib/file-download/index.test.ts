import { beforeEach, describe, expect, it, vi } from "vitest"

import { downloadCsvFile, downloadFile } from "./index"

// Mock DOM APIs
const mockClick = vi.fn()
const mockSetAttribute = vi.fn()
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
const mockContains = vi.fn()
const mockCreateElement = vi.fn()
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

// Mock document and URL APIs
Object.defineProperty(global, "document", {
  value: {
    createElement: mockCreateElement,
    body: {
      appendChild: mockAppendChild,
      removeChild: mockRemoveChild,
      contains: mockContains,
    },
  },
})

Object.defineProperty(global, "URL", {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
})

Object.defineProperty(global, "Blob", {
  value: class MockBlob {
    constructor(
      public content: string[],
      public options: { type: string },
    ) {}
  },
})

describe("downloadFile", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default mock implementations
    mockCreateElement.mockReturnValue({
      setAttribute: mockSetAttribute,
      click: mockClick,
      style: {},
    })
    mockCreateObjectURL.mockReturnValue("blob:mock-url")
    mockContains.mockReturnValue(true)
  })

  it("creates blob with correct content and mime type", () => {
    downloadFile("test content", "test.txt", "text/plain;charset=utf-8;")

    // Check that Blob was created with correct parameters
    expect(global.Blob).toHaveBeenCalledWith(["test content"], {
      type: "text/plain;charset=utf-8;",
    })
  })

  it("creates download link with correct attributes", () => {
    downloadFile("test content", "test.txt", "text/plain;charset=utf-8;")

    expect(mockCreateElement).toHaveBeenCalledWith("a")
    expect(mockSetAttribute).toHaveBeenCalledWith("href", "blob:mock-url")
    expect(mockSetAttribute).toHaveBeenCalledWith("download", "test.txt")
  })

  it("triggers download by clicking the link", () => {
    downloadFile("test content", "test.txt", "text/plain;charset=utf-8;")

    expect(mockAppendChild).toHaveBeenCalled()
    expect(mockClick).toHaveBeenCalled()
  })

  it("cleans up DOM and URL resources", () => {
    downloadFile("test content", "test.txt", "text/plain;charset=utf-8;")

    expect(mockContains).toHaveBeenCalled()
    expect(mockRemoveChild).toHaveBeenCalled()
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url")
  })

  it("handles cleanup when element is not in document", () => {
    mockContains.mockReturnValue(false)

    downloadFile("test content", "test.txt", "text/plain;charset=utf-8;")

    expect(mockRemoveChild).not.toHaveBeenCalled()
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url")
  })

  it("sets link visibility to hidden", () => {
    const mockLink = {
      setAttribute: mockSetAttribute,
      click: mockClick,
      style: {} as CSSStyleDeclaration,
    }
    mockCreateElement.mockReturnValue(mockLink)

    downloadFile("test content", "test.txt", "text/plain;charset=utf-8;")

    expect(mockLink.style.visibility).toBe("hidden")
  })
})

describe("downloadCsvFile", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default mock implementations
    mockCreateElement.mockReturnValue({
      setAttribute: mockSetAttribute,
      click: mockClick,
      style: {},
    })
    mockCreateObjectURL.mockReturnValue("blob:mock-url")
    mockContains.mockReturnValue(true)
  })

  it("calls downloadFile with CSV mime type", () => {
    const csvContent = "name,email\nJohn,john@example.com"

    downloadCsvFile(csvContent, "users.csv")

    // Verify Blob was created with CSV mime type
    expect(global.Blob).toHaveBeenCalledWith([csvContent], {
      type: "text/csv;charset=utf-8;",
    })
  })

  it("uses correct filename for CSV download", () => {
    downloadCsvFile("test,data", "export.csv")

    expect(mockSetAttribute).toHaveBeenCalledWith("download", "export.csv")
  })
})

describe("error handling", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockCreateElement.mockReturnValue({
      setAttribute: mockSetAttribute,
      click: mockClick,
      style: {},
    })
    mockCreateObjectURL.mockReturnValue("blob:mock-url")
  })

  it("still cleans up URL even if DOM manipulation fails", () => {
    mockAppendChild.mockImplementation(() => {
      throw new Error("DOM error")
    })

    expect(() => downloadFile("test", "test.txt", "text/plain")).toThrow("DOM error")
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url")
  })
})
