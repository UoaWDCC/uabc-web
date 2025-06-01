import StandardSecurity from "@/business-layer/provider/standard"
import UserDataService from "@/data-layer/services/UserDataService"
import { StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  const userDataService = new UserDataService()

  const { email, password }: { email: string; password: string } = await req.json()

  if (!StandardSecurity.validateDetails(email, password)) {
    return NextResponse.json({ status: StatusCodes.BAD_REQUEST })
  }

  const user = userDataService.getUserByEmail(email)
  console.log(user)
}
