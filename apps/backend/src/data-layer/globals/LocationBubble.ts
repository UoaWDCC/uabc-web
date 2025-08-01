import type { GlobalConfig } from "payload"

export const LocationBubble: GlobalConfig = {
  slug: "locationBubble",
  fields: [
    {
      name: "LocationBubbleItems",
      type: "array",
      interfaceName: "LocationBubbleItem",
      maxRows: 3,
      fields: [
        {
          name: "locationImage",
          type: "relationship",
          required: true,
          relationTo: "media",
          admin: {
            description: "The image displayed for the location.",
          },
        },
        {
          name: "gameSessionSchedule",
          type: "relationship",
          required: true,
          relationTo: "gameSessionSchedule",
          hasMany: true,
          admin: {
            description:
              "The game session schedule displayed for location bubble description, e.g. location, session time",
          },
        },
        {
          name: "button",
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
                description: "The text displayed for the game session button.",
              },
            },
            {
              name: "url",
              type: "text",
              required: true,
              admin: {
                description: "The URL the button points to.",
              },
            },
          ],
          admin: {
            description: "Single button displayed on the location bubble.",
          },
        },
      ],
    },
  ],
  admin: {
    description: "Location bubble that will be displayed on the homepage",
  },
}
