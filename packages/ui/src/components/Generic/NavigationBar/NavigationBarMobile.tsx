"use client"
import { MembershipType } from "@repo/shared"
import { UabcLogo } from "@repo/ui/components/Icon"
import { IconButton } from "@repo/ui/components/Primitive"
import { isPathActive } from "@repo/ui/utils/path"
import { MenuIcon, XIcon } from "@yamada-ui/lucide"
import {
  Box,
  Fade,
  HStack,
  Link,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  useDisclosure,
  VStack,
} from "@yamada-ui/react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import type { NavigationBarProps } from "./NavigationBar"

/**
 * NavigationBar component renders a navigation bar with links to different pages for mobile devices.
 *
 * @param navItems Array of navigation items with label and url.
 * @param rightSideSingleButton Button that is displayed on the right side of the navigation bar for desktop view.
 * @param user Optional user object containing user information if signed in.
 * @returns A navigation bar with links to different pages, an admin link if the user is an admin, and a user menu if the user is signed in.
 */
export const NavigationBarMobile = ({
  navItems,
  rightSideSingleButton,
  user,
}: NavigationBarProps) => {
  const currentPath = usePathname()

  const allNavItems = [
    ...(user
      ? [
          ...(user.role === MembershipType.admin ? [{ label: "Admin", url: "/admin" }] : []),
          { label: "Profile", url: "/profile" },
          { label: "Logout", url: "/auth/logout" },
        ]
      : [rightSideSingleButton || { label: "Login", url: "/auth/login" }]),
    ...navItems,
  ]

  const { open, onOpen, onClose } = useDisclosure()

  return (
    <Box display={{ base: "flex", md: "none" }} width="full">
      <Popover
        animation="top"
        closeOnButton={false}
        duration={0.35}
        gutter={16}
        onClose={onClose}
        onOpen={onOpen}
        open={open}
        placement="bottom"
      >
        <PopoverAnchor>
          <HStack
            _before={{
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              border: "2.5px solid transparent",
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
            gap={0}
            padding="md"
            position="relative"
            width="full"
            zIndex={1002}
          >
            <Link href="/">
              <UabcLogo height="36px" />
            </Link>
            <Spacer />
            <PopoverTrigger>
              <IconButton borderRadius="full" fontSize="24px" size="sm" variant="gradient">
                {open ? <XIcon /> : <MenuIcon />}
              </IconButton>
            </PopoverTrigger>
          </HStack>
        </PopoverAnchor>
        <PopoverContent
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
          borderRadius="3xl"
          padding="sm"
          width="100%"
          zIndex={1002}
        >
          <PopoverBody>
            <VStack gap="xs" minH="lg">
              {allNavItems.map((item) => (
                <Link
                  _hover={{ bgColor: "secondary" }}
                  as={NextLink}
                  borderRadius="xl"
                  color={isPathActive(currentPath, item.url) ? "primary" : "white"}
                  fontSize="xl"
                  fontWeight="semibold"
                  href={item.url}
                  key={item.label}
                  onClick={onClose}
                  px="md"
                  py="sm"
                >
                  {item.label}
                </Link>
              ))}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Fade
        bgColor="rgba(0, 0, 0, 0.4)"
        data-testid="navbar-mobile-backdrop"
        duration={0.35}
        inset={0}
        open={open}
        pointerEvents={open ? "auto" : "none"}
        position="fixed"
        width="100vw"
        zIndex={99}
      />
    </Box>
  )
}
