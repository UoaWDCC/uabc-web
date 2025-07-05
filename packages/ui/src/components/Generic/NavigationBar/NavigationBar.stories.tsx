import { NAVIGATION_BAR_TEST_CONSTANTS } from "@repo/ui/test-config/mocks/NavigationBar.mock"
import type { Meta, StoryObj } from "@storybook/react"
import { NavigationBar } from "./NavigationBar"

type Story = StoryObj<typeof NavigationBar>

const meta: Meta<typeof NavigationBar> = {
  component: NavigationBar,
  title: "Generic Components / NavigationBar",
  argTypes: {
    user: {
      control: "object",
      description: "User object containing user information (name and profile image src)",
      table: { type: { summary: "User | null" } },
    },
    admin: {
      control: "boolean",
      description: "Indicates if the user is an admin",
      table: { type: { summary: "boolean" } },
    },
    navItems: {
      control: "object",
      description: "Array of navigation items with label and path",
      table: {
        type: { summary: "Array<{ label: string; path: string }>" },
      },
    },
  },
  args: {
    user: undefined,
    admin: undefined,
    navItems: NAVIGATION_BAR_TEST_CONSTANTS.navItems,
  },
}

export default meta

export const Desktop: Story = {
  render: (args) => {
    return <NavigationBar {...args} />
  },
}

export const DesktopSignedIn: Story = {
  args: {
    user: { name: "Eddie Wang", src: "https://placehold.co/300x200/png" },
    admin: false,
  },
}

export const DesktopSignedInWithAdmin: Story = {
  args: {
    user: { name: "Eddie Wang", src: "" },
    admin: true,
  },
}
