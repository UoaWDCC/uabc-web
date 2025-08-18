"use client"

import { MembershipType } from "@repo/shared"
import type { Booking, GameSession, GameSessionSchedule, User } from "@repo/shared/payload-types"
import { CircleAlertIcon } from "@yamada-ui/lucide"
import { EmptyState, For, type StackProps, VStack } from "@yamada-ui/react"
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
  /**
   * Whether there was an error fetching bookings
   */
  error?: boolean
  /**
   * The user viewing the bookings (for role-based UI)
   */
  user?: User
  /**
   * Callback function to handle booking deletion
   */
  onDeleteBooking?: (bookingId: string) => Promise<void>
}

/**
 * ProfileBookingPanel component for displaying bookings in the user profile page.
 *
 * @param Props for the ProfileBookingPanel component
 * @returns The ProfileBookingPanel component
 *
 * @example
 * <ProfileBookingPanel bookings={mockBookings} />
 */
export const ProfileBookingPanel: FC<ProfileBookingPanelProps> = memo(
  ({ bookings, error, user, onDeleteBooking, ...props }) => {
    const isDeleteDisabled =
      user && (user.role === MembershipType.casual || user.role === MembershipType.member)

    const handleDelete = async (bookingId: string) => {
      if (onDeleteBooking) {
        await onDeleteBooking(bookingId)
      }
    }

    return (
      <VStack
        bg={["secondary.50", "secondary.900"]}
        layerStyle="gradientBorder"
        p="xl"
        rounded="2xl"
        {...props}
      >
        <Heading.h3>Your Bookings</Heading.h3>
        <For
          each={error ? [] : bookings}
          fallback={
            error ? (
              <EmptyState
                description="Failed to load your bookings. Please try again later."
                indicator={<CircleAlertIcon />}
                title="Failed to load bookings"
              />
            ) : (
              <EmptyState
                description="You have not made any bookings yet."
                indicator={<CircleAlertIcon />}
                title="No bookings found"
              />
            )
          }
        >
          {({ id, gameSession }) => {
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
                  {
                    label: "Delete",
                    onClick: () => handleDelete(id),
                    color: "danger",
                    disabled: isDeleteDisabled,
                    tooltipLabel: isDeleteDisabled
                      ? "Please contact an admin to delete your booking"
                      : undefined,
                  },
                ]}
                startTime={startTime}
              />
            )
          }}
        </For>
      </VStack>
    )
  },
)

ProfileBookingPanel.displayName = "ProfileBookingPanel"
