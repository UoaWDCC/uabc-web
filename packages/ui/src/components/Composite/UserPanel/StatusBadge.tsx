import type { MembershipType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { Center, HStack, Text } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { StatusIcon } from "./StatusIcon"

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
  status: User["role"]
}

/**
 * StatusBadge component for displaying user membership status with an icon
 *
 * @param props StatusBadge component properties
 * @returns A status badge component with icon and text
 *
 * @example
 * // Member status badge
 * <StatusBadge status="member" />
 *
 * @example
 * // Casual status badge
 * <StatusBadge status="casual" />
 */
export const StatusBadge: FC<StatusBadgeProps> = memo(({ status }) => (
  <HStack as={Center} color={["primary.600", "primary.300"]} gap="xs">
    <StatusIcon status={status as MembershipType} />
    <Text>{status}</Text>
  </HStack>
))

StatusBadge.displayName = "StatusBadge"
