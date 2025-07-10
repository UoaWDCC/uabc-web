import type { Meta, StoryFn } from "@storybook/nextjs"
import { TabPanel } from "@yamada-ui/react"
import { AdminTabBar } from "./AdminTabBar"

type Story = StoryFn<typeof AdminTabBar>

const meta = {
  title: "Generic Components / AdminTabBar",
  component: AdminTabBar,
  argTypes: {},
} satisfies Meta<typeof AdminTabBar>

export default meta

export const Default: Story = ({ ...args }) => {
  return <AdminTabBar {...args} />
}

export const WithTabPanels: Story = ({ ...args }) => {
  return (
    <AdminTabBar {...args}>
      <TabPanel bgColor="secondary">Panel 1</TabPanel>
      <TabPanel bgColor="secondary">Panel 2</TabPanel>
      <TabPanel bgColor="secondary">Panel 3</TabPanel>
    </AdminTabBar>
  )
}

export const Variant: Story = ({ ...args }) => {
  return <AdminTabBar {...args} />
}
