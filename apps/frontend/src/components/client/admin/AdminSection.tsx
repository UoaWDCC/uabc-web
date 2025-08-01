"use client"

import { AdminTabBar, UnderConstructionCard } from "@repo/ui/components/Generic"
import { Button } from "@repo/ui/components/Primitive"
import { Container, TabPanel } from "@yamada-ui/react"
import { memo } from "react"

export const AdminSection = memo(() => {
  return (
    <Container centerContent gap="xl" layerStyle="container" placeSelf="start">
      <AdminTabBar>
        <TabPanel>
          <Container centerContent layerStyle="container">
            <UnderConstructionCard title="View Members is Under Construction 🔧" />
          </Container>
        </TabPanel>
        <TabPanel>
          <Container centerContent layerStyle="container">
            <UnderConstructionCard title="Edit/View Sessions is Under Construction 🔧" />
          </Container>
        </TabPanel>
        <TabPanel>
          <Container centerContent layerStyle="container">
            <UnderConstructionCard title="Create Semesters & Sessions is Under Construction 🔧" />
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
