import type { Meta, StoryObj } from "@storybook/react"
import { FAQSkeleton } from "./FAQSkeleton"

type Story = StoryObj<typeof FAQSkeleton>

const meta: Meta<typeof FAQSkeleton> = {
  component: FAQSkeleton,
  title: "Generic Components / FAQ / Skeleton",
}

export default meta

export const Default: Story = {}
