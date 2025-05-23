import { cx, omitThemeProps, ui, useComponentStyle } from "@yamada-ui/react"
import NextImage from "next/image"
import { forwardRef } from "react"
import type { CustomNextImageProps } from "./Image.types"

/**
 * Internal styled Next.js Image component with Yamada UI integration.
 *
 * @param props - Props for the styled Next.js Image.
 * @param ref - React ref forwarded to the underlying image element.
 * @returns A styled Next.js Image component.
 */
const Component = ui<typeof NextImage, CustomNextImageProps>(NextImage, {
  disableStyleProp: (prop) => ["fill", "height", "width"].includes(prop),
})

/**
 * CustomNextImage is a styled wrapper around Next.js Image, supporting Yamada UI theming.
 *
 * @param props - CustomNextImageProps for the image.
 * @param ref - React ref forwarded to the underlying image element.
 * @returns A styled Next.js Image component.
 */
export const CustomNextImage = forwardRef<HTMLImageElement, CustomNextImageProps>((props, ref) => {
  const [css, mergedProps] = useComponentStyle("Image", props)
  const { className, ...rest } = omitThemeProps(mergedProps)

  return <Component __css={css} className={cx("ui-image", className)} ref={ref} {...rest} />
})

CustomNextImage.displayName = "CustomNextImage"
