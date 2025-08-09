import type { GlobalConfig } from "payload"
import { validateGameSessionSchedules } from "../validators/location-bubble-validator"

export const LocationBubble: GlobalConfig = {
  slug: "locationBubble",
  admin: {
    description: "Location bubbles that will be displayed on the homepage",
  },
  fields: [
    {
      name: "locationBubbleItems",
      type: "array",
      interfaceName: "LocationBubbleItem",
      maxRows: 3,
      required: true,
      fields: [
        {
          name: "locationImage",
          type: "relationship",
          required: true,
          relationTo: "media",
          admin: {
            description: "The image displayed for the location of game session.",
          },
        },
        {
          name: "gameSessionSchedule",
          type: "relationship",
          required: true,
          relationTo: "gameSessionSchedule",
          hasMany: true,
          validate: async (val, { req }) => {
            if (!(await validateGameSessionSchedules(val, req))) {
              return "All gameSessionSchedules inside a locationBubbleItem must have the same title and location."
            }
            return true
          },
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
}
