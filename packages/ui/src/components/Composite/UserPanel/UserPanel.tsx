import type { MembershipType } from "@repo/shared"
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

/**
 * Props for {@link UserPanel} component
 */
export interface UserPanelProps extends CardProps {
  /**
   * User's profile image URL
   *
   * @remarks
   * If not provided, the avatar will display the user's initials.
   * Should be a valid image URL or data URI.
   */
  avatarSrc?: string
  /**
   * User's display name
   *
   * @remarks
   * This is the primary identifier displayed prominently in the panel.
   * Used for avatar fallback if no image is provided.
   */
  name: string
  /**
   * User's membership status
   *
   * @remarks
   * Determines the status badge and icon displayed.
   * Affects the visual styling of the status indicator.
   */
  status: MembershipType
  /**
   * User's email address
   *
   * @remarks
   * Displayed in the info section of the panel.
   * Should be a valid email format for proper display.
   */
  email: string
  /**
   * User's phone number
   *
   * @remarks
   * Displayed in the info section of the panel.
   * Should be formatted for readability.
   */
  phone: string
  /**
   * Number of sessions remaining
   *
   * @remarks
   * Displayed in the footer with a shuttle icon.
   * Represents the user's remaining session count.
   */
  sessionsLeft: number
  /**
   * Props for the edit icon button
   *
   * @remarks
   * Allows customization of the edit button that appears on the avatar.
   * Common use cases include onClick handlers and accessibility props.
   */
  iconButtonProps?: IconButtonProps
}

/**
 * UserPanel component for displaying user information in a card format
 *
 * @param props UserPanel component properties
 * @returns A user information panel component
 *
 * @example
 * // Basic user panel
 * <UserPanel
 *   name="John Doe"
 *   status="Member"
 *   email="john@example.com"
 *   phone="+1 234 567 8900"
 *   sessionsLeft={5}
 * />
 *
 * @example
 * // User panel with avatar and edit functionality
 * <UserPanel
 *   avatarSrc="https://example.com/avatar.jpg"
 *   name="Jane Smith"
 *   status="Casual"
 *   email="jane@example.com"
 *   phone="+1 234 567 8901"
 *   sessionsLeft={0}
 *   iconButtonProps={{
 *     onClick: () => handleEdit(),
 *     "aria-label": "Edit user profile"
 *   }}
 * />
 */
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
      bg={["secondary.50", "secondary.900"]}
      layerStyle="gradientBorder"
      p={{ base: "md", md: "0", lg: "md" }}
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
      <CardBody alignItems="center" gap="md">
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
