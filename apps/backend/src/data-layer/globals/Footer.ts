import type { GlobalConfig } from "payload"

export const Footer: GlobalConfig = {
  slug: "footer",
  fields: [
    {
      name: "logo",
      type: "relationship",
      required: true,
      relationTo: "media",
      admin: {
        description: "The logo of the club, displayed in the footer.",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      defaultValue: "UABC",
      admin: {
        description: "The main title of the footer, usually the name of the club. ",
      },
    },
    {
      name: "facebook",
      type: "text",
      required: true,
      defaultValue: "https://www.facebook.com/groups/uoabadminton/",
      admin: {
        description: "The URL to the club's Facebook page.",
      },
    },
    {
      name: "instagram",
      type: "text",
      required: true,
      defaultValue: "https://www.instagram.com/uoa.badminton/",
      admin: {
        description: "The URL to the club's Instagram page.",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      defaultValue: "The largest university badminton club in New Zealand!",
      admin: {
        description: "A brief description of the club.",
      },
    },
    {
      name: "linkGroup1",
      type: "group",
      interfaceName: "LinkGroup",
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          defaultValue: "Quick Links",
          admin: {
            description: "The title for the first group of links.",
          },
        },
        {
          name: "links",
          type: "array",
          required: true,
          maxRows: 5,
          interfaceName: "Link",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              admin: {
                description: "The text displayed for the link.",
              },
            },
            {
              name: "url",
              type: "text",
              required: true,
              admin: {
                description: "The URL the link points to.",
              },
            },
          ],
        },
      ],
    },
    {
      name: "linkGroup2",
      type: "group",
      interfaceName: "LinkGroup",
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          defaultValue: "UABC",
          admin: {
            description: "The title for the second group of links.",
          },
        },
        {
          name: "links",
          type: "array",
          required: true,
          maxRows: 5,
          interfaceName: "Link",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              admin: {
                description: "The text displayed for the link.",
              },
            },
            {
              name: "url",
              type: "text",
              required: true,
              admin: {
                description: "The URL the link points to.",
              },
            },
          ],
        },
      ],
    },
    {
      name: "copyright",
      type: "textarea",
      required: true,
      defaultValue: "© 2025 University of Auckland Badminton Club. \nAll rights reserved.",
      admin: {
        description: "Copyright notice for the club.",
      },
    },
    {
      name: "credits",
      type: "textarea",
      required: false,
      defaultValue: "Developed by the 2025 WDCC UABC Team.",
      admin: {
        description: "Credits or acknowledgments for the site.",
      },
    },
  ],
}
