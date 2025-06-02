import { Heading } from "@repo/ui/components/Heading"
import { List, ListItem, Stack, Link as UILink } from "@yamada-ui/react"
import Link from "next/link"
import { memo } from "react"
import { LINKS } from "./constants"

export const FooterLinks = memo(() => {
  return (
    <Stack
      flexDir={{ base: "column", sm: "row" }}
      gap="lg"
      justifyContent={{ base: "center", sm: "space-between" }}
      maxW="md"
      w="full"
    >
      {Object.entries(LINKS).map(([key, value]) => (
        <List key={key}>
          <ListItem>
            <Heading.h3 fontWeight="semibold">{value.title}</Heading.h3>
          </ListItem>
          <List color="muted" fontWeight="semibold">
            {value.links.map((link) => (
              <ListItem key={link.label}>
                <UILink as={Link} color="muted" href={link.href}>
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
