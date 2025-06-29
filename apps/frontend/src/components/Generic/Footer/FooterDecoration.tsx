import { Image } from "@repo/ui/components/Image"
import { Motion } from "@yamada-ui/react"
import { memo } from "react"
import Shuttle from "@/assets/shuttle.png"

export const FooterDecoration = memo(() => {
  return (
    <>
      {/* Main decorative shuttlecock */}
      <Motion
        animate={{
          y: 0,
          x: -20,
          rotate: 45,
          scale: 1,
          opacity: 1,
        }}
        h="fit-content"
        initial={{ y: -500, x: 500, scale: 0.8, rotate: 45, opacity: 0 }}
        left={{ lg: "50%" }}
        position="absolute"
        top={{ base: "-20%", md: "-50%" }}
        viewport={{ once: true }}
        z="-1"
      >
        <Image
          alt=""
          aria-hidden
          filter="brightness(0.5)"
          h={{ base: "lg", md: "xl", lg: "2xl" }}
          objectFit={{ base: "cover", lg: "contain" }}
          opacity={{ base: "0.08", md: "0.12", lg: "0.15" }}
          src={Shuttle}
          w={{ base: "lg", md: "xl", lg: "2xl" }}
        />
      </Motion>

      {/* Secondary shuttlecock - smaller, different position */}
      <Motion
        animate={{
          y: 40,
          x: 0,
          rotate: -25,
          scale: 0.75,
          opacity: 1,
        }}
        display={{ base: "none", lg: "block" }}
        h="fit-content"
        initial={{ y: -300, x: -400, scale: 0.5, rotate: -30, opacity: 0 }}
        left={{ base: "-10%", xl: "0" }}
        position="absolute"
        top="-100%"
        viewport={{ once: true }}
        z="-1"
      >
        <Image
          alt=""
          aria-hidden
          filter="brightness(0.6)"
          h={{ base: "md", md: "lg", lg: "xl" }}
          objectFit={{ base: "cover", lg: "contain" }}
          opacity={{ base: "0.06", md: "0.08", lg: "0.1" }}
          src={Shuttle}
          w={{ base: "md", md: "lg", lg: "xl" }}
        />
      </Motion>
    </>
  )
})

FooterDecoration.displayName = "FooterDecoration"
