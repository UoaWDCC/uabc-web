import type { GlobalConfig } from "payload"

export const AboutUsInfo: GlobalConfig = {
  slug: "aboutUsInfo",
  fields: [
    {
      name: "items",
      type: "array",
      interfaceName: "AboutUsInfoItems",
      minRows: 3,
      maxRows: 3,
      required: true,
      defaultValue: [
        {
          heading: "Who We Are",
          description:
            "UABC Badminton Club is the official badminton team of UOA, bringing together students who love the game — from absolute beginners to competitive players.",
        },
        {
          heading: "What We Do",
          description:
            "We run weekly badminton sessions at 3 different locations for casual members and paid members. We also run social events and other competitions spread across the semesters!",
        },
        {
          heading: "Why Join",
          description:
            "We are a group of like-minded badminton people who love to play badminton and have fun! We also cater for all skill levels, so if you are new, this is the perfect place to start!",
        },
      ],
      fields: [
        {
          name: "heading",
          type: "text",
          required: true,
          admin: {
            description: "The heading displayed for about us info items, e.g. Who We Are.",
          },
        },
        {
          name: "description",
          type: "text",
          required: true,
          admin: {
            description: "The content displayed for about us info items.",
          },
        },
      ],
    },
  ],
}
