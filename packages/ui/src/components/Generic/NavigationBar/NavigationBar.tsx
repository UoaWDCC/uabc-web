"use client"
import type { User } from "@repo/shared/payload-types"
import { Center } from "@yamada-ui/react"
import { NavigationBarDesktop } from "./NavigationBarDesktop"
import { NavigationBarMobile } from "./NavigationBarMobile"

/**
 * Props for the NavigationBar component.
 */
export interface NavigationBarProps {
  navItems: Array<{ label: string; path: string }>
  user?: User
}

/**
 * NavigationBar component renders a navigation bar with links to different pages, sized to match the viewport width.
 *
 * @param navItems Array of navigation items with label and path.
 * @param user Optional user object containing user information if signed in.
 * @returns A navigation bar with links to different pages, an admin link if the user is an admin, and a user menu if the user is signed in.
 */
export const NavigationBar = ({ navItems, user }: NavigationBarProps) => {
  return (
    <Center
      height="fit-content"
      marginBlockStart="lg"
      padding="md"
      position="sticky"
      top={0}
      width="full"
      zIndex={1002}
    >
      <NavigationBarDesktop navItems={navItems} user={user} />
      <NavigationBarMobile navItems={navItems} user={user} />
    </Center>
  )
}
