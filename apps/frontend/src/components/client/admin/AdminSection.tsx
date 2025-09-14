"use client"

import type { AdminTabBarSlug } from "@repo/shared"
import { UnderConstructionCard } from "@repo/ui/components/Generic"
import { Center } from "@yamada-ui/react"
import { memo } from "react"
import { AdminMembers, AdminSessions } from "./tabs"

interface AdminSectionProps {
  slug?: AdminTabBarSlug
}

export const AdminSection = memo(({ slug }: AdminSectionProps) => {
  return (
    <>
      {slug === "members" && <AdminMembers />}
      {slug === "sessions" && <AdminSessions />}
      {slug === "semesters" && (
        <Center>
          <UnderConstructionCard title="View Semesters is Under Construction 🔧" />
        </Center>
      )}
    </>
  )
})
