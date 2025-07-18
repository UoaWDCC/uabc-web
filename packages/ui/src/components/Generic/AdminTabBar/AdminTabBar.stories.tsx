import type { Meta, StoryFn } from "@storybook/nextjs"
import { PropsTable } from "@storybook-config/components"
import { TabPanel } from "@yamada-ui/react"
import { TABS_VARIANTS } from "node_modules/@repo/theme/src/components/tabs"
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
    <AdminTabBar {...args} tabPanelsProps={{ bgColor: "secondary" }}>
      <TabPanel>Panel 0</TabPanel>
      <TabPanel>Panel 1</TabPanel>
      <TabPanel>Panel 2</TabPanel>
    </AdminTabBar>
  )
}

export const Variant: Story = ({ ...args }) => {
  return (
    <PropsTable columns={[""]} rows={TABS_VARIANTS}>
      {(_column, row, key) => {
        return <AdminTabBar key={key} variant={row} {...args} />
      }}
    </PropsTable>
  )
}
