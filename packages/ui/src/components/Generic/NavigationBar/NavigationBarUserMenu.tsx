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

export interface NavigationBarUserMenuProps extends MenuProps {
  avatarProps: AvatarProps
}

export const NavigationBarUserMenu = ({ avatarProps, ...props }: NavigationBarUserMenuProps) => {
  return (
    <Menu placement="bottom-end" trigger="hover" {...props}>
      <MenuButton>
        <Avatar cursor="pointer" data-testid="navbar-user-menu-avatar" {...avatarProps} />
      </MenuButton>
      <MenuList>
        <Heading.h5 paddingX="calc(md - xs)" paddingY="xs">
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
