import type { Link } from "@repo/shared/payload-types"
import { LinkTreeIcon } from "@repo/ui/components/Icon"
import { FacebookIcon, InstagramIcon } from "@yamada-ui/lucide"
import type { FC } from "react"

export type LinkGroup = {
  title: string
  links: Link[]
}

export type SocialLink = Link & {
  icon: FC
}

// TODO: THESE WILL BE REPLACED WITH PAYLOAD

export const MOCK_LINKS: Record<string, LinkGroup> = {
  linkGroup1: {
    title: "Quick Links",
    links: [
      {
        label: "Home",
        url: "/",
      },
      {
        label: "Book a Court",
        url: "/book",
      },
      {
        label: "Events",
        url: "/events",
      },
    ],
  },
  linkGroup2: {
    title: "UABC",
    links: [
      {
        label: "About Us",
        url: "/about",
      },
      {
        label: "Contact Us",
        url: "/contact",
      },
      {
        label: "FAQs",
        url: "/faq",
      },
    ],
  },
}

export const MOCK_SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkTree",
    url: "https://linktr.ee/",
    icon: LinkTreeIcon,
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/",
    icon: InstagramIcon,
  },
]
