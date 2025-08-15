import { CreateUserRequestSchema } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { Security } from "@/business-layer/middleware/Security"
import UserDataService from "@/data-layer/services/UserDataService"

interface CsvUploadResponse {
  success: boolean
  message: string
  created: number
  failed: number
  errors: Array<{
    row: number
    error: string
  }>
}

class RouteWrapper {
  @Security("jwt")
  static async POST(req: NextRequest & { user: User }): Promise<NextResponse<CsvUploadResponse>> {
    try {
      const formData = await req.formData()
      const file = formData.get("file") as File

      if (!file) {
        return NextResponse.json(
          {
            success: false,
            message: "No file provided",
            created: 0,
            failed: 0,
            errors: [],
          },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      if (!file.name.endsWith(".csv")) {
        return NextResponse.json(
          {
            success: false,
            message: "File must be a CSV",
            created: 0,
            failed: 0,
            errors: [],
          },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      const csvText = await file.text()
      const lines = csvText.split("\n").filter((line) => line.trim() !== "")

      if (lines.length < 2) {
        return NextResponse.json(
          {
            success: false,
            message: "CSV must have at least a header row and one data row",
            created: 0,
            failed: 0,
            errors: [],
          },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      const headers = lines[0].split(",").map((header) => header.trim().toLowerCase())
      const dataRows = lines.slice(1)

      const userDataService = new UserDataService()
      let created = 0
      let failed = 0
      const errors: Array<{ row: number; error: string }> = []

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i]
        const values = row.split(",").map((value) => value.trim())

        if (values.length !== headers.length) {
          errors.push({
            row: i + 2,
            error: "Row has incorrect number of columns",
          })
          failed++
          continue
        }

        const userData: Record<string, any> = {}

        for (let j = 0; j < headers.length; j++) {
          const header = headers[j]
          const value = values[j]

          if (value === "" || value === "null" || value === "undefined") {
            continue
          }

          switch (header) {
            case "first_name":
              userData.firstName = value
              break
            case "last_name":
              userData.lastName = value
              break
            case "email":
              userData.email = value
              break
            case "role":
              userData.role = value
              break
            case "phone_number":
            case "phone":
              userData.phoneNumber = value
              break
            case "play_level":
            case "level":
              userData.playLevel = value
              break
            case "gender":
              userData.gender = value
              break
            case "dietary_requirements":
            case "dietary":
              userData.dietaryRequirements = value
              break
            case "student_id":
              userData.studentId = value
              break
            case "student_upi":
            case "upi":
              userData.studentUpi = value
              break
            case "university":
              userData.university = value
              break
            case "remaining_sessions":
            case "sessions":
              userData.remainingSessions = Number.parseInt(value, 10) || 0
              break
          }
        }

        try {
          const validatedData = CreateUserRequestSchema.parse(userData)
          await userDataService.createUser(validatedData)
          created++
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push({
              row: i + 2,
              error: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
            })
          } else {
            errors.push({
              row: i + 2,
              error: error instanceof Error ? error.message : "Unknown error",
            })
          }
          failed++
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully processed CSV. Created: ${created}, Failed: ${failed}`,
        created,
        failed,
        errors,
      })
    } catch (error) {
      console.error("CSV upload error:", error)
      return NextResponse.json(
        {
          success: false,
          message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
          created: 0,
          failed: 0,
          errors: [],
        },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { POST } = RouteWrapper
