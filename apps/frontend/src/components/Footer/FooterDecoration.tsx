import Shuttle from "@/assets/shuttle.png"
import { Image } from "@repo/ui/components/Image"
import { Box, Motion } from "@yamada-ui/react"
import { memo } from "react"

export const FooterDecoration = memo(() => {
  return (
    <>
      {/* Main decorative shuttlecock */}
      <Motion
        animate={{
          y: 0,
          x: 20,
          rotate: 45,
          scale: 1,
          opacity: 1,
        }}
        display={{ base: "none", md: "block" }}
        h="fit-content"
        initial={{ y: -500, x: 0, scale: 0.8, rotate: 45, opacity: 0 }}
        left="50%"
        position="absolute"
        top="0"
        viewport={{ once: true }}
        z="-1"
      >
        <Box filter="drop-shadow(0 8px 32px rgba(59, 130, 246, 0.3))" position="relative">
          <Image
            alt=""
            aria-hidden
            h={{ base: "lg", md: "xl", lg: "2xl" }}
            objectFit={{ base: "cover", lg: "contain" }}
            opacity={{ base: "0.08", md: "0.12", lg: "0.15" }}
            src={Shuttle}
            w={{ base: "lg", md: "xl", lg: "2xl" }}
          />
        </Box>
      </Motion>

      {/* Secondary shuttlecock - smaller, different position */}
      <Motion
        animate={{
          y: 40,
          x: 50,
          rotate: -25,
          scale: 0.75,
        }}
        bottom={{ base: "40%", md: "30%" }}
        display={{ base: "block", md: "block" }}
        h="fit-content"
        initial={{ y: -300, x: -400, scale: 0.5, rotate: -30, opacity: 0 }}
        left={{ base: "2%", md: "5%" }}
        position="absolute"
        viewport={{ once: true }}
        z="-1"
      >
        <Box filter="drop-shadow(0 6px 24px rgba(147, 51, 234, 0.3))" position="relative">
          <Image
            alt=""
            aria-hidden
            h={{ base: "md", md: "lg", lg: "xl" }}
            objectFit={{ base: "cover", lg: "contain" }}
            opacity={{ base: "0.06", md: "0.08", lg: "0.1" }}
            src={Shuttle}
            w={{ base: "md", md: "lg", lg: "xl" }}
          />
        </Box>
      </Motion>
    </>
  )
})

FooterDecoration.displayName = "FooterDecoration"
