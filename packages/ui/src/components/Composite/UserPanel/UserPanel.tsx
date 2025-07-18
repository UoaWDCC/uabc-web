import type { Media, User } from "@repo/shared/payload-types"
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
 * Extracts the URL from an image property that can be either a string or Media object
 */
const getImageUrl = (image: Media): string | undefined => {
  if (!image) return undefined
  if (typeof image === "string") return image
  return image.url ?? undefined
}

/**
 * Props for {@link UserPanel} component
 */
export interface UserPanelProps extends CardProps {
  /**
   * The user to display
   */
  user: User
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
export const UserPanel: FC<UserPanelProps> = ({ user, iconButtonProps, ...props }) => {
  const { firstName, lastName, role, email, phoneNumber, remainingSessions, image } = user
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
          <Avatar name={firstName} size="xl" src={getImageUrl(image)} />
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
          <Text fontSize="xl">
            {firstName} {lastName}
          </Text>
          <StatusBadge status={role} />
        </VStack>
      </CardHeader>
      <CardBody gap="md">
        <InfoField label="Email" value={email} />
        <InfoField label="Phone" value={phoneNumber} />
      </CardBody>
      <CardFooter gap="sm" justifyContent="center">
        <ShuttleIcon fontSize="sm" />
        <Text fontSize="sm">Sessions left: {remainingSessions}</Text>
      </CardFooter>
    </Card>
  )
}

UserPanel.displayName = "UserPanel"
