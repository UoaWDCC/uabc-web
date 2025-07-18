"use client"

import type { Booking, GameSession, GameSessionSchedule } from "@repo/shared/payload-types"
import { VStack } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { BookingCard } from "../../Generic"
import { Heading } from "../../Primitive"

export interface ProfileBookingPanelProps {
  bookings: Booking[]
}

export const ProfileBookingPanel: FC<ProfileBookingPanelProps> = memo(({ bookings }) => {
  return (
    <VStack bg={["gray.50", "gray.950"]} layerStyle="gradientBorder" p="xl" rounded="2xl">
      <Heading.h3>Your Bookings</Heading.h3>
      {bookings.map(({ id, gameSession }, index) => {
        const { gameSessionSchedule, startTime, endTime, location } = gameSession as GameSession

        return (
          <BookingCard
            address={"address?"}
            day={(gameSessionSchedule as GameSessionSchedule).day}
            endTime={endTime}
            imageProps={{
              src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
              alt: "Mountain Lake",
              width: 600,
              height: 400,
            }}
            key={id}
            location={location ?? (gameSessionSchedule as GameSessionSchedule).location}
            menuItems={[]}
            startTime={startTime}
          />
        )
      })}
    </VStack>
  )
})
