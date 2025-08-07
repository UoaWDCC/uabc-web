"use client"

import type { AdminPage } from "@repo/shared/types"
import { NotAuthorised } from "@repo/ui/components/Generic"
import type { FC } from "react"
import { RoleGuard } from "@/context/RoleWrappers"
import { AdminSection } from "./AdminSection"

export interface AdminClientProps {
  view: AdminPage
}

export const AdminClient: FC<AdminClientProps> = ({ view }) => {
  return (
    <RoleGuard
      fallback={
        <NotAuthorised
          as="section"
          description="You must be an admin to view this page."
          title="Access Denied"
        />
      }
      scope={["admin"]}
    >
      {() => <AdminSection view={view} />}
    </RoleGuard>
  )
}
