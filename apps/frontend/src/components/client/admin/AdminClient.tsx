"use client"

import { NotAuthorised } from "@repo/ui/components/Generic"
import { RoleGuard } from "@/context/RoleWrappers"
import { AdminSection } from "./AdminSection"

export const AdminClient = () => {
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
      {() => <AdminSection />}
    </RoleGuard>
  )
}
