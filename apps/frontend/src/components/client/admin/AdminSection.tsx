"use client"

import type { AdminTabBarSlug } from "@repo/shared"
import { Routes } from "@repo/shared"
import { AdminTabBar, UnderConstructionCard } from "@repo/ui/components/Generic"
import { FilterActionsProvider } from "@repo/ui/components/Generic/ManagementTable/Filter/FilterActionsContext"
import { Center, Container, VStack } from "@yamada-ui/react"
import { memo } from "react"
import { AdminMembers, AdminSessions } from "./tabs"

interface AdminSectionProps {
  slug?: AdminTabBarSlug
  activeIndex?: number
}

export const AdminSection = memo(({ slug, activeIndex }: AdminSectionProps) => {
  return (
    <Container
      gap="lg"
      justifyContent="start"
      layerStyle="container"
      py={{ base: "0", sm: "0", lg: "0" }}
    >
      <AdminTabBar
        activeIndex={activeIndex}
        slug={slug as AdminTabBarSlug}
        tabs={[
          { slug: Routes.ADMIN_MEMBERS, label: "View Members" },
          { slug: Routes.ADMIN_SESSIONS, label: "View Sessions" },
          { slug: Routes.ADMIN_SEMESTERS, label: "View Semesters" },
        ]}
      />
      <VStack
        maxW={{
          base: "calc(100vw - $spaces.md * 2)",
          sm: "calc(100vw - $spaces.lg * 2)",
          lg: "calc(100vw - $spaces.2xl * 2)",
        }}
      >
        {slug === "members" && (
          <FilterActionsProvider>
            <AdminMembers />
          </FilterActionsProvider>
        )}
        {slug === "sessions" && <AdminSessions />}
        {slug === "semesters" && (
          <Center>
            <UnderConstructionCard title="View Semesters is Under Construction 🔧" />
          </Center>
        )}
      </VStack>
    </Container>
  )
})
