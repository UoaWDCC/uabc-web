import { Heading } from "@repo/ui/components/Primitive"
import { LogOutIcon, UserIcon } from "@yamada-ui/lucide"
import {
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuSeparator,
  Text,
} from "@yamada-ui/react"
import Link from "next/link"

export const NavigationBarUserMenu = ({ user }: { user: Record<string, string> }) => {
  return (
    <Menu placement="bottom-end" trigger="hover">
      <MenuButton>
        <Avatar cursor="pointer" data-testid="navbar-user-menu-avatar" {...user} />
      </MenuButton>
      <MenuList>
        <Heading.h5 paddingX="calc(md - xs)" paddingY="xs">
          {user.name}
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
