import type { Meta, StoryObj } from "@storybook/nextjs-vite"

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

export const WithQuery: StoryObj<typeof Link> = {
  args: {
    href: "/events",
    query: { category: "tennis", page: 2 },
    children: "Events (tennis, page 2)",
  },
}

export const WithCustom: StoryObj<typeof Link> = {
  args: {
    href: "/custom-route",
    custom: true,
    children: "Custom Route",
  },
}

export const External: StoryObj<typeof Link> = {
  args: {
    href: "https://example.com",
    external: true,
    children: "External",
  },
}

export const ExternalWithQuery: StoryObj<typeof Link> = {
  args: {
    href: "https://example.com",
    external: true,
    query: { foo: "bar" },
    children: "External (foo=bar)",
  },
}
