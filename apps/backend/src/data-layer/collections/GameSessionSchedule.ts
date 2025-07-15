import { Weekday } from "@repo/shared"
import type { CollectionConfig } from "payload"
import { createTimeField } from "@/data-layer/fields/date-time"

export const GameSessionSchedule: CollectionConfig = {
  slug: "gameSessionSchedule",
  access: {},
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: "The name of the game session schedule, e.g. UoA Rec Centre",
      },
    },
    {
      name: "location",
      type: "text",
      required: true,
      admin: {
        description: "The location of the game session schedule, e.g. 17 Symonds Street",
      },
    },
    {
      name: "semester",
      type: "relationship",
      relationTo: "semester",
      required: true,
      admin: {
        description: "The semester this game session schedule belongs to",
      },
    },
    {
      name: "day",
      type: "select",
      options: Object.values(Weekday),
      required: true,
      admin: {
        description: "The day of the week this game session schedule belongs to",
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
