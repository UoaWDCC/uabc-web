"use client"

import { isGender, isPlayLevel } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
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
import { useUpdateSelfMutation } from "@/services/auth/AuthMutation"
import { useMyBookings } from "@/services/bookings/BookingQueries"

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
              const payload: Partial<Pick<User, "firstName" | "lastName" | "phoneNumber">> = {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
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
              const payload: Partial<User> = {
                gender: isGender(data.gender) ?? null,
                playLevel: isPlayLevel(data.playLevel) ?? null,
                dietaryRequirements: data.dietaryRequirements,
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
