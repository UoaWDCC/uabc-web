"use client"
import { MembershipType } from "@repo/shared"
import { UabcLogo } from "@repo/ui/components/Icon"
import { Box, HStack, Motion, Spacer } from "@yamada-ui/react"
import Link from "next/link"
import { memo } from "react"
import type { NavigationBarProps } from "./NavigationBar"
import { NavigationBarButton } from "./NavigationBarButton"
import { NavigationBarUserMenu } from "./NavigationBarUserMenu"

/**
 * NavigationBarDesktop component renders a navigation bar with links to different pages for use on desktop devices.
 *
 * @param navItems Array of navigation items with label and url.
 * @param rightSideSingleButton Button to display on the right side of the navigation bar.
 * @param user Optional user object containing user information if signed in.
 * @returns A navigation bar with links to different pages, an admin link if the user is an admin, and a user menu if the user is signed in.
 */
export const NavigationBarDesktop = ({
  navItems,
  rightSideSingleButton,
  user,
}: NavigationBarProps) => {
  const src = typeof user?.image === "string" ? user?.image : user?.image?.thumbnailURL || ""
  const admin = user?.role === MembershipType.admin

  return (
    <HStack
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        border: "1.5px solid transparent",
        background:
          "linear-gradient(15deg, rgba(0, 0, 0, 0) 35%, #FFFFFF 200%) border-box, rgba(255, 255, 255, 0.07) border-box",
        mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
      backdropBlur="xl"
      backdropFilter="auto"
      bgColor="rgba(0, 0, 0, 0.5)"
      borderRadius="150px"
      boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.10)"
      display={{ base: "none", md: "flex" }}
      gap={0}
      position="relative"
      px="lg"
      py="md"
      width="full"
      zIndex={1001}
    >
      <HStack as={Motion} gap="xs">
        <Box as={Link} borderRadius="50%" href="/" position="relative">
          <UabcLogo />
        </Box>
        <NavItems navItems={navItems} />
      </HStack>
      <Spacer />
      <Box>
        {user ? (
          <NavigationBarUserMenu admin={admin} avatarProps={{ name: user.firstName, src: src }} />
        ) : (
          <NavigationBarButton colorScheme="primary" {...rightSideSingleButton} />
        )}
      </Box>
    </HStack>
  )
}

const NavItems = memo(({ navItems }: { navItems: NavigationBarProps["navItems"] }) => {
  return (
    <HStack as={Motion} data-testid="navbar-buttons-container" gap={0}>
      {navItems.map((item) => (
        <Motion key={item.label}>
          <NavigationBarButton label={item.label} url={item.url} />
        </Motion>
      ))}
    </HStack>
  )
})

NavItems.displayName = "NavItems"
