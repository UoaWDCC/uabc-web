"use client"

import { type AdminTabBarSlug, NotAuthorised } from "@repo/ui/components/Generic"
import { Center, Loading } from "@yamada-ui/react"
import { RoleGuard } from "@/context/RoleWrappers"
import { AdminSection } from "./AdminSection"

interface AdminClientProps {
  slug?: AdminTabBarSlug
}

export const AdminClient = ({ slug }: AdminClientProps) => {
  return (
    <RoleGuard
      fallback={
        <NotAuthorised
          as="section"
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
      {() => <AdminSection slug={slug} />}
    </RoleGuard>
  )
}
