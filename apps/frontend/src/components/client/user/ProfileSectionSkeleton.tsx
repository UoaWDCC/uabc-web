import {
  AdditionalInfoSkeleton,
  ProfileBookingPanelSkeleton,
  ProfileDetailsSkeleton,
  UserPanelSkeleton,
} from "@repo/ui/components/Composite"
import { Container, Grid, GridItem } from "@yamada-ui/react"

export const ProfileSectionSkeleton = () => {
  return (
    <Container centerContent gap="xl" layerStyle="container">
      <Grid gap="xl" templateColumns={{ base: "1fr", lg: "1fr 1.5fr" }} w="full">
        <GridItem>
          <UserPanelSkeleton />
        </GridItem>
        <GridItem>
          <ProfileBookingPanelSkeleton />
        </GridItem>
      </Grid>
      <ProfileDetailsSkeleton />
      <AdditionalInfoSkeleton />
    </Container>
  )
}
