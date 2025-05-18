import type { GoogleJWT, MembershipType } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import JWTDecoder from "./jwt"

function Protected(required: keyof typeof MembershipType) {
  return (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: unknown[]) => Promise<Response>>,
  ): void => {
    const originalMethod = descriptor.value

    if (!originalMethod) throw new Error("Method is undefined")

    descriptor.value = async function (...args: unknown[]) {
      const req = args[0] as NextRequest
      const token = req.cookies.get("auth_token")?.value

      if (!token) {
        return NextResponse.redirect(new URL("/auth/google", req.url))
      }

      const jwt = new JWTDecoder(token)
      const data = jwt.decodeJWT() as GoogleJWT

      if (!data || data.user.role !== required) {
        return new NextResponse(null, { status: StatusCodes.FORBIDDEN })
      }

      return await originalMethod.apply(this, args)
    }
  }
}

/**
 * Protected API route handler wrapper with permissions.
 *
 * @param handler The route handler
 * @param required The required permission
 * @returns The protected route handler
 */
export default function protectedRoute(
  handler: (req: NextRequest) => Promise<Response>,
  required: keyof typeof MembershipType,
): (req: NextRequest) => Promise<Response> {
  class ProtectedRoute {
    @Protected(required)
    static async GET(...args: unknown[]) {
      const req = args[0] as NextRequest
      return handler(req)
    }
  }

  return ProtectedRoute.GET.bind(ProtectedRoute)
}
