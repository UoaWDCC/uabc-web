import Shuttle from "@/assets/shuttle.png"
import { Image } from "@repo/ui/components/Image"
import { Motion } from "@yamada-ui/react"
import { memo } from "react"

export const FooterDecoration = memo(() => {
  return (
    <Motion
      animate={{
        y: 40,
        x: -50,
        scale: 1,
        rotate: 45,
        opacity: 1,
      }}
      h="fit-content"
      initial={{ y: -500, x: 500, scale: 0.8, rotate: 45, opacity: 0 }}
      position="absolute"
      transition={{
        duration: 1.5,
        type: "spring",
        stiffness: 60,
        damping: 8,
        mass: 1,
        restDelta: 0.01,
        restSpeed: 0.01,
        delay: 0.3,
      }}
      z="-1"
    >
      <Image
        alt=""
        aria-hidden
        h="2xl"
        objectFit={{ base: "cover", lg: "contain" }}
        opacity="0.07"
        src={Shuttle}
        w="2xl"
      />
    </Motion>
  )
})

FooterDecoration.displayName = "FooterDecoration"
