import type { GlobalConfig } from "payload"

export const Tos: GlobalConfig = {
  slug: "termsOfService",
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
          type: "richText",
          required: true,
          admin: {
            description: "The rules for the check-in.",
          },
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
          type: "richText",
          required: true,
          admin: {
            description: "The rules for the session.",
          },
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
          name: "disclaimer",
          type: "richText",
          required: true,
          admin: {
            description: "The disclaimer text.",
          },
        },
      ],
    },
  ],
}
