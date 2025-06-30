import { IconButton } from "@repo/ui/components/Button"
import {
  ButtonGroup,
  type ButtonGroupProps,
  type IconButtonProps,
  type IconProps,
} from "@yamada-ui/react"
import Link from "next/link"
import { memo } from "react"
import { SOCIAL_LINKS } from "./constants"

interface FooterSocialLinksProps extends ButtonGroupProps {
  iconButtonProps?: IconButtonProps
  iconProps?: IconProps
}

export const FooterSocialLinks = memo<FooterSocialLinksProps>(
  ({ iconButtonProps, iconProps, ...props }) => {
    return (
      <ButtonGroup variant="ghost" {...props}>
        {SOCIAL_LINKS.map(({ icon: Icon, ...link }) => (
          <IconButton
            aria-label={link.label}
            as={Link}
            href={link.href}
            key={link.label}
            rel="noopener noreferrer"
            target="_blank"
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
