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
    // <Popover closeOnButton={false} placement="bottom-end" trigger="click">
    //   <PopoverTrigger>
    //     <Avatar data-testid="navbar-user-popover-avatar" {...user} />
    //   </PopoverTrigger>
    //   <PopoverContent>
    //     <PopoverHeader maxWidth="xs">
    //       <Text fontWeight="bold" textAlign="end" width="full">
    //         {user.name}
    //       </Text>
    //     </PopoverHeader>
    //     <PopoverBody marginY="sm" maxWidth="xs" paddingX="none">
    //       <VStack align="end" gap="sm">
    //         <HStack
    //           _hover={{ backgroundColor: "gray.950" }}
    //           as={Link}
    //           data-testid="navbar-user-popover-profile-link"
    //           href="/profile"
    //           justify="space-between"
    //           paddingX="md"
    //           paddingY="sm"
    //           transition="all 0.25s ease-in-out"
    //           width="full"
    //         >
    //           <UserIcon />
    //           <Text>Profile</Text>
    //         </HStack>
    //         <HStack
    //           _hover={{ backgroundColor: "gray.950" }}
    //           as={Link}
    //           data-testid="navbar-user-popover-signout-link"
    //           href="/signout"
    //           justify="space-between"
    //           paddingX="md"
    //           paddingY="sm"
    //           transition="all 0.25s ease-in-out"
    //           width="full"
    //         >
    //           <LogOutIcon />
    //           <Text>Sign Out</Text>
    //         </HStack>
    //       </VStack>
    //     </PopoverBody>
    //   </PopoverContent>
    // </Popover>
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
