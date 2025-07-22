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
import { useRouter } from "next/navigation"
import { memo, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useMyBookings } from "@/services/bookings/BookingQuery"

export const ProfileSection = memo(() => {
  const { user, isLoading, isPending } = useAuth()
  const { data: bookings, isLoading: isBookingsLoading, isError: isBookingsError } = useMyBookings()
  const router = useRouter()

  // useEffect is necessary here to ensure navigation (router.push) only occurs after render,
  // not during render. React does not allow side effects like navigation during render phase.
  // This follows React and Next.js best practices for safe, predictable navigation if the user is not logged in.
  useEffect(() => {
    if (!isLoading && !isPending && !user) {
      router.push("/auth/login")
    }
  }, [isLoading, isPending, user, router])

  return (
    <Container centerContent gap="xl" layerStyle="container">
      <Grid gap="xl" templateColumns={{ base: "1fr", lg: "1fr 1.5fr" }} w="full">
        <GridItem>
          {isLoading || isPending || !user ? <UserPanelSkeleton /> : <UserPanel user={user} />}
        </GridItem>
        <GridItem>
          {isBookingsLoading || !user ? (
            <ProfileBookingPanelSkeleton />
          ) : (
            <ProfileBookingPanel bookings={bookings?.data ?? []} error={isBookingsError} />
          )}
        </GridItem>
      </Grid>

      {isLoading || isPending || !user ? (
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
