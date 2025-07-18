"use client"

import type { Booking, GameSession, GameSessionSchedule } from "@repo/shared/payload-types"
import { type StackProps, VStack } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { BookingCard, type BookingCardProps } from "../../Generic"
import { Heading } from "../../Primitive"

/**
 * Props for {@link ProfileBookingPanel} component
 */
export interface ProfileBookingPanelProps extends StackProps {
  /**
   * Array of bookings to display
   */
  bookings: Booking[]
  /**
   * Props for the {@link BookingCard} components
   */
  bookingCardProps?: BookingCardProps
}

/**
 * ProfileBookingPanel component for displaying bookings in the user profile page.
 *
 * @params Props for the ProfileBookingPanel component
 * @returns The ProfileBookingPanel component
 *
 * @example
 * <ProfileBookingPanel bookings={mockBookings} />
 */
export const ProfileBookingPanel: FC<ProfileBookingPanelProps> = memo(({ bookings, ...props }) => {
  return (
    <VStack
      bg={["secondary.50", "secondary.900"]}
      layerStyle="gradientBorder"
      p="xl"
      rounded="2xl"
      {...props}
    >
      <Heading.h3>Your Bookings</Heading.h3>
      {bookings.map(({ id, gameSession }, _) => {
        const { gameSessionSchedule, startTime, endTime, location, name } =
          gameSession as GameSession

        return (
          <BookingCard
            address={location ?? (gameSessionSchedule as GameSessionSchedule).location}
            data-testid="booking-card"
            day={(gameSessionSchedule as GameSessionSchedule).day}
            endTime={endTime}
            imageProps={{
              // TODO: replace image mock
              src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
              alt: "Mountain Lake",
              width: 600,
              height: 400,
            }}
            key={id}
            location={name ?? (gameSessionSchedule as GameSessionSchedule).name}
            menuItems={[
              { label: "Edit", onClick: () => alert("Edit clicked"), color: "primary" },
              { label: "Delete", onClick: () => alert("Delete clicked"), color: "danger" },
            ]}
            startTime={startTime}
          />
        )
      })}
    </VStack>
  )
})
