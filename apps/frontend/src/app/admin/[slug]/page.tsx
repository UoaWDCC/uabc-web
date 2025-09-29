import { type AdminTabBarSlug, validSlugs } from "@repo/shared"
import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AdminClient } from "@/components/client/admin/AdminClient"

type AdminSlugPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: AdminSlugPageProps): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `Manage ${slug[0].toUpperCase() + slug.slice(1)}`,
    description: `Manage ${slug} through the administrator dashboard.`,
  }
}

export default async function AdminSlugPage({ params }: AdminSlugPageProps) {
  const { slug } = await params

  const activeIndex = validSlugs.indexOf(slug as AdminTabBarSlug)

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
