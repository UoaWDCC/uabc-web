import type { Meta, StoryFn } from "@storybook/react"
import { BookACourt } from "./BookACourt"
import { BookACourtSkeleton } from "./BookACourtSkeleton"

const meta: Meta<typeof BookACourt> = {
  title: "Generic Components / BookACourt",
  component: BookACourt,
}
export default meta

type Story = StoryFn<typeof BookACourt>

export const Default: Story = () => <BookACourt onSelect={() => {}} />

export const Skeleton: Story = () => <BookACourtSkeleton />
