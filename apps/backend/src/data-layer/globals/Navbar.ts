import type { GlobalConfig } from "payload"

export const Navbar: GlobalConfig = {
  slug: "navbar",
  fields: [
    {
      name: "logo",
      type: "relationship",
      required: true,
      relationTo: "media",
      admin: {
        description: "The logo displayed in the navbar.",
      },
    },
    {
      name: "navItems",
      type: "array",
      interfaceName: "LinkArray",
      required: true,
      maxRows: 5,
      defaultValue: [
        {
          label: "Book",
          url: "/book",
        },
        {
          label: "Events",
          url: "/events",
        },
        {
          label: "About",
          url: "/about",
        },
        {
          label: "Contact",
          url: "/contact",
        },
        {
          label: "FAQ",
          url: "/faq",
        },
      ],
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          admin: {
            description: "The text displayed for the navigation item.",
          },
        },
        {
          name: "url",
          type: "text",
          required: true,
          admin: {
            description: "The URL the navigation item points to.",
          },
        },
      ],
      admin: {
        description: "Navigation items (max 5).",
      },
    },
    {
      name: "rightSideSingleButton",
      type: "group",
      interfaceName: "Link",
      required: true,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          defaultValue: "Log in",
          admin: {
            description: "The text displayed for the sign in button.",
          },
        },
        {
          name: "url",
          type: "text",
          required: true,
          defaultValue: "/auth/login",
          admin: {
            description: "The URL the sign in button points to.",
          },
        },
      ],
      admin: {
        description: "Single button displayed on the right side of the navbar.",
      },
    },
  ],
}
