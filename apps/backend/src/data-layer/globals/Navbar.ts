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
      required: true,
      maxRows: 5,
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
      name: "signInButton",
      type: "group",
      required: true,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          defaultValue: "Sign in",
          admin: {
            description: "The text displayed for the sign in button.",
          },
        },
        {
          name: "url",
          type: "text",
          required: true,
          defaultValue: "/auth/sign-in",
          admin: {
            description: "The URL the sign in button points to.",
          },
        },
      ],
      admin: {
        description: "Sign in button displayed on the right side of the navbar.",
      },
    },
  ],
}
