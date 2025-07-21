"use client"
import { UabcLogo } from "@repo/ui/components/Icon"
import type { ImageProps } from "@repo/ui/components/Primitive"
import { Image } from "@repo/ui/components/Primitive"
import { useBoolean } from "@yamada-ui/react"

import { memo } from "react"

export const FooterImage = memo<ImageProps>((props) => {
  const [error, { on }] = useBoolean(false)

  if (error) {
    return <UabcLogo />
  }

  return <Image {...props} onError={on} />
})

FooterImage.displayName = "FooterImage"
