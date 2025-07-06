"use client"
import { AnimatePresence, Box, type ButtonProps, forwardRef, Motion } from "@yamada-ui/react"
import Link from "next/link"
import { Button } from "../../Primitive"

/**
 * Props for the NavigationBarButton component.
 */
interface NavigationBarButtonProps extends ButtonProps {
  label: string
  path: string
  hovering?: boolean
}

/**
 * NavigationBarButton component renders a button with a label and a link.
 * It also displays a hover indicator when the button is hovered.
 *
 * @param label The label of the button.
 * @param path The path to navigate to when the button is clicked.
 * @param hovering Optional boolean to indicate if the hover indicator should be shown.
 * @param props Additional props for the button component.
 * @param ref Ref to the button element.
 * @returns A button with a label and a link, with an optional hover indicator.
 */
export const NavigationBarButton = forwardRef<NavigationBarButtonProps, "a">(
  ({ label, path, hovering, ...props }, ref) => {
    return (
      <Box position="relative">
        <AnimatePresence>{hovering && <NavigationBarHoverIndicator />}</AnimatePresence>
        <Button
          as={Link}
          borderRadius="150px"
          fontSize="lg"
          href={path}
          position="relative"
          px="md"
          ref={ref}
          size="sm"
          variant={props.colorScheme ? "solid" : ""}
          zIndex="1"
          {...props}
        >
          {label}
        </Button>
      </Box>
    )
  },
)

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
      backgroundColor="gray.900"
      borderRadius="150px"
      data-testid="navbar-hover-indicator"
      exit={{ opacity: 0.25, transition: { duration: 0.4 } }}
      height="2.125rem"
      initial={{ opacity: 0 }}
      inset={0}
      layoutId="navigation-bar-indicator"
      position="absolute"
      px="md"
      transition={{
        layout: { type: "spring", stiffness: 275, damping: 25 },
        default: { duration: 0.3, ease: "easeOut" },
      }}
      zIndex="0"
    />
  )
}
