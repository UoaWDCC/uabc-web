import type { CollectionConfig } from "payload"
import { createTimeField } from "@/data-layer/fields/date-time"

export const GameSessionSchedule: CollectionConfig = {
  slug: "gameSessionSchedule",
  access: {},
  fields: [
    {
      name: "semester",
      type: "relationship",
      relationTo: "semester",
      required: true,
      admin: {
        description: "The semester this game session schedule belongs to",
      },
    },
    createTimeField("startTime", "The start time of the game session"),
    createTimeField("endTime", "The end time of the game session"),
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
