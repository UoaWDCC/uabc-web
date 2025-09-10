import type { ImportError } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { Security } from "@/business-layer/middleware/Security"
import CsvService from "@/business-layer/services/CsvService"
import UserDataService from "@/data-layer/services/UserDataService"

class ImportUsersRouteWrapper {
  /**
   * POST method to import users from CSV file.
   *
   * Expected CSV format:
   * - Header row: Timestamp,Email address,First name,Last name,Gender,Skill level,UoA ID number,Which university are you currently studying at?
   * - Timestamp: Any format (e.g., 21/07/2025 10:04:21) - not processed
   * - Email address: Valid email format (required)
   * - First name: Text (required)
   * - Last name: Text (optional)
   * - Gender: "male" or "female" (case-insensitive, optional)
   * - Skill level: "Beginner", "Intermediate", or "Advanced" (case-insensitive, optional)
   * - UoA ID number: Student ID number (optional)
   * - University: University name (will parse University of Auckland, AUT, Massey, working, not a student, etc.)
   *
   * @param req The request object containing the CSV file in form data
   * @returns Import results with success/error counts and details
   */
  @Security("jwt", ["admin"])
  static async POST(req: NextRequest) {
    try {
      const formData = await req.formData()
      const file = formData.get("file") as File

      if (!file) {
        return NextResponse.json(
          { error: "No file provided. Please upload a CSV file." },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      if (!file.name.toLowerCase().endsWith(".csv")) {
        return NextResponse.json(
          { error: "Invalid file type. Please upload a CSV file." },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      const csvContent = await file.text()

      if (!csvContent.trim()) {
        return NextResponse.json(
          { error: "The uploaded file is empty." },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      const csvService = new CsvService()
      const parseResult = csvService.parseCsvUsers(csvContent)

      if (parseResult.success.length === 0 && parseResult.errors.length > 0) {
        return NextResponse.json(
          {
            error: "No valid users found in CSV.",
            data: {
              imported: 0,
              failed: parseResult.errors.length,
              errors: parseResult.errors,
            },
          },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      const userDataService = new UserDataService()
      const importResults: { imported: number; failed: number; errors: ImportError[] } = {
        imported: 0,
        failed: parseResult.errors.length,
        errors: [...parseResult.errors],
      }

      for (const userData of parseResult.success) {
        try {
          await userDataService.createUser(userData)
          importResults.imported++
        } catch (error) {
          importResults.failed++
          importResults.errors.push({
            row: -1,
            errors: [
              error instanceof Error ? error.message : `Failed to create user: ${userData.email}`,
            ],
            data: userData,
          })
        }
      }

      const statusCode = importResults.imported > 0 ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST
      const message =
        importResults.imported > 0
          ? `Successfully imported ${importResults.imported} users${
              importResults.failed > 0 ? ` with ${importResults.failed} failures` : ""
            }.`
          : "No users were imported due to errors."

      return NextResponse.json(
        {
          message,
          data: importResults,
        },
        { status: statusCode },
      )
    } catch (error) {
      console.error("CSV import error:", error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { POST } = ImportUsersRouteWrapper
