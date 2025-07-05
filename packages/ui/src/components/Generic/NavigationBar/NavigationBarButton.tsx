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
