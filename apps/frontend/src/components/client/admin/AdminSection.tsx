"use client"

import type { AdminPage } from "@repo/shared/types"
import { AdminTabBar, UnderConstructionCard } from "@repo/ui/components/Generic"
import { Button } from "@repo/ui/components/Primitive"
import { Container, TabPanel } from "@yamada-ui/react"
import { type FC, memo } from "react"

export interface AdminSectionProps {
  view: AdminPage
}

export const AdminSection: FC<AdminSectionProps> = memo(({ view }) => {
  return (
    <Container
      gap="xl"
      justifyContent={{ lg: "start" }}
      layerStyle="container"
      py={{ base: "md", sm: "md", lg: "md" }}
    >
      <AdminTabBar
        defaultValue={view}
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
