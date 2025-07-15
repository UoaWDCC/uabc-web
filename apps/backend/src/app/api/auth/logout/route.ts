import { StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/", req.url), StatusCodes.PERMANENT_REDIRECT)
  response.cookies.delete("auth-token")

  return response
}
