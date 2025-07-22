"use client"

import {
  AdditionalInfo,
  AdditionalInfoFields,
  AdditionalInfoSkeleton,
  ProfileBookingPanel,
  ProfileBookingPanelSkeleton,
  ProfileDetails,
  ProfileDetailsFields,
  ProfileDetailsSkeleton,
  UserPanel,
  UserPanelSkeleton,
} from "@repo/ui/components/Composite"
import { Container, Grid, GridItem } from "@yamada-ui/react"
import { memo } from "react"
import type { AuthContextType } from "@/context/AuthContext"
import { useMyBookings } from "@/services/bookings/BookingQuery"

export const ProfileSection = memo(({ auth }: { auth: AuthContextType }) => {
  const { user, isLoading } = auth
  const { data: bookings, isLoading: isBookingsLoading, isError: isBookingsError } = useMyBookings()

  return (
    <Container centerContent gap="xl" layerStyle="container">
      <Grid gap="xl" templateColumns={{ base: "1fr", lg: "1fr 1.5fr" }} w="full">
        <GridItem>
          {isLoading || !user ? <UserPanelSkeleton /> : <UserPanel user={user} />}
        </GridItem>
        <GridItem>
          {isBookingsLoading || !user ? (
            <ProfileBookingPanelSkeleton />
          ) : (
            <ProfileBookingPanel bookings={bookings?.data ?? []} error={isBookingsError} />
          )}
        </GridItem>
      </Grid>

      {isLoading || !user ? (
        <>
          <AdditionalInfoSkeleton />
          <ProfileDetailsSkeleton />
        </>
      ) : (
        <>
          <ProfileDetails
            defaultValues={{
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
            }}
            fields={ProfileDetailsFields}
            onSave={async (data) => {
              // TODO: Implement update user mutation
              console.log(data)
            }}
            title="Profile Details"
            w="full"
          />
          <AdditionalInfo
            defaultValues={{
              gender: user.gender,
              playLevel: user.playLevel,
              dietaryRequirements: user.dietaryRequirements,
            }}
            fields={AdditionalInfoFields}
            onSave={async (data) => {
              // TODO: Implement update user mutation
              console.log(data)
            }}
            title="Additional Info"
            w="full"
          />
        </>
      )}
    </Container>
  )
})

ProfileSection.displayName = "ProfileSection"
