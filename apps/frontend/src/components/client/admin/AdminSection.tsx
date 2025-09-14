"use client"

import type { AdminTabBarSlug } from "@repo/shared"
import { AdminTabBar, UnderConstructionCard } from "@repo/ui/components/Generic"
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
      <AdminTabBar activeIndex={activeIndex} slug={slug as AdminTabBarSlug} />
      <VStack
        maxW={{
          base: "calc(100vw - $spaces.md * 2)",
          sm: "calc(100vw - $spaces.lg * 2)",
          lg: "calc(100vw - $spaces.2xl * 2)",
        }}
      >
        {slug === "members" && <AdminMembers />}
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
