import { Heading } from "@repo/ui/components/Heading"
import { Button, Card, Center, Text, Link as UILink, VStack } from "@yamada-ui/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { z } from "zod"
import { ResetPasswordForm } from "@/components/Composite/auth/ResetPasswordForm"

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

  return (
    <Center minH="100dvh">
      <Card
        gap="6"
        p={{
          base: "3",
          sm: "6",
        }}
        w={{ base: "sm", md: "md", lg: "lg" }}
      >
        {tokenExpired ? (
          <VStack>
            <Heading.h2 textAlign="center">Expired Link</Heading.h2>
            <Text color="tertiary">This password reset link has expired.</Text>

            <Button as={Link} colorScheme="primary" href="/auth/forgot-password">
              Request new link
            </Button>

            <Center fontSize="xs">
              <Text color="tertiary">
                Back to&nbsp;
                <UILink
                  as={Link}
                  color={["tertiary", "white"]}
                  fontWeight="bold"
                  href="/auth/login?open=true"
                >
                  Login
                </UILink>
              </Text>
            </Center>
          </VStack>
        ) : (
          <ResetPasswordForm token={token} />
        )}
      </Card>
    </Center>
  )
}
