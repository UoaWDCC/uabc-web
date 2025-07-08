import type { CollectionConfig } from "payload"

export const Event: CollectionConfig = {
  slug: "event",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "The title for the event.",
      },
    },
    {
      name: "longDescription",
      type: "richText",
      required: true,
      admin: {
        description: "A long description regarding the event.",
      },
    },
    {
      name: "shortDescription",
      type: "text",
      maxLength: 60,
      required: true,
      admin: {
        description: "A short description (60 characters limit) regarding the event",
      },
    },
    {
      name: "eventImage",
      type: "relationship",
      required: true,
      relationTo: "media",
      admin: {
        description: "The image displayed for the event.",
      },
    },
    {
      name: "button1",
      type: "group",
      interfaceName: "Link",
      required: true,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          defaultValue: "Join",
          admin: {
            description: "The text displayed for register event button.",
          },
        },
        {
          name: "url",
          type: "text",
          required: true,
          admin: {
            description: "The URL the join button points to.",
          },
        },
      ],
      admin: {
        description:
          "Single button displayed on the left of the event image for registering for event",
      },
    },
    {
      name: "button2",
      type: "group",
      interfaceName: "Link",
      required: true,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          defaultValue: "Learn more",
          admin: {
            description: "The text displayed for the learn more about the event button",
          },
        },
        {
          name: "url",
          type: "text",
          required: true,
          admin: {
            description: "The URL the learn more button points to.",
          },
        },
      ],
      admin: {
        description:
          "Single button displayed on the left of the event image to learn more about the event.",
      },
    },
  ],
}
