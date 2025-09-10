import { StatusCodes } from "http-status-codes"
import type { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CsvService from "@/business-layer/services/CsvService"
import UserDataService from "@/data-layer/services/UserDataService"
import { POST } from "./route"

vi.mock("@/business-layer/services/CsvService")
vi.mock("@/data-layer/services/UserDataService")
vi.mock("@/business-layer/middleware/Security", () => ({
  Security: () => () => {},
}))

const MockedCsvService = vi.mocked(CsvService)
const MockedUserDataService = vi.mocked(UserDataService)

describe("ImportUsersRoute", () => {
  let mockCsvService: any
  let mockUserDataService: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockCsvService = {
      parseCsvUsers: vi.fn(),
    }
    mockUserDataService = {
      createUser: vi.fn(),
    }
    MockedCsvService.mockImplementation(() => mockCsvService)
    MockedUserDataService.mockImplementation(() => mockUserDataService)
  })

  const createMockRequest = (formData: FormData) => {
    const request = {
      formData: vi.fn().mockResolvedValue(formData),
    } as unknown as NextRequest
    return request
  }

  const createMockFile = (name: string, content: string) => {
    const file = new File([content], name, { type: "text/csv" })
    Object.defineProperty(file, "text", {
      value: vi.fn().mockResolvedValue(content),
    })
    return file
  }

  describe("POST", () => {
    it("should successfully import valid users from CSV", async () => {
      const csvContent = `Timestamp,Email,First name,Last name,Gender,Skill level,UoA ID,University
21/07/2025 10:04:21,john@example.com,John,Doe,male,Beginner,123456,University of Auckland`

      const file = createMockFile("users.csv", csvContent)
      const formData = new FormData()
      formData.append("file", file)

      const mockUserData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "casual",
        playLevel: "beginner",
        gender: "male",
        studentId: "123456",
        university: "UoA",
        phoneNumber: null,
        dietaryRequirements: null,
        studentUpi: null,
        remainingSessions: 0,
        image: null,
        emailVerification: undefined,
      }

      mockCsvService.parseCsvUsers.mockReturnValue({
        success: [mockUserData],
        errors: [],
      })
      mockUserDataService.createUser.mockResolvedValue({ id: "123", ...mockUserData })

      const response = await POST(createMockRequest(formData))
      const responseBody = await response.json()

      expect(response.status).toBe(StatusCodes.CREATED)
      expect(responseBody.data.imported).toBe(1)
      expect(responseBody.data.failed).toBe(0)
      expect(responseBody.data.errors).toHaveLength(0)
      expect(mockCsvService.parseCsvUsers).toHaveBeenCalledWith(csvContent)
      expect(mockUserDataService.createUser).toHaveBeenCalledWith(mockUserData)
    })

    it("should return error when no file is provided", async () => {
      const formData = new FormData()

      const response = await POST(createMockRequest(formData))
      const responseBody = await response.json()

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(responseBody.error).toBe("No file provided. Please upload a CSV file.")
    })

    it("should return error for invalid file type", async () => {
      const file = new File(["content"], "users.txt", { type: "text/plain" })
      const formData = new FormData()
      formData.append("file", file)

      const response = await POST(createMockRequest(formData))
      const responseBody = await response.json()

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(responseBody.error).toBe("Invalid file type. Please upload a CSV file.")
    })

    it("should return error for empty file", async () => {
      const file = createMockFile("users.csv", "")
      const formData = new FormData()
      formData.append("file", file)

      const response = await POST(createMockRequest(formData))
      const responseBody = await response.json()

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(responseBody.error).toBe("The uploaded file is empty.")
    })

    it("should handle CSV with only errors", async () => {
      const csvContent = `Timestamp,Email,First name,Last name,Gender,Skill level,UoA ID,University
21/07/2025 10:04:21,invalid-email,,Doe,male,Beginner,123456,University of Auckland`

      const file = createMockFile("users.csv", csvContent)
      const formData = new FormData()
      formData.append("file", file)

      mockCsvService.parseCsvUsers.mockReturnValue({
        success: [],
        errors: [
          {
            row: 2,
            errors: ["Invalid email format", "First name is required"],
            data: { email: "invalid-email", firstName: "", lastName: "Doe" },
          },
        ],
      })

      const response = await POST(createMockRequest(formData))
      const responseBody = await response.json()

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(responseBody.error).toBe("No valid users found in CSV.")
      expect(responseBody.data.imported).toBe(0)
      expect(responseBody.data.failed).toBe(1)
      expect(responseBody.data.errors).toHaveLength(1)
    })

    it("should handle mixed success and failures", async () => {
      const csvContent = `Timestamp,Email,First name,Last name,Gender,Skill level,UoA ID,University
21/07/2025 10:04:21,john@example.com,John,Doe,male,Beginner,123456,University of Auckland
22/07/2025 11:05:22,invalid-email,Jane,Smith,female,Intermediate,,AUT`

      const file = createMockFile("users.csv", csvContent)
      const formData = new FormData()
      formData.append("file", file)

      const validUserData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "casual",
      }

      mockCsvService.parseCsvUsers.mockReturnValue({
        success: [validUserData],
        errors: [
          {
            row: 3,
            errors: ["Invalid email format"],
            data: { email: "invalid-email", firstName: "Jane" },
          },
        ],
      })
      mockUserDataService.createUser.mockResolvedValue({ id: "123", ...validUserData })

      const response = await POST(createMockRequest(formData))
      const responseBody = await response.json()

      expect(response.status).toBe(StatusCodes.CREATED)
      expect(responseBody.data.imported).toBe(1)
      expect(responseBody.data.failed).toBe(1)
      expect(responseBody.data.errors).toHaveLength(1)
    })

    it("should handle database errors during user creation", async () => {
      const csvContent = `Timestamp,Email,First name,Last name,Gender,Skill level,UoA ID,University
21/07/2025 10:04:21,john@example.com,John,Doe,male,Beginner,123456,University of Auckland`

      const file = createMockFile("users.csv", csvContent)
      const formData = new FormData()
      formData.append("file", file)

      const mockUserData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "casual",
      }

      mockCsvService.parseCsvUsers.mockReturnValue({
        success: [mockUserData],
        errors: [],
      })
      mockUserDataService.createUser.mockRejectedValue(new Error("Email already exists"))

      const response = await POST(createMockRequest(formData))
      const responseBody = await response.json()

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(responseBody.data.imported).toBe(0)
      expect(responseBody.data.failed).toBe(1)
      expect(responseBody.data.errors).toHaveLength(1)
      expect(responseBody.data.errors[0].errors[0]).toBe("Email already exists")
    })

    it("should handle partial success with database errors", async () => {
      const csvContent = `Timestamp,Email,First name,Last name,Gender,Skill level,UoA ID,University
21/07/2025 10:04:21,john@example.com,John,Doe,male,Beginner,123456,University of Auckland
22/07/2025 11:05:22,jane@example.com,Jane,Smith,female,Intermediate,,AUT`

      const file = createMockFile("users.csv", csvContent)
      const formData = new FormData()
      formData.append("file", file)

      const mockUserData1 = { firstName: "John", email: "john@example.com", role: "casual" }
      const mockUserData2 = { firstName: "Jane", email: "jane@example.com", role: "casual" }

      mockCsvService.parseCsvUsers.mockReturnValue({
        success: [mockUserData1, mockUserData2],
        errors: [],
      })
      mockUserDataService.createUser
        .mockResolvedValueOnce({ id: "123", ...mockUserData1 })
        .mockRejectedValueOnce(new Error("Email already exists"))

      const response = await POST(createMockRequest(formData))
      const responseBody = await response.json()

      expect(response.status).toBe(StatusCodes.CREATED)
      expect(responseBody.data.imported).toBe(1)
      expect(responseBody.data.failed).toBe(1)
      expect(responseBody.data.errors).toHaveLength(1)
    })

    it("should handle server errors gracefully", async () => {
      const formData = new FormData()
      formData.append("file", createMockFile("users.csv", "content"))

      const mockRequest = createMockRequest(formData)
      mockRequest.formData = vi.fn().mockRejectedValue(new Error("Server error"))

      const response = await POST(mockRequest)
      const responseBody = await response.json()

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(responseBody.error).toBe("Internal Server Error")
    })
  })
})
