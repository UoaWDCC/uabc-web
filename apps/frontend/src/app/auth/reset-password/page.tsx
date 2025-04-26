import Link from "next/link"
import { redirect } from "next/navigation"
import { z } from "zod"

import { BackNavigationBar } from "@/components/Composite/BackNavigationBar"
import { Card } from "@/components/Composite/Card"

export const metadata = {
  title: "Reset Password - UABC Booking Portal",
}

const searchParamsSchema = z.object({
  token: z.string(),
})

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const parseResult = searchParamsSchema.safeParse(await props.searchParams)

  if (!parseResult.success) {
    return redirect("/auth/login")
  }

  const { token } = parseResult.data

  // TODO: Check if token is expired
  const tokenExpired = !token
  if (tokenExpired) {
    return (
      <div className="mx-4 flex min-h-dvh flex-col">
        <BackNavigationBar pathName="/auth/login?open=true" title="Reset Your Password" />
        <div className="grid grow place-items-center">
          <Card className="bg-destructive text-destructive-foreground" variant="card">
            <h1 className="pb-1 text-lg font-semibold tracking-tight">Expired Link</h1>
            This password reset link has expired. Please request a new one{" "}
            <Link className="text-right font-bold underline" href="/auth/forgot-password">
              here
            </Link>
            .
          </Card>
        </div>
      </div>
    )
  }
}
