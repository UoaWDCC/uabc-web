import type { Meta, StoryObj } from "@storybook/nextjs"

import { Link } from "./Link"

const meta: Meta<typeof Link> = {
  title: "Primitive/Link",
  component: Link,
}

export default meta

export const Default: StoryObj<typeof Link> = {}
