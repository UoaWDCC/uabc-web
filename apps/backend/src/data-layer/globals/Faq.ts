import type { GlobalConfig } from "payload"

export const FAQ: GlobalConfig = {
  slug: "faq",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      defaultValue: "FAQs",
      admin: {
        description: "The title for the FAQ section.",
      },
    },
    {
      name: "questions",
      type: "array",
      interfaceName: "FaqQuestion",
      required: true,
      fields: [
        {
          name: "questionTitle",
          type: "text",
          required: true,
          admin: {
            description: "The title for this FAQ section, usually the question itself.",
          },
        },
        {
          name: "description",
          type: "textarea",
          required: true,
          admin: {
            description: "A detailed answer to this FAQ question.",
          },
        },
      ],
    },
  ],
}
