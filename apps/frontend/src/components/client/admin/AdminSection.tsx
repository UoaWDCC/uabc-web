"use client"

import { AdminTabBar, UnderConstructionCard } from "@repo/ui/components/Generic"
import { Container, TabPanel, VStack } from "@yamada-ui/react"
import { memo } from "react"
import { AdminMembers, AdminSessions } from "./tabs"

export const AdminSection = memo(() => {
  return (
    <Container
      gap="xl"
      justifyContent="start"
      layerStyle="container"
      py={{ base: "0", sm: "0", lg: "0" }}
    >
      <AdminTabBar lazy lazyBehavior="unmount">
        <TabPanel px="0">
          <VStack>
            <AdminMembers />
          </VStack>
        </TabPanel>
        <TabPanel px="0">
          <VStack>
            <AdminSessions />
          </VStack>
        </TabPanel>
        <TabPanel px="0">
          <Container centerContent layerStyle="container">
            <UnderConstructionCard title="View Semesters is Under Construction 🔧" />
          </Container>
        </TabPanel>
      </AdminTabBar>
    </Container>
  )
})
