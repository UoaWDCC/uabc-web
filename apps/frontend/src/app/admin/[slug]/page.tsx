import { type AdminTabBarSlug, validSlugs } from "@repo/shared"
import { VStack } from "@yamada-ui/react"
import { notFound } from "next/navigation"
import { AdminClient } from "@/components/client/admin/AdminClient"

type AdminSlugPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function AdminSlugPage({ params }: AdminSlugPageProps) {
  const { slug } = await params

  const activeIndex = validSlugs.findIndex((s) => s === slug)

  if (activeIndex === -1) {
    notFound()
  }

  return (
    <VStack as="main" pt="md">
      <AdminClient activeIndex={activeIndex} slug={slug as AdminTabBarSlug} />
    </VStack>
  )
}

export function generateStaticParams() {
  return validSlugs.map((slug) => ({
    slug,
  }))
}
