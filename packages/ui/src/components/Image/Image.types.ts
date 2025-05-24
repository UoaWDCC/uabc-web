import type { Merge, ImageProps as UIImageProps } from "@yamada-ui/react"
import type { ImageProps as NextImageProps } from "next/image"

export type ImageProps = Merge<NextImageProps, Omit<UIImageProps, "src">>
