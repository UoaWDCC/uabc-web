import { Image, type ImageProps } from "@repo/ui/components/Primitive"
import {
  Carousel,
  type CarouselProps,
  CarouselSlide,
  type CarouselSlideProps,
} from "@yamada-ui/carousel"
import {
  Box,
  Center,
  type CenterProps,
  Float,
  type FloatProps,
  type StackProps,
  VStack,
} from "@yamada-ui/react"
import { type FC, memo, useMemo } from "react"

/**
 * Props for {@link AboutUsCarousel} component
 */
export interface AboutUsCarouselProps extends CarouselProps {
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
   * Array of image objects to display as carousel slides
   * Each image should include src, alt, width, and height
   *
   * @example
   * images: [
   *   { src: "https://example.com/image.jpg", alt: "Description", width: 600, height: 400 }
   * ]
   */
  images?: Pick<ImageProps, "src" | "alt" | "width" | "height">[]
  /**
   * Props to customize each CarouselSlide
   */
  slideProps?: CarouselSlideProps
}

const happyEmojis = ["😄", "😁", "😃", "😊", "😆", "😍", "😂", "🤩"]

/**
 * AboutUsCarousel component displays a carousel of images or custom slides with a floating happy emoji.
 *
 * @param props - AboutUsCarousel component properties
 * @param props.wrapperProps - Props for the outer VStack wrapper
 * @param props.floatProps - Props for the floating emoji container
 * @param props.iconProps - Props for the emoji icon Center
 * @param props.images - Array of images to display as carousel slides
 * @param props.slideProps - Props for each CarouselSlide
 * @param props.children - Additional CarouselSlide or custom content
 * @returns A memoized carousel component with optional images and a floating emoji
 *
 * @example
 * // Basic usage with images
 * <AboutUsCarousel
 *   images={[
 *     { src: "https://example.com/image1.jpg", alt: "Image 1", width: 600, height: 400 },
 *     { src: "https://example.com/image2.jpg", alt: "Image 2", width: 600, height: 400 }
 *   ]}
 * />
 *
 * @example
 * // With custom slides
 * <AboutUsCarousel>
 *   <CarouselSlide>Custom Content</CarouselSlide>
 * </AboutUsCarousel>
 */
export const AboutUsCarousel: FC<AboutUsCarouselProps> = memo(
  ({ children, wrapperProps, floatProps, iconProps, images, slideProps, ...props }) => {
    const randomEmoji = useMemo(() => {
      return happyEmojis[Math.floor(Math.random() * happyEmojis.length)]
    }, [])

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
          {...props}
        >
          {images?.map((image) => (
            <CarouselSlide key={image.src as string} {...slideProps}>
              <Image h="full" overflow="clip" rounded="xl" {...image} />
            </CarouselSlide>
          ))}
          {children}
        </Carousel>
        <Float placement="end-end" {...floatProps}>
          <Center bg="primary" fontSize="4xl" h="14" p="2" rounded="full" w="14" {...iconProps}>
            {randomEmoji}
          </Center>
        </Float>
      </VStack>
    )
  },
)

AboutUsCarousel.displayName = "AboutUsCarousel"
