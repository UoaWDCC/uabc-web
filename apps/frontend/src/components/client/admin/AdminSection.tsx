"use client"

import { AdminTabBar, UnderConstructionCard } from "@repo/ui/components/Generic"
import { Container, TabPanel } from "@yamada-ui/react"
import { memo } from "react"

export const AdminSection = memo(() => {
  return (
    <Container
      gap="xl"
      justifyContent="start"
      layerStyle="container"
      py={{ base: "0", sm: "0", lg: "0" }}
    >
      <AdminTabBar
        lazy
        lazyBehavior="unmount"
        tabPanelsProps={{
          p: "0",
        }}
      >
        <TabPanel>
          <Container centerContent layerStyle="container">
            <UnderConstructionCard title="View Members is Under Construction 🔧" />
          </Container>
        </TabPanel>
        <TabPanel>
          <Container centerContent layerStyle="container">
            <UnderConstructionCard title="View Sessions is Under Construction 🔧" />
          </Container>
        </TabPanel>
        <TabPanel>
          <Container centerContent layerStyle="container">
            <UnderConstructionCard title="View Semesters is Under Construction 🔧" />
          </Container>
        </TabPanel>
      </AdminTabBar>
    </Container>
  )
})
