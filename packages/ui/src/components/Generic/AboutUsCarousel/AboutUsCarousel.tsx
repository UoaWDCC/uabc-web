"use client"
import { Image, type ImageProps } from "@repo/ui/components/Primitive"
import {
  Carousel,
  type CarouselProps,
  CarouselSlide,
  type CarouselSlideProps,
} from "@yamada-ui/carousel"
import { Box, type CenterProps, type FloatProps, type StackProps, VStack } from "@yamada-ui/react"
import { type FC, memo, useCallback, useState } from "react"
import { AboutUsCarouselEmoji } from "./AboutUsCarouselEmoji"

/**
 * Item for {@link AboutUsCarousel} component
 */
export interface AboutUsCarouselItem extends Pick<ImageProps, "src" | "alt" | "width" | "height"> {
  /**
   * Emoji to display for this slide
   */
  emoji: string
}

/**
 * Props for {@link AboutUsCarousel} component
 */
export interface AboutUsCarouselProps extends Omit<CarouselProps, "children"> {
  /**
   * Props to customize the outer VStack wrapper
   */
  wrapperProps?: StackProps
  /**
   * Props to customize the floating emoji container
   */
  floatProps?: FloatProps
  /**
   * Props to customize the emoji icon Center
   */
  iconProps?: CenterProps
  /**
   * Array of items (image + emoji) to display as carousel slides
   *
   * @example
   * items: [
   *   { src: "https://example.com/image.jpg", alt: "Description", width: 600, height: 400, emoji: "😄" }
   * ]
   */
  items: AboutUsCarouselItem[]
  /**
   * Props to customize each CarouselSlide
   */
  slideProps?: CarouselSlideProps
}

/**
 * AboutUsCarousel component displays a carousel of images or custom slides with a floating happy emoji.
 *
 * @param props AboutUsCarousel component properties
 * @returns A memoized carousel component with optional images and a floating emoji
 *
 * @example
 * // Basic usage with items
 * <AboutUsCarousel
 *   items={[
 *     { src: "https://example.com/image1.jpg", alt: "Image 1", width: 600, height: 400, emoji: "😄" },
 *     { src: "https://example.com/image2.jpg", alt: "Image 2", width: 600, height: 400, emoji: "😍" }
 *   ]}
 * />
 */
export const AboutUsCarousel: FC<AboutUsCarouselProps> = memo(
  ({ wrapperProps, floatProps, iconProps, items, slideProps, ...props }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const handleChange = useCallback((index: number) => {
      setSelectedIndex(index)
    }, [])

    const currentEmoji = items[selectedIndex].emoji

    return (
      <VStack position="relative" {...wrapperProps}>
        <Carousel
          controlProps={{
            bg: ["whiteAlpha.500", "blackAlpha.600"],
            _hover: {
              bg: ["whiteAlpha.600", "blackAlpha.700"],
            },
            backdropFilter: "blur(10px)",
          }}
          indicatorsProps={{
            component: () => (
              <Box
                _hover={{
                  bg: ["blackAlpha.500", "whiteAlpha.600"],
                }}
                _selected={{
                  bg: ["blackAlpha.600", "whiteAlpha.700"],
                  _hover: {
                    bg: ["blackAlpha.700", "whiteAlpha.800"],
                  },
                  w: "12",
                }}
                backdropFilter="blur(10px)"
                bg={["blackAlpha.400", "whiteAlpha.500"]}
                cursor="pointer"
                h="3"
                rounded="full"
                transitionDuration="fast"
                transitionProperty="background, width"
                w="3"
              />
            ),
            marginBottom: "calc(sm - xl)",
          }}
          onChange={handleChange}
          {...props}
        >
          {items?.map((item) => (
            <CarouselSlide key={item.src as string} {...slideProps} position="relative">
              <Image h="full" overflow="clip" rounded="xl" w="full" {...item} />
            </CarouselSlide>
          ))}
        </Carousel>
        <AboutUsCarouselEmoji currentEmoji={currentEmoji} iconProps={iconProps} {...floatProps} />
      </VStack>
    )
  },
)

AboutUsCarousel.displayName = "AboutUsCarousel"
