"use client"

import type { AdminTabBarSlug } from "@repo/shared"
import { NotAuthorised } from "@repo/ui/components/Generic"
import { Center, Loading } from "@yamada-ui/react"
import { RoleGuard } from "@/context/RoleWrappers"
import { AdminSection } from "./AdminSection"

interface AdminClientProps {
  slug?: AdminTabBarSlug
  activeIndex?: number
}

export const AdminClient = ({ slug, activeIndex }: AdminClientProps) => {
  return (
    <RoleGuard
      fallback={
        <NotAuthorised
          additionalDescription="You may also be logged out."
          description="You must be an admin to view this page."
          title="Access Denied"
        />
      }
      loading={
        <Center layerStyle="container">
          <Loading fontSize="4xl" />
        </Center>
      }
      scope={["admin"]}
    >
      {() => <AdminSection activeIndex={activeIndex} slug={slug} />}
    </RoleGuard>
  )
}
