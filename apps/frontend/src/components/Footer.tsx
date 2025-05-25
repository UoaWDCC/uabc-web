import Shuttle from "@/assets/shuttle.png"
import UABCLogo from "@/assets/uabc-logo.svg"
import { LinkTreeIcon } from "@/icons/LinkTreeIcon"
import { Heading } from "@repo/ui/components/Heading"
import { Image } from "@repo/ui/components/Image"
import { FacebookIcon, InstagramIcon } from "@yamada-ui/lucide"
import {
  ButtonGroup,
  Center,
  Grid,
  GridItem,
  HStack,
  IconButton,
  List,
  ListItem,
  Separator,
  Slide,
  Spacer,
  Stack,
  Text,
  Link as UILink,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { memo } from "react"

const LINKS = {
  quick: {
    title: "Quick Links",
    links: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "Book a Court",
        href: "/book",
      },
      {
        label: "Events",
        href: "/events",
      },
    ],
  },
  uabc: {
    title: "UABC",
    links: [
      {
        label: "About Us",
        href: "/about",
      },
      {
        label: "Contact Us",
        href: "/contact",
      },
      {
        label: "FAQs",
        href: "/faqs",
      },
    ],
  },
}

export const SOCIAL_LINKS = [
  {
    label: "LinkTree",
    href: "https://linktr.ee/",
    icon: LinkTreeIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: InstagramIcon,
  },
]

export const Footer = memo(() => {
  return (
    <VStack
      as="footer"
      bg={["blackAlpha.50", "whiteAlpha.50"]}
      gap="xl"
      overflow="clip"
      position="relative"
      px={{ base: "lg", lg: "24" }}
      py={{ base: "xl", md: "24" }}
    >
      <Grid gap={{ base: "xl", lg: "0" }} templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}>
        <GridItem display={{ base: "none", md: "block" }}>
          <VStack gap="lg">
            <VStack gap="xs">
              <HStack>
                <Image alt="UABC Logo" src={UABCLogo} />
                <Heading.h2 fontSize="6xl" fontWeight="semibold">
                  UABC
                </Heading.h2>
              </HStack>
              <Text color="muted" maxW="md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore
              </Text>
            </VStack>
            <ButtonGroup display={{ base: "none", lg: "flex" }} gap="xs">
              {SOCIAL_LINKS.map(({ icon: Icon, ...link }) => (
                <IconButton
                  aria-label={link.label}
                  as={Link}
                  href={link.href}
                  key={link.label}
                  variant="ghost"
                >
                  <Icon color="muted" fontSize="2xl" />
                </IconButton>
              ))}
            </ButtonGroup>
          </VStack>
        </GridItem>
        <GridItem>
          <Stack flexDir={{ base: "column", lg: "row" }} justifyContent="space-between" maxW="lg">
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
        </GridItem>
      </Grid>
      <Separator />
      <Stack as={Center} flexDir={{ base: "column", lg: "row" }} fontSize="md">
        <ButtonGroup display={{ base: "flex", lg: "none" }} gap="xs">
          {SOCIAL_LINKS.map(({ icon: Icon, ...link }) => (
            <IconButton as={Link} href={link.href} key={link.label} variant="ghost">
              <Icon color="muted" fontSize="4xl" />
            </IconButton>
          ))}
        </ButtonGroup>
        <VStack
          fontSize="sm"
          gap={{ base: "xs", lg: "sm" }}
          textAlign={{ base: "center", lg: "left" }}
        >
          <Text color="muted">
            &copy; {new Date().getFullYear()} University of Auckland Badminton Club.
          </Text>
          <Text color="muted">All rights reserved.</Text>
        </VStack>
        <Spacer />
        <Text color="muted" display={{ base: "none", lg: "block" }} textWrap="nowrap">
          Developed by the 2025 WDCC UABC Team
        </Text>
      </Stack>
      <Slide duration={1} h="full" open position="absolute" right="0" top="0" w="full" z="-1">
        <Image
          alt="Shuttle"
          h="full"
          objectFit={{ base: "cover", lg: "contain" }}
          src={Shuttle} // TODO: Better image that's not rotated
          w="full"
        />
      </Slide>
    </VStack>
  )
})

Footer.displayName = "Footer"
