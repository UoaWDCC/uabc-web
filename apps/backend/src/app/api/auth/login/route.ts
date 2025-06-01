import StandardSecurity from "@/business-layer/provider/standard"
import { StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json()

  if (!StandardSecurity.validateDetails(email, password)) {
    return NextResponse.json(
      {
        error: "specific errors",
      },
      { status: StatusCodes.BAD_REQUEST },
    )
  }

  //   const validatedFields = LoginDetailsSchema.safeParse({
  //     email: formData.get("email"),
  //     password: formData.get("password"),
  //   })
  //   if (!validatedFields.success) {
  //     return NextResponse.json(
  //       {
  //         errors: validatedFields.error.flatten().fieldErrors,
  //       },
  //       { status: StatusCodes.BAD_REQUEST },
  //     )
  //   }

  //   const { email, password } = validatedFields.data
  //   const peanut = StandardSecurity.validateDetails(email, password)
}
