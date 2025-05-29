import Shuttle from "@/assets/shuttle.png"
import UABCLogo from "@/assets/uabc-logo.svg"
import { LinkTreeIcon } from "@/icons/LinkTreeIcon"
import { Heading } from "@repo/ui/components/Heading"
import { Image } from "@repo/ui/components/Image"
import { FacebookIcon, InstagramIcon } from "@yamada-ui/lucide"
import {
  ButtonGroup,
  Center,
  HStack,
  IconButton,
  List,
  ListItem,
  Motion,
  Separator,
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
      display="grid"
      gap="xl"
      overflow="clip"
      placeItems="center"
      position="relative"
      px={{ base: "lg", lg: "24" }}
      py={{ base: "xl", md: "24" }}
    >
      <HStack maxW="9xl" w="full">
        <VStack display={{ base: "none", md: "flex" }} gap="lg">
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
        <Stack
          flexDir={{ base: "column", md: "row" }}
          gap="lg"
          justifyContent={{ base: "center", lg: "space-between" }}
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
      </HStack>
      <Separator />
      <Stack as={Center} flexDir={{ base: "column", lg: "row" }} fontSize="md" maxW="9xl" w="full">
        <ButtonGroup display={{ base: "flex", lg: "none" }} gap="xs">
          {SOCIAL_LINKS.map(({ icon: Icon, ...link }) => (
            <IconButton
              aria-label={link.label}
              as={Link}
              href={link.href}
              key={link.label}
              rel="noopener noreferrer"
              target="_blank"
              variant="ghost"
            >
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
        <Text color="muted" display={{ base: "none", lg: "block" }} fontSize="sm" textWrap="nowrap">
          Developed by the 2025 WDCC UABC Team
        </Text>
      </Stack>
      <Motion
        animate={{
          y: 40,
          x: -50,
          scale: 1,
          rotate: 45,
          opacity: 1,
        }}
        h="fit-content"
        initial={{ y: -500, x: 500, scale: 0.8, rotate: 45, opacity: 0 }}
        position="absolute"
        transition={{
          duration: 1.5,
          type: "spring",
          stiffness: 60,
          damping: 8,
          mass: 1,
          restDelta: 0.01,
          restSpeed: 0.01,
          delay: 0.3,
        }}
        z="-1"
      >
        <Image
          alt=""
          aria-hidden
          h="2xl"
          objectFit={{ base: "cover", lg: "contain" }}
          opacity="0.07"
          src={Shuttle}
          w="2xl"
        />
      </Motion>
    </VStack>
  )
})

Footer.displayName = "Footer"
