import { AdminTabBar, UnderConstructionCard } from "@repo/ui/components/Generic"
import { Container, TabPanel } from "@yamada-ui/react"
import { memo } from "react"

export const AdminSection = memo(() => {
  return (
    <Container centerContent gap="xl" layerStyle="container">
      <AdminTabBar>
        <TabPanel>
          <Container centerContent layerStyle="container">
            <UnderConstructionCard />
          </Container>
        </TabPanel>
        <TabPanel>
          <Container centerContent layerStyle="container">
            <UnderConstructionCard />
          </Container>
        </TabPanel>
        <TabPanel>
          <Container centerContent layerStyle="container">
            <UnderConstructionCard />
          </Container>
        </TabPanel>
      </AdminTabBar>
    </Container>
  )
})
