import { type AdminTabBarSlug, validSlugs } from "@repo/shared"
import { notFound } from "next/navigation"
import { AdminClient } from "@/components/client/admin/AdminClient"

type AdminSlugPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function AdminSlugPage({ params }: AdminSlugPageProps) {
  const { slug } = await params

  if (!validSlugs.includes(slug as (typeof validSlugs)[number])) {
    notFound()
  }

  return <AdminClient slug={slug as AdminTabBarSlug} />
}

export function generateStaticParams() {
  return validSlugs.map((slug) => ({
    slug,
  }))
}
