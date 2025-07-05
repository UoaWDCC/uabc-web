"use client"
import { UabcLogo } from "@repo/ui/components/Icon"
import { Center, HStack, Motion, Spacer, ui } from "@yamada-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"
import { NavigationBarButton } from "./NavigationBarButton"
import { NavigationBarUserMenu } from "./NavigationBarUserMenu"

const StyledLink = ui(Link)

interface NavigationBarProps {
  navItems: Array<{ label: string; path: string }>
  admin?: boolean
  user?: Record<string, string> // TODO: replace with actual user type/ type based on actual user type
}

export const NavigationBar = ({ navItems, admin = false, user }: NavigationBarProps) => {
  const currentPath = usePathname()

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
    <Center marginBlockStart="md" padding="md" position="sticky" top={0} width="full">
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
        maxWidth="1220px"
        paddingX="lg"
        paddingY="md"
        position="relative"
        width="full"
      >
        <HStack as={Motion} gap="none">
          <StyledLink borderRadius="50%" href="/" padding="sm" position="relative" zIndex="1">
            <UabcLogo />
          </StyledLink>
          <HStack
            as={Motion}
            data-testid="navbar-buttons-container"
            gap="none"
            onHoverEnd={clearHover}
          >
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
        <HStack as={Motion} gap="md">
          {admin && (
            <NavigationBarButton
              colorScheme="tertiary"
              hovering={hoveredIndex === navItems.length}
              label="Admin"
              path="/admin"
            />
          )}
          {user ? (
            <NavigationBarUserMenu avatarProps={user} />
          ) : (
            <NavigationBarButton colorScheme="primary" label="Sign In" path="/signin" />
          )}
        </HStack>
      </HStack>
    </Center>
  )
}
