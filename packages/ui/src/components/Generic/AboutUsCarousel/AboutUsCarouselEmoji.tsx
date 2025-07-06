import { Center, type CenterProps, Float, type FloatProps } from "@yamada-ui/react"
import type { FC } from "react"

export interface AboutUsCarouselEmojiProps extends FloatProps {
  iconProps?: CenterProps
  currentEmoji: string
}

export const AboutUsCarouselEmoji: FC<AboutUsCarouselEmojiProps> = ({
  iconProps,
  currentEmoji,
  ...props
}) => {
  return (
    <Float placement="end-end" {...props}>
      <Center
        backdropFilter="blur(10px)"
        bg="transparentize(primary, 50%)"
        fontSize="4xl"
        h="14"
        p="2"
        rounded="full"
        w="14"
        {...iconProps}
      >
        {currentEmoji}
      </Center>
    </Float>
  )
}
