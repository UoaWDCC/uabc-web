import { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import UserDataService from "@/data-layer/services/UserDataService"
import { POST } from "./route"

vi.mock("@/data-layer/services/UserDataService")
vi.mock("@/business-layer/middleware/Security", () => ({
  Security: vi.fn(() => vi.fn()),
}))

const mockUserDataService = {
  createUser: vi.fn(),
}

vi.mocked(UserDataService).mockImplementation(() => mockUserDataService as any)

describe("POST /api/admin/users/upload-csv", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns error when no file is provided", async () => {
    const formData = new FormData()
    const request = new NextRequest("http://localhost:3000/api/admin/users/upload-csv", {
      method: "POST",
      body: formData,
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toBe("No file provided")
  })

  it("returns error when file is not CSV", async () => {
    const formData = new FormData()
    const file = new File(["test"], "test.txt", { type: "text/plain" })
    formData.append("file", file)

    const request = new NextRequest("http://localhost:3000/api/admin/users/upload-csv", {
      method: "POST",
      body: formData,
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toBe("File must be a CSV")
  })

  it("returns error when CSV has insufficient rows", async () => {
    const formData = new FormData()
    const csvContent = "firstname,lastname,email"
    const file = new File([csvContent], "test.csv", { type: "text/csv" })
    formData.append("file", file)

    const request = new NextRequest("http://localhost:3000/api/admin/users/upload-csv", {
      method: "POST",
      body: formData,
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toBe("CSV must have at least a header row and one data row")
  })

  it("successfully processes valid CSV", async () => {
    const mockCreatedUser = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "member",
    }

    mockUserDataService.createUser.mockResolvedValue(mockCreatedUser)

    const formData = new FormData()
    const csvContent = `firstname,lastname,email,role
John,Doe,john.doe@example.com,member`
    const file = new File([csvContent], "test.csv", { type: "text/csv" })
    formData.append("file", file)

    const request = new NextRequest("http://localhost:3000/api/admin/users/upload-csv", {
      method: "POST",
      body: formData,
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.created).toBe(1)
    expect(data.failed).toBe(0)
    expect(data.errors).toHaveLength(0)
    expect(mockUserDataService.createUser).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "member",
    })
  })

  it("handles validation errors in CSV data", async () => {
    const formData = new FormData()
    const csvContent = `firstname,lastname,email,role
John,Doe,invalid-email,member`
    const file = new File([csvContent], "test.csv", { type: "text/csv" })
    formData.append("file", file)

    const request = new NextRequest("http://localhost:3000/api/admin/users/upload-csv", {
      method: "POST",
      body: formData,
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.created).toBe(0)
    expect(data.failed).toBe(1)
    expect(data.errors).toHaveLength(1)
    expect(data.errors[0].row).toBe(2)
    expect(data.errors[0].error).toContain("Validation error")
  })

  it("handles rows with incorrect number of columns", async () => {
    const formData = new FormData()
    const csvContent = `firstname,lastname,email,role
John,Doe,john.doe@example.com,member,extra-column`
    const file = new File([csvContent], "test.csv", { type: "text/csv" })
    formData.append("file", file)

    const request = new NextRequest("http://localhost:3000/api/admin/users/upload-csv", {
      method: "POST",
      body: formData,
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.created).toBe(0)
    expect(data.failed).toBe(1)
    expect(data.errors).toHaveLength(1)
    expect(data.errors[0].row).toBe(2)
    expect(data.errors[0].error).toBe("Row has incorrect number of columns")
  })

  it("handles different column name variations", async () => {
    const mockCreatedUser = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "member",
      phoneNumber: "021123456",
    }

    mockUserDataService.createUser.mockResolvedValue(mockCreatedUser)

    const formData = new FormData()
    const csvContent = `first_name,last_name,email,role,phone_number
John,Doe,john.doe@example.com,member,021123456`
    const file = new File([csvContent], "test.csv", { type: "text/csv" })
    formData.append("file", file)

    const request = new NextRequest("http://localhost:3000/api/admin/users/upload-csv", {
      method: "POST",
      body: formData,
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.created).toBe(1)
    expect(mockUserDataService.createUser).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "member",
      phoneNumber: "021123456",
    })
  })
})
