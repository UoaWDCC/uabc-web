import { CollectionConfig } from "payload"

export const GameSession: CollectionConfig = {
  slug: "gameSession",
  access: {},
  fields: [
    {
      name: "gameSessionSchedule",
      type: "relationship",
      relationTo: "gameSessionSchedule",
      required: false,
      admin: {
        description:
          "The game session schedule for this game session. This is optional in case there is an extra schedule that doesn't require a schedule.",
      },
    },
    {
      name: "semester",
      type: "relationship",
      relationTo: "semester",
      required: true,
      admin: {
        description:
          "The semester this game session belongs to. This is required because a game session can't exist without a semester.",
      },
    },
    {
      name: "startTime",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        description: "The start time of the game session",
      },
    },
    {
      name: "endTime",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        description: "The end time of the game session",
      },
    },
    {
      name: "capacity",
      type: "number",
      required: true,
      admin: {
        description: "The number of players that can join this game session",
      },
    },
    {
      name: "casualCapacity",
      type: "number",
      required: true,
      admin: {
        description: "The number of casual players that can join this game session",
      },
    },
  ],
}
