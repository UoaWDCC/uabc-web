import { Weekday } from "@repo/shared"
import type { CollectionConfig } from "payload"
import { createTimeField } from "@/data-layer/fields/date-time"

export const Semester: CollectionConfig = {
  slug: "semester",
  admin: {
    useAsTitle: "name",
  },
  access: {},
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: "The name of the semester",
      },
    },
    {
      name: "startDate",
      type: "date",
      required: true,
      admin: {
        description: "The start date of the semester",
      },
    },
    {
      name: "endDate",
      type: "date",
      required: true,
      admin: {
        description: "The end date of the semester",
      },
    },
    {
      name: "breakStart",
      type: "date",
      required: true,
      admin: {
        description: "The start date of the break",
      },
    },
    {
      name: "breakEnd",
      type: "date",
      required: true,
      admin: {
        description: "The end date of the break",
      },
    },
    {
      name: "bookingOpenDay",
      type: "select",
      required: true,
      options: Object.values(Weekday),
      admin: {
        description: "The day when booking opens for this semester",
      },
    },
    createTimeField("bookingOpenTime", "The time when booking opens for this semester"),
  ],
}
