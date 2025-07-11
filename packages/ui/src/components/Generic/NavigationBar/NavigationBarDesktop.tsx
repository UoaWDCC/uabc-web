"use client"
import { MembershipType } from "@repo/shared"
import { UabcLogo } from "@repo/ui/components/Icon"
import { Box, HStack, Motion, Spacer, ui } from "@yamada-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"
import type { NavigationBarProps } from "./NavigationBar"
import { NavigationBarButton } from "./NavigationBarButton"
import { NavigationBarUserMenu } from "./NavigationBarUserMenu"

const StyledLink = ui(Link)

/**
 * NavigationBarDesktop component renders a navigation bar with links to different pages for use on desktop devices.
 *
 * @param navItems Array of navigation items with label and path.
 * @param user Optional user object containing user information if signed in.
 * @returns A navigation bar with links to different pages, an admin link if the user is an admin, and a user menu if the user is signed in.
 */
export const NavigationBarDesktop = ({ navItems, user }: NavigationBarProps) => {
  const currentPath = usePathname()

  const fullName = `${user?.firstName} ${user?.lastName}`.trim()
  const src = typeof user?.image === "string" ? user?.image : user?.image?.thumbnailURL || ""
  const admin = user?.role === MembershipType.admin

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(() => {
    const initialIndex = navItems.findIndex((item) => item.path === currentPath)
    return initialIndex !== -1 ? initialIndex : null
  })
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const activeRef = useRef<HTMLAnchorElement | null>(null)

  const handleHover = (index: number) => {
    setHoveredIndex(index)
    const el = itemRefs.current[index]
    if (el) {
      activeRef.current = el
    }
  }

  const clearHover = () => {
    const initialIndex = navItems.findIndex((item) => item.path === currentPath)
    setHoveredIndex(initialIndex !== -1 ? initialIndex : null)
  }

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
      maxWidth="1220px"
      position="relative"
      px="lg"
      py="md"
      width="full"
      zIndex={1001}
    >
      <HStack as={Motion} gap={0}>
        <StyledLink borderRadius="50%" href="/" padding="sm" position="relative" zIndex="1">
          <UabcLogo />
        </StyledLink>
        <HStack as={Motion} data-testid="navbar-buttons-container" gap={0} onHoverEnd={clearHover}>
          {navItems.map((item, index) => (
            <Motion key={item.label} onHoverStart={() => handleHover(index)}>
              <NavigationBarButton
                {...item}
                hovering={hoveredIndex === index}
                ref={(el) => {
                  itemRefs.current[index] = el
                  if (item.path === currentPath && !activeRef.current) {
                    activeRef.current = el
                  }
                }}
              />
            </Motion>
          ))}
        </HStack>
      </HStack>
      <Spacer />
      <Box>
        {user ? (
          <NavigationBarUserMenu admin={admin} avatarProps={{ name: fullName, src: src }} />
        ) : (
          <NavigationBarButton colorScheme="primary" label="Sign In" path="/signin" />
        )}
      </Box>
    </HStack>
  )
}
