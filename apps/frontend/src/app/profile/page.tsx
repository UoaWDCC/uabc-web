import { bookingsMock, casualUserMock } from "@repo/shared/mocks"
import type { MembershipType } from "@repo/shared/types"
import {
  AdditionalInfo,
  AdditionalInfoFields,
  ProfileBookingPanel,
  ProfileDetails,
  ProfileDetailsFields,
  UserPanel,
} from "@repo/ui/components/Composite"
import { Grid, GridItem, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
  title: "User Profile | UABC",
  description: "Edit your profile details and view your bookings.",
  openGraph: {
    title: "User Profile | UABC",
    description: "Edit your profile details and view your bookings.",
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
      <Grid gap="xl" templateColumns="0.5fr 1fr">
        <GridItem>
          <UserPanel
            email={user.email}
            name={`${user.firstName} ${user.lastName}`}
            phone={user.phoneNumber ?? "--"}
            sessionsLeft={user.remainingSessions ?? 0}
            status={user.role as MembershipType}
          />
        </GridItem>
        <GridItem>
          <ProfileBookingPanel bookings={bookingsMock} h="full" />
        </GridItem>
      </Grid>

      <ProfileDetails
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        }}
        fields={ProfileDetailsFields}
        title="Profile Details"
        w="full"
      />

      <AdditionalInfo
        defaultValues={{
          gender: user.gender ?? undefined,
          playLevel: user.playLevel ?? undefined,
          dietary: user.dietaryRequirements,
        }}
        fields={AdditionalInfoFields}
        title="Additional Info"
        w="full"
      />
    </VStack>
  )
}

Profile.displayName = "Profile"
