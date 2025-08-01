import { AdminTabBar, UnderConstructionCard } from "@repo/ui/components/Generic"
import { Container, TabPanel } from "@yamada-ui/react"
import { memo } from "react"
import type { AuthContextValue } from "@/context/AuthContext"

export const AdminSection = memo(({ auth }: { auth: AuthContextValue }) => {
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
