import { Center, HStack, Text } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { StatusIcon, type UserStatus } from "./StatusIcon"

/**
 * Props for {@link StatusBadge} component
 */
export interface StatusBadgeProps {
  /**
   * The user's membership status
   *
   * @remarks
   * Determines which icon and styling to display.
   * Affects the visual representation of the user's status.
   */
  status: UserStatus
}

/**
 * StatusBadge component for displaying user membership status with an icon
 *
 * @param props StatusBadge component properties
 * @returns A status badge component with icon and text
 *
 * @example
 * // Member status badge
 * <StatusBadge status="Member" />
 *
 * @example
 * // Casual status badge
 * <StatusBadge status="Casual" />
 */
export const StatusBadge: FC<StatusBadgeProps> = memo(({ status }) => (
  <HStack as={Center} color={["primary.600", "primary.300"]} gap="xs">
    <StatusIcon status={status} />
    <Text>{status}</Text>
  </HStack>
))

StatusBadge.displayName = "StatusBadge"
