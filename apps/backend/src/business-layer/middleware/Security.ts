import type { MembershipType } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import authenticate from "../security/authentication"
import { UnauthorizedAuthError } from "../security/errors"

type RouteHandlerContext = {
  params: Promise<Record<string, string>>
}

/**
 * The security decorator middleware method.
 *
 * @param securityName The name of the security, only JWT is supported
 * @param scopes The scopes to check for, if not provided, no scope check is performed
 * @returns Calls the original function, otherwise returns a {@link NextResponse} or redirection
 */
export function Security(securityName: "jwt", scopes?: (keyof typeof MembershipType)[]) {
  return (
    // biome-ignore lint/suspicious/noExplicitAny: The target may be anything
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (req: NextRequest, context: RouteHandlerContext) {
      try {
        const user = await authenticate(securityName, scopes)

        const reqWithUser = Object.assign(req, { user })

        return await originalMethod.call(this, reqWithUser, context)
      } catch (err) {
        if (err instanceof UnauthorizedAuthError) {
          return NextResponse.json({ error: err.message }, { status: StatusCodes.UNAUTHORIZED })
        }
        console.error(err)
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: StatusCodes.INTERNAL_SERVER_ERROR },
        )
      }
    }

    return descriptor
  }
}
