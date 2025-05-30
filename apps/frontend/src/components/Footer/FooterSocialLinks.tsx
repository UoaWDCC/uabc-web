import { ButtonGroup, IconButton, type ResponsiveObject } from "@yamada-ui/react"
import Link from "next/link"
import { memo } from "react"
import { SOCIAL_LINKS } from "./constants"

interface FooterSocialLinksProps {
  display?: ResponsiveObject<string>
  gap?: string
  iconSize?: string
  variant?: string
}

export const FooterSocialLinks = memo<FooterSocialLinksProps>(
  ({ display, gap = "xs", iconSize = "2xl", variant = "ghost" }) => {
    return (
      <ButtonGroup display={display} gap={gap}>
        {SOCIAL_LINKS.map(({ icon: Icon, ...link }) => (
          <IconButton
            aria-label={link.label}
            as={Link}
            href={link.href}
            key={link.label}
            rel="noopener noreferrer"
            target="_blank"
            variant={variant}
          >
            <Icon color="muted" fontSize={iconSize} />
          </IconButton>
        ))}
      </ButtonGroup>
    )
  },
)

FooterSocialLinks.displayName = "FooterSocialLinks"
