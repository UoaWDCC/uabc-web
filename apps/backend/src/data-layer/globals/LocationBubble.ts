import type { GlobalBeforeValidateHook, GlobalConfig } from "payload"

const validateGameSessionSchedules: GlobalBeforeValidateHook = async ({ data, req }) => {
  const locationBubbleItems = data.LocationBubbleItems

  for (const item of locationBubbleItems) {
    const scheduleIds = item.gameSessionSchedule

    const schedules = await Promise.all(
      scheduleIds.map((id: string) =>
        req.payload.findByID({
          collection: "gameSessionSchedule",
          id,
        }),
      ),
    )

    const first = schedules[0]
    for (const schedule of schedules) {
      if (schedule.name !== first.name || schedule.location !== first.location) {
        throw new Error(
          "All gameSessionSchedules inside a locationBubbleItem must have the same title and location.",
        )
      }
    }
  }

  return data
}

export const LocationBubble: GlobalConfig = {
  slug: "locationBubble",
  fields: [
    {
      name: "locationBubbleItems",
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
  hooks: {
    beforeValidate: [validateGameSessionSchedules],
  },
  admin: {
    description: "Location bubble that will be displayed on the homepage",
  },
}
