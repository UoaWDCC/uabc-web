import type { GlobalConfig } from "payload"

export const Navbar: GlobalConfig = {
  slug: "navbar",
  fields: [
    {
      name: "logo",
      type: "relationship",
      required: true,
      relationTo: "media",
      defaultValue: {
        alt: "Logo",
        filename: "Logo.png",
        url: "/payload/api/media/file/Logo.png",
        updatedAt: new Date(2025, 0, 1).toISOString(),
        createdAt: new Date(2025, 0, 1).toISOString(),
        width: 55,
        height: 54,
        focalX: 50,
        focalY: 50,
        id: "ccaf8f75ceb9f059773d4774",
      },
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
            description: "The text displayed for the login button.",
          },
        },
        {
          name: "url",
          type: "text",
          required: true,
          defaultValue: "/auth/login",
          admin: {
            description: "The URL the login button points to.",
          },
        },
      ],
      admin: {
        description: "Single button displayed on the right side of the navbar.",
      },
    },
  ],
}
