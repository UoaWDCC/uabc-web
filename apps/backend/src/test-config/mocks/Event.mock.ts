import type { CreateEventData } from "@repo/shared"

export const eventCreateMock: CreateEventData = {
  title: "mockTitle",
  longDescription: {
    root: {
      type: "root",
      children: [
        {
          type: "paragraph",
          version: 1,
          children: [
            {
              type: "text",
              text: "textString",
              version: 1,
            },
          ],
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  },
  shortDescription: "short",
  eventImage: "6f7a8b9c0d1e8f3a2b1c4d5e",
  button1: {
    label: "testLabel1",
    url: "https://uoabadminton.co.nz/",
  },
  button2: {
    label: "testLabel2",
    url: "https://uoabadminton.co.nz/",
  },
}
