"use client"

import { AdminTabBar, UnderConstructionCard } from "@repo/ui/components/Generic"
import { Container, TabPanel, VStack } from "@yamada-ui/react"
import { memo } from "react"
import { AdminMembersSection } from "./AdminMembersSection"

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
          <VStack as="section">
            <AdminMembersSection />
          </VStack>
        </TabPanel>
        <TabPanel px="0">
          <Container centerContent layerStyle="container">
            <UnderConstructionCard title="View Sessions is Under Construction 🔧" />
          </Container>
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
