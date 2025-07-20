"use client"

import { bookingsMock } from "@repo/shared/mocks"
import {
  AdditionalInfo,
  AdditionalInfoFields,
  ProfileBookingPanel,
  ProfileDetails,
  ProfileDetailsFields,
  UserPanel,
} from "@repo/ui/components/Composite"
import { Center, Grid, GridItem, Loading, VStack } from "@yamada-ui/react"
import { redirect } from "next/navigation"
import { memo } from "react"
import { useAuth } from "@/context/AuthContext"

export const ProfileSection = memo(() => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Center minH="50vh">
        <Loading boxSize="sm" />
      </Center>
    )
  }

  if (!user || !user.firstName) {
    redirect("/auth/login")
  }

  return (
    <VStack gap="xl" maxW="1220px">
      <Grid gap="xl" templateColumns={{ base: "1fr", lg: "1fr 1.5fr" }}>
        <GridItem>
          <UserPanel user={user} />
        </GridItem>
        <GridItem>
          <ProfileBookingPanel bookings={bookingsMock} />
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
    </VStack>
  )
})

ProfileSection.displayName = "ProfileSection"
