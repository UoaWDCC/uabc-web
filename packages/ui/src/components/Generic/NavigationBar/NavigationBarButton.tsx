"use client"
import { Button } from "@repo/ui/components/Primitive"
import { isPathActive } from "@repo/ui/utils/path"
import {
  AnimatePresence,
  Box,
  type ButtonProps,
  forwardRef,
  Motion,
  mergeRefs,
  useHover,
} from "@yamada-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { memo, useMemo } from "react"

/**
 * Props for the NavigationBarButton component.
 */
interface NavigationBarButtonProps extends ButtonProps {
  label: string
  url: string
}

/**
 * NavigationBarButton component renders a button with a label and a link.
 * It also displays a hover indicator when the button is hovered.
 *
 * @param label The label of the button.
 * @param url The url to navigate to when the button is clicked.
 * @param hovering Optional boolean to indicate if the hover indicator should be shown.
 * @param colorScheme Optional color scheme for the button.
 * @param props Additional props for the button component.
 * @param ref Ref to the button element.
 * @returns A button with a label and a link, with an optional hover indicator.
 */
export const NavigationBarButton = memo(
  forwardRef<NavigationBarButtonProps, "a">(({ label, url, colorScheme, ...props }, ref) => {
    const currentPath = usePathname()
    const active = isPathActive(currentPath, url)
    const { hovered, ref: hoverRef } = useHover()
    const mergedRef = mergeRefs(ref, hoverRef)

    const showIndicator = useMemo(() => {
      return hovered || active
    }, [hovered, active])

    return (
      <Box position="relative">
        <AnimatePresence mode="wait">
          {showIndicator && <NavigationBarHoverIndicator key="indicator" />}
        </AnimatePresence>
        <Button
          as={Link}
          borderRadius="150px"
          colorScheme={colorScheme}
          fontSize="lg"
          href={url}
          position="relative"
          px="md"
          ref={mergedRef}
          size="sm"
          variant={colorScheme ? "solid" : ""}
          zIndex="1"
          {...props}
        >
          {label}
        </Button>
      </Box>
    )
  }),
)

NavigationBarButton.displayName = "NavigationBarButton"

/**
 * An indicator that appears when hovering over a navigation bar button.
 *
 * @returns A hover indicator for the navigation bar button.
 */
export const NavigationBarHoverIndicator = () => {
  return (
    <Motion
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        border: "1.5px solid transparent",
        background:
          "linear-gradient(15deg, rgba(255, 255, 255, 0.00) 33.61%, #FFFFFF 89.19%) border-box, rgba(255, 255, 255, 0.07) border-box",
        mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
      animate={{ opacity: 1 }}
      backdropBlur="xl"
      backdropFilter="auto"
      bgGradient="secondaryGradient"
      borderRadius="150px"
      data-testid="navbar-hover-indicator"
      exit={{ opacity: 0.25, transition: { duration: 0.4 } }}
      height={8}
      initial={{ opacity: 0 }}
      inset={0}
      layoutId="navigation-bar-indicator"
      position="absolute"
      px="md"
      transform={"translateY(-0.75px)"}
      transition={{
        layout: { type: "spring", stiffness: 275, damping: 25 },
        default: { duration: 0.3, ease: "easeOut" },
      }}
      zIndex="0"
    />
  )
}
