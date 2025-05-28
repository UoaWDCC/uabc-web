import type { Merge, ImageProps as UIImageProps } from "@yamada-ui/react"
import type { ImageProps as NextImageProps } from "next/image"

/**
 * Props for the custom Image component.
 *
 * @remarks
 * Combines Next.js ImageProps and Yamada UI ImageProps (excluding 'src' from Yamada UI).
 * This allows the component to support both Next.js optimizations and Yamada UI styling.
 */
export type ImageProps = Merge<NextImageProps, Omit<UIImageProps, "src">>
