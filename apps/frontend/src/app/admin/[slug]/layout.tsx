import type { AdminTabBarSlug } from "@repo/shared"
import { validSlugs } from "@repo/shared"
import { AdminTabBar } from "@repo/ui/components/Generic"
import { Container, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Admin - UABC",
  description: "Manage members, sessions and semesters.",
}

type AdminLayoutProps = {
  children: React.ReactNode
  params: Promise<{
    slug?: string
  }>
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { slug } = await params
  const validSlug = slug as AdminTabBarSlug | undefined

  const activeIndex = validSlug ? validSlugs.indexOf(validSlug) : -1

  if (activeIndex === -1) {
    notFound()
  }

  return (
    <VStack as="main" pt="md">
      <Container
        gap="lg"
        justifyContent="start"
        layerStyle="container"
        py={{ base: "0", sm: "0", lg: "0" }}
      >
        <AdminTabBar activeIndex={activeIndex} slug={validSlug} />
        <VStack
          maxW={{
            base: "calc(100vw - $spaces.md * 2)",
            sm: "calc(100vw - $spaces.lg * 2)",
            lg: "calc(100vw - $spaces.2xl * 2)",
          }}
        >
          {children}
        </VStack>
      </Container>
    </VStack>
  )
}
