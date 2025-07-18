import type { GlobalConfig } from "payload"

export const Tos: GlobalConfig = {
  slug: "tos",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      defaultValue: "Terms of Service",
      admin: {
        description: "The title for the Terms of Service section.",
      },
    },
    {
      name: "codeOfConduct",
      type: "group",
      interfaceName: "CodeOfConduct",
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          defaultValue: "Code of Conduct",
          admin: {
            description: "The title for the Code of Conduct section.",
          },
        },
        {
          name: "subtitle",
          type: "text",
          required: true,
          defaultValue: "Want to play? Read here!",
          admin: {
            description: "The subtitle for the Code of Conduct section.",
          },
        },
        {
          name: "checkInRules",
          type: "group",
          interfaceName: "CheckInRules",
          required: true,
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              defaultValue: "Check-In Rules",
              admin: {
                description: "The title for the check-in rules section.",
              },
            },
            {
              name: "rules",
              type: "array",
              interfaceName: "CheckInRule",
              required: true,
              fields: [
                {
                  name: "rule",
                  type: "richText",
                  required: true,
                  admin: {
                    description: "A check-in rule.",
                  },
                },
              ],
            },
          ],
        },
        {
          name: "sessionRules",
          type: "group",
          interfaceName: "SessionRules",
          required: true,
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              defaultValue: "At a session? Follow these!",
              admin: {
                description: "The title for the session rules section.",
              },
            },
            {
              name: "rules",
              type: "array",
              interfaceName: "SessionRule",
              required: true,
              fields: [
                {
                  name: "rule",
                  type: "richText",
                  required: true,
                  admin: {
                    description: "A session rule.",
                  },
                },
              ],
            },
          ],
        },
        {
          name: "disclaimer",
          type: "group",
          interfaceName: "Disclaimer",
          required: true,
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              defaultValue: "Disclaimer",
              admin: {
                description: "The title for the disclaimer section.",
              },
            },
            {
              name: "items",
              type: "array",
              interfaceName: "DisclaimerItem",
              required: true,
              fields: [
                {
                  name: "item",
                  type: "richText",
                  required: true,
                  admin: {
                    description: "A disclaimer item.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
