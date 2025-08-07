"use client"

import { AdminTabBar, UnderConstructionCard } from "@repo/ui/components/Generic"
import { Button } from "@repo/ui/components/Primitive"
import { Container, TabPanel } from "@yamada-ui/react"
import { memo } from "react"

export const AdminSection = memo(() => {
  return (
    <Container
      gap="xl"
      justifyContent={{ lg: "start" }}
      layerStyle="container"
      py={{ base: "md", sm: "md", lg: "md" }}
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

      {/* TODO: implement onClick for Reset Sessions button */}
      <Button colorScheme="danger" placeSelf="start">
        Reset Sessions
      </Button>
    </Container>
  )
})
