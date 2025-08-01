"use client"
import type { Navbar, User } from "@repo/shared/payload-types"
import { Container } from "@yamada-ui/react"
import { NavigationBarDesktop } from "./NavigationBarDesktop"
import { NavigationBarMobile } from "./NavigationBarMobile"

/**
 * Props for the NavigationBar component.
 */
export interface NavigationBarProps extends Omit<Navbar, "id"> {
  user?: User | null
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
    <Container
      as="nav"
      centerContent
      gap="0"
      layerStyle="container"
      pb={{ base: "0", sm: "0", md: "0" }}
      position="sticky"
      pt={{ base: "lg", md: "lg" }}
      top="0"
      w="full"
      zIndex={100}
    >
      <NavigationBarDesktop {...props} user={user} />
      <NavigationBarMobile {...props} user={user} />
    </Container>
  )
}
