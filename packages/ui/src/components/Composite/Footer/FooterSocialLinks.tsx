import type { IconButtonProps } from "@repo/ui/components/Primitive"
import { IconButton } from "@repo/ui/components/Primitive"
import { ButtonGroup, type ButtonGroupProps, type IconProps } from "@yamada-ui/react"
import Link from "next/link"
import { memo } from "react"
import type { SocialLink } from "./constants"

interface FooterSocialLinksProps extends ButtonGroupProps {
  iconButtonProps?: IconButtonProps
  iconProps?: IconProps
  links: SocialLink[]
}

export const FooterSocialLinks = memo<FooterSocialLinksProps>(
  ({ iconButtonProps, iconProps, links, ...props }) => {
    return (
      <ButtonGroup variant="ghost" {...props}>
        {links.map(({ icon: Icon, ...link }) => (
          <IconButton
            aria-label={link.label}
            as={Link}
            href={link.url}
            key={link.label}
            rel="noopener noreferrer"
            target="_blank"
            variant="ghost"
            {...iconButtonProps}
          >
            <Icon color="muted" fontSize="2xl" {...iconProps} />
          </IconButton>
        ))}
      </ButtonGroup>
    )
  },
)

FooterSocialLinks.displayName = "FooterSocialLinks"
