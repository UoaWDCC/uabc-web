import { BadgeCheckIcon, CircleUserRoundIcon } from "@yamada-ui/lucide"
import type { IconProps } from "@yamada-ui/react"
import { type FC, memo } from "react"

export type UserStatus = "Member" | "Casual"

export interface StatusIconProps extends IconProps {
  status: UserStatus
}

export const StatusIcon: FC<StatusIconProps> = memo(({ status, ...props }) => {
  if (status === "Member") {
    return <BadgeCheckIcon {...props} />
  }
  return <CircleUserRoundIcon {...props} />
})

StatusIcon.displayName = "StatusIcon"
