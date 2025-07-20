"use client"
import type { Navbar, User } from "@repo/shared/payload-types"
import { Center } from "@yamada-ui/react"
import { NavigationBarDesktop } from "./NavigationBarDesktop"
import { NavigationBarMobile } from "./NavigationBarMobile"

/**
 * Props for the NavigationBar component.
 */
export interface NavigationBarProps extends Omit<Navbar, "id"> {
  user?: User
}

/**
 * NavigationBar component renders a navigation bar with links to different pages, sized to match the viewport width.
 *
 * @param user Optional user object containing user information if signed in.
 * @param props NavigationBar component properties including navigation items, right side button, and logo.
 * @returns A navigation bar with links to different pages, an admin link if the user is an admin, and a user menu if the user is signed in.
 */
export const NavigationBar = ({ user, ...props }: NavigationBarProps) => {
  return (
    <Center
      as="nav"
      height="fit-content"
      maxW="8xl"
      placeSelf="center"
      position="sticky"
      pt="lg"
      top="0"
      width="full"
      zIndex={100}
    >
      <NavigationBarDesktop {...props} user={user} />
      <NavigationBarMobile {...props} user={user} />
    </Center>
  )
}
