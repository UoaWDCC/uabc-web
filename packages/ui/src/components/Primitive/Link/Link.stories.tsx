import type { Meta, StoryObj } from "@storybook/nextjs"

import { Link } from "./Link"

const meta: Meta<typeof Link> = {
  title: "Primitive Components / Link",
  component: Link,
}

export default meta

export const Default: StoryObj<typeof Link> = {
  args: {
    href: "/",
    children: "Home",
  },
}
