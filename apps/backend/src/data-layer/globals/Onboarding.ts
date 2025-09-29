import type { GlobalConfig } from "payload"

export const Onboarding: GlobalConfig = {
  slug: "onboarding",
  fields: [
    {
      name: "casualMemberInformation",
      type: "richText",
      required: true,
      admin: {
        description: "The casual member information to be displayed on user signup flow.",
      },
    },
  ],
}
