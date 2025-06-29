import { FacebookIcon, InstagramIcon } from "@yamada-ui/lucide"
import { LinkTreeIcon } from "@/components/Icons/LinkTreeIcon/LinkTreeIcon"

// TODO: THESE WILL BE REPLACED WITH PAYLOAD

export const LINKS = {
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
