import { Heading } from "@repo/ui/components/Primitive"
import { List, ListItem, Stack, type StackProps, Link as UILink } from "@yamada-ui/react"
import Link from "next/link"
import { memo } from "react"
import type { LinkGroup } from "./constants"

export interface FooterLinksProps extends StackProps {
  links: Record<string, LinkGroup>
}

export const FooterLinks = memo<FooterLinksProps>(({ links, ...props }) => {
  return (
    <Stack
      flexDir={{ base: "column", sm: "row" }}
      gap="lg"
      justifyContent={{ base: "center", sm: "space-between" }}
      maxW="md"
      w="full"
      {...props}
    >
      {Object.entries(links).map(([key, value]) => (
        <List key={key}>
          <ListItem>
            <Heading.h3 fontWeight="semibold">{value.title}</Heading.h3>
          </ListItem>
          <List color="muted" fontWeight="semibold">
            {value.links.map((link) => (
              <ListItem key={link.label}>
                <UILink as={Link} color="muted" href={link.url}>
                  {link.label}
                </UILink>
              </ListItem>
            ))}
          </List>
        </List>
      ))}
    </Stack>
  )
})

FooterLinks.displayName = "FooterLinks"
