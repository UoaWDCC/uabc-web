import { Gender, MembershipType, PlayLevel, University } from "@repo/shared"
import type { CollectionConfig } from "payload"

export const User: CollectionConfig = {
  slug: "user",
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
      admin: {
        description: "The first name of the user",
      },
    },
    {
      name: "lastName",
      type: "text",
      required: false,
      admin: {
        description: "The last name of the user",
      },
    },
    {
      name: "email",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      options: Object.values(MembershipType),
      defaultValue: MembershipType.casual,
      admin: {
        description: "The role of the user",
      },
    },
    {
      name: "phoneNumber",
      type: "text",
      required: false,
      admin: {
        description: "The phone number of the user",
      },
    },
    {
      name: "playLevel",
      type: "select",
      required: false,
      options: Object.values(PlayLevel),
      admin: {
        description: "The player level of the user",
      },
    },
    {
      name: "gender",
      type: "select",
      required: false,
      options: Object.values(Gender),
      admin: {
        description: "The gender of the user",
      },
    },
    {
      name: "dietaryRequirements",
      type: "text",
      required: false,
      admin: {
        description: "The dietary requirements of the user",
      },
    },
    {
      name: "studentId",
      type: "text",
      required: false,
      admin: {
        description: "The student ID of the user",
      },
    },
    {
      name: "studentUpi",
      type: "text",
      required: false,
      admin: {
        description: "The student UPI of the user",
      },
    },
    {
      name: "university",
      type: "select",
      required: false,
      options: Object.values(University),
      admin: {
        description: "The university of the user",
      },
    },
    {
      name: "remainingSessions",
      type: "number",
      required: false,
      defaultValue: 0,
      admin: {
        description: "The number of remaining sessions the user has",
      },
    },
    {
      name: "image",
      type: "relationship",
      relationTo: "media",
      required: false,
      admin: {
        description: "The image of the user",
      },
    },
    {
      name: "emailVerificationCode",
      type: "text",
      required: false,
      admin: {
        description: "The email verification token of the user",
      },
    },
  ],
}
