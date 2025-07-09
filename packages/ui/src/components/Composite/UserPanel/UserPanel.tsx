import { ShuttleIcon } from "@repo/ui/components/Icon"
import { PencilIcon } from "@yamada-ui/lucide"
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  type CardProps,
  Center,
  Float,
  IconButton,
  type IconButtonProps,
  Text,
  VStack,
} from "@yamada-ui/react"
import type { FC } from "react"
import { InfoField } from "./InfoField"
import { StatusBadge } from "./StatusBadge"
import type { UserStatus } from "./StatusIcon"

export interface UserPanelProps extends CardProps {
  /**
   * User's profile image URL
   */
  avatarSrc?: string
  /**
   * User's display name
   */
  name: string
  /**
   * User's membership status
   */
  status: UserStatus
  /**
   * User's email address
   */
  email: string
  /**
   * User's phone number
   */
  phone: string
  /**
   * Number of sessions remaining
   */
  sessionsLeft: number
  /**
   * Props for the edit icon button
   */
  iconButtonProps?: IconButtonProps
}

export const UserPanel: FC<UserPanelProps> = ({
  avatarSrc,
  name,
  status,
  email,
  phone,
  sessionsLeft,
  iconButtonProps,
  ...props
}) => {
  return (
    <Card
      bg={["gray.50", "gray.950"]}
      layerStyle="gradientBorder"
      rounded="2xl"
      size="lg"
      {...props}
    >
      <CardHeader as={Center} flexDir="column" textAlign="center">
        <Box position="relative">
          <Avatar name={name} size="xl" src={avatarSrc} />
          <Float offset={[4, 4]} placement="end-end">
            <IconButton
              aria-label="Edit"
              icon={<PencilIcon />}
              rounded="full"
              size="sm"
              {...iconButtonProps}
            />
          </Float>
        </Box>
        <VStack gap="xs">
          <Text fontSize="xl">{name}</Text>
          <StatusBadge status={status} />
        </VStack>
      </CardHeader>
      <CardBody gap="md">
        <InfoField label="Email" value={email} />
        <InfoField label="Phone" value={phone} />
      </CardBody>
      <CardFooter gap="sm" justifyContent="center">
        <ShuttleIcon fontSize="sm" />
        <Text fontSize="sm">Sessions left: {sessionsLeft}</Text>
      </CardFooter>
    </Card>
  )
}

UserPanel.displayName = "UserPanel"
