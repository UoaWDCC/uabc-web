import { Center, HStack, Text } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { StatusIcon, type UserStatus } from "./StatusIcon"

export interface StatusBadgeProps {
  status: UserStatus
}

export const StatusBadge: FC<StatusBadgeProps> = memo(({ status }) => (
  <HStack as={Center} color={["primary.600", "primary.300"]} gap="xs">
    <StatusIcon status={status} />
    <Text>{status}</Text>
  </HStack>
))

StatusBadge.displayName = "StatusBadge"
