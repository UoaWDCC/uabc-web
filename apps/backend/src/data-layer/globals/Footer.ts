import type { GlobalConfig } from "payload"

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      defaultValue: "UABC",
      admin: {
        description: "The main title of the footer, usually the name of the club. ",
      },
    },
    {
      name: "description",
      type: "textarea",
      defaultValue: "The largest university badminton club in New Zealand!",
      admin: {
        description: "A brief description of the club.",
      },
    },
  ],
}
