import { ContactFormDataSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

class ContactRouteWrapper {
  static async POST(req: NextRequest) {
    try {
      const parsedBody = ContactFormDataSchema.parse(await req.json())

      // TODO: Implement actual contact form processing logic
      // This could include:
      // - Sending email notifications to admin
      // - Storing contact submissions in database
      // - Integrating with external services (e.g., email service providers)

      console.log("Contact form submission:", parsedBody)

      return NextResponse.json(
        {
          message: "Contact form submitted successfully",
          data: { id: Date.now() }, // Temporary ID for successful submission
        },
        { status: StatusCodes.CREATED },
      )
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: "Invalid request body",
            details: error.flatten(),
          },
          { status: StatusCodes.BAD_REQUEST },
        )
      }

      console.error("Contact form submission error:", error)
      return NextResponse.json(
        {
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { POST } = ContactRouteWrapper
