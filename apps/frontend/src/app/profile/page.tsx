import { casualUserMock, mockBookings } from "@repo/shared/mocks"
import { MembershipType } from "@repo/shared/types"
import {
  defaultFields,
  ProfileBookingPanel,
  ProfileDetails,
  UserPanel,
} from "@repo/ui/components/Composite"
import { Grid, GridItem, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
  title: "User Profile | UABC",
  description: "TODO",
  openGraph: {
    title: "User Profile | UABC",
    description: "TODO",
    url: process.env.NEXT_PUBLIC_URL,
    siteName: "UABC",
    locale: "en-NZ",
    type: "website",
  },
}
export default async function Profile() {
  // TODO: use auth context
  const user = casualUserMock

  return (
    <VStack gap="xl" maxW="1220px">
      <Grid gap="2xl" templateColumns="0.5fr 1fr">
        <GridItem>
          <UserPanel
            email={user.email}
            h="full"
            name={`${user.firstName} ${user.lastName}`}
            phone={user.phoneNumber ?? "-"}
            sessionsLeft={user.remainingSessions ?? 0}
            status={MembershipType.member}
          />
        </GridItem>
        <GridItem>
          <ProfileBookingPanel bookings={mockBookings} h="full" />
        </GridItem>
      </Grid>

      <ProfileDetails fields={defaultFields} title={"Profile Details"} w="full" />

      <ProfileDetails fields={defaultFields} title={"Profile Details"} w="full" />
    </VStack>
  )
}

Profile.displayName = "Profile"
