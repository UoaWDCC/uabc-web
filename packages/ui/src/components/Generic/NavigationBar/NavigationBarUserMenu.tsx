import { Heading } from "@repo/ui/components/Primitive"
import { LogOutIcon, UserIcon } from "@yamada-ui/lucide"
import {
  Avatar,
  type AvatarProps,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  type MenuProps,
  MenuSeparator,
  Text,
} from "@yamada-ui/react"
import Link from "next/link"

/**
 * Props for the NavigationBarUserMenu component.
 */
export interface NavigationBarUserMenuProps extends MenuProps {
  /**
   * Props for the avatar component, including name and image source.
   */
  avatarProps: AvatarProps
}

/**
 * NavigationBarUserMenu component renders a user menu with an avatar and options for profile and sign out.
 *
 * @param avatarProps Props for the avatar component, including name and image source.
 * @param props Additional props for the menu component.
 * @returns A user menu with an avatar and options for profile and sign out.
 */
export const NavigationBarUserMenu = ({ avatarProps, ...props }: NavigationBarUserMenuProps) => {
  return (
    <Menu placement="bottom-end" trigger="hover" {...props}>
      <MenuButton>
        <Avatar cursor="pointer" data-testid="navbar-user-menu-avatar" {...avatarProps} />
      </MenuButton>
      <MenuList>
        <Heading.h5 px="calc(md - xs)" py="xs">
          {avatarProps.name}
        </Heading.h5>
        <MenuSeparator />
        <MenuItem as={Link} data-testid="navbar-user-menu-profile-link" href="/profile">
          <HStack>
            <UserIcon />
            <Text fontSize="md">Profile</Text>
          </HStack>
        </MenuItem>
        <MenuItem as={Link} data-testid="navbar-user-menu-signout-link" href="/signout">
          <HStack>
            <LogOutIcon />
            <Text>Sign Out</Text>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
