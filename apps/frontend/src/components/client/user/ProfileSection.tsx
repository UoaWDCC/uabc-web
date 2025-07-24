"use client"

import type { EditSelfData, Gender, PlayLevel } from "@repo/shared"
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
import type { AuthContextValue } from "@/context/AuthContext"
import { useUpdateSelfMutation } from "@/services/auth/useUpdateSelfMutation"
import { useMyBookings } from "@/services/bookings/BookingQuery"

export const ProfileSection = memo(({ auth }: { auth: AuthContextValue }) => {
  const { user } = auth
  const { data: bookings, isLoading: isBookingsLoading, isError: isBookingsError } = useMyBookings()
  const updateSelfMutation = useUpdateSelfMutation()

  return (
    <Container centerContent gap="xl" layerStyle="container">
      <Grid gap="xl" templateColumns={{ base: "1fr", lg: "1fr 1.5fr" }} w="full">
        <GridItem>{!user ? <UserPanelSkeleton /> : <UserPanel user={user} />}</GridItem>
        <GridItem>
          {isBookingsLoading || !user ? (
            <ProfileBookingPanelSkeleton />
          ) : (
            <ProfileBookingPanel
              bookings={bookings?.data ?? []}
              error={isBookingsError}
              user={user}
            />
          )}
        </GridItem>
      </Grid>

      {!user ? (
        <>
          <ProfileDetailsSkeleton />
          <AdditionalInfoSkeleton />
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
              // Only send allowed fields for PATCH /me
              const payload: EditSelfData = {
                firstName: data.firstName ?? undefined,
                lastName: data.lastName ?? undefined,
                phoneNumber: data.phoneNumber ?? undefined,
              }
              await updateSelfMutation.mutateAsync(payload)
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
              const payload: EditSelfData = {
                gender: data.gender as Gender,
                playLevel: data.playLevel as PlayLevel,
                dietaryRequirements: data.dietaryRequirements ?? undefined,
              }
              await updateSelfMutation.mutateAsync(payload)
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
