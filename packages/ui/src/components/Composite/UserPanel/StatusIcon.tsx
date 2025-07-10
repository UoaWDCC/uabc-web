import { MembershipType } from "@repo/shared"
import { BadgeCheckIcon, CircleUserRoundIcon, ShieldCheckIcon } from "@yamada-ui/lucide"
import type { IconProps } from "@yamada-ui/react"
import { type FC, memo } from "react"

/**
 * Props for {@link StatusIcon} component
 */
export interface StatusIconProps extends IconProps {
  /**
   * The user's membership status
   *
   * @remarks
   * Determines which icon to display:
   * - "Member": Shows a badge check icon
   * - "Casual": Shows a circle user icon
   */
  status: MembershipType
}

/**
 * StatusIcon component for displaying user membership status icons
 *
 * @param props StatusIcon component properties
 * @returns An icon component representing the user's status
 *
 * @example
 * // Member status icon
 * <StatusIcon status="Member" />
 *
 * @example
 * // Casual status icon with custom size
 * <StatusIcon status="Casual" fontSize="lg" />
 *
 * @example
 * // Member status icon with custom color
 * <StatusIcon status="Member" color="green.500" />
 */
export const StatusIcon: FC<StatusIconProps> = memo(({ status, ...props }) => {
  if (status === MembershipType.member) {
    return <BadgeCheckIcon {...props} />
  }
  if (status === MembershipType.casual) {
    return <CircleUserRoundIcon {...props} />
  }
  return <ShieldCheckIcon {...props} />
})

StatusIcon.displayName = "StatusIcon"
