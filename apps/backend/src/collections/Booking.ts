import { PlayLevel } from "@/types/types"
import type { CollectionConfig } from "payload"

export const Booking: CollectionConfig = {
  slug: "booking",
  access: {},
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "user",
      required: true,
      admin: {
        description: "The user who made the booking",
      },
    },
    {
      name: "gameSession",
      type: "relationship",
      relationTo: "gameSession",
      required: true,
      admin: {
        description: "The game session that was booked",
      },
    },
    {
      name: "playerLevel",
      type: "select",
      options: Object.values(PlayLevel),
      required: true,
      admin: {
        description: "The skill level of the player",
      },
    },
  ],
}
